import { supabase } from '@/lib/supabase';

// ── Real-time listeners ──────────────────────────────────────────────
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn());

export const onSync = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// ── Real-time subscriptions ──────────────────────────────────────────
let initialized = false;

function initRealtime() {
  if (initialized) return;
  initialized = true;

  supabase
    .channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, notify)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, notify)
    .subscribe();
}

// ── Entity methods ───────────────────────────────────────────────────
const entityMethods = (tableName) => ({
  list: async (sortKey) => {
    initRealtime();
    let query = supabase.from(tableName).select('*');
    if (sortKey) query = query.order(sortKey);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  filter: async (query) => {
    initRealtime();
    let q = supabase.from(tableName).select('*');
    for (const [k, v] of Object.entries(query)) {
      q = q.eq(k, v);
    }
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  create: async (data) => {
    const { data: created, error } = await supabase
      .from(tableName)
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return created;
  },

  update: async (id, data) => {
    const { data: updated, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
});

// ── Seed data ────────────────────────────────────────────────────────
const seedProjects = [
  { name_ar: 'جناح معرض رياضة', name_en: 'Riyada Exhibition Stand', category: 'exhibition', images: [
    'https://picsum.photos/seed/exhibition1/800/600',
    'https://picsum.photos/seed/exhibition2/800/600',
    'https://picsum.photos/seed/exhibition3/800/600'
  ], order: 1 },
  { name_ar: 'تصميم داخلي لمكتب', name_en: 'Office Interior Design', category: 'interior', images: [
    'https://picsum.photos/seed/interior1/800/600',
    'https://picsum.photos/seed/interior2/800/600',
    'https://picsum.photos/seed/interior3/800/600'
  ], order: 2 },
  { name_ar: 'لافتة خارجية', name_en: 'Outdoor Signage', category: 'signage', images: [
    'https://picsum.photos/seed/signage1/800/600',
    'https://picsum.photos/seed/signage2/800/600',
    'https://picsum.photos/seed/signage3/800/600'
  ], order: 3 },
];

const seedContent = [
  { content_key: 'hero_title_ar', value_ar: 'اتحاد الألماس', value_en: 'Diamond Union' },
  { content_key: 'hero_title_en', value_ar: 'Diamond Union', value_en: 'Diamond Union' },
  { content_key: 'hero_subtitle_ar', value_ar: 'حلول متكاملة في المقاولات، المعارض، التشطيبات، وتجهيز المشاريع', value_en: 'Integrated solutions in contracting, exhibitions, finishing, and project setup' },
  { content_key: 'hero_subtitle_en', value_ar: 'Integrated solutions in contracting, exhibitions, finishing, and project setup', value_en: 'Integrated solutions in contracting, exhibitions, finishing, and project setup' },
];

async function seedIfNeeded() {
  try {
    const { count: projectCount } = await supabase
      .from('projects').select('*', { count: 'exact', head: true });
    if (projectCount === 0) {
      await supabase.from('projects').insert(seedProjects);
    }

    const { count: contentCount } = await supabase
      .from('site_content').select('*', { count: 'exact', head: true });
    if (contentCount === 0) {
      await supabase.from('site_content').insert(seedContent);
    }
  } catch (err) {
    console.error('Seed failed:', err);
  }
}

seedIfNeeded();

// ── File upload ──────────────────────────────────────────────────────
const BUCKET = 'project-images';

// ── Exported API ─────────────────────────────────────────────────────
export const base44 = {
  entities: {
    Project: entityMethods('projects'),
    SiteContent: entityMethods('site_content'),
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const ext = file.name.split('.').pop() || 'bin';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return { file_url: data.publicUrl };
      },
    },
  },
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
  },
};

// ── Data export/import ───────────────────────────────────────────────
export const exportData = async () => {
  const [projects, content] = await Promise.all([
    base44.entities.Project.list(),
    base44.entities.SiteContent.list(),
  ]);
  const blob = new Blob(
    [JSON.stringify({ projects, site_content: content }, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diamond-union-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file) => {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data.projects && !data.site_content) {
    throw new Error('Invalid backup file');
  }
  if (data.projects?.length) {
    await supabase.from('projects').delete().neq('id', 0);
    await supabase.from('projects').insert(data.projects);
  }
  if (data.site_content?.length) {
    await supabase.from('site_content').delete().neq('id', 0);
    await supabase.from('site_content').insert(data.site_content);
  }
  return data;
};
