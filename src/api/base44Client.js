const DB_KEY = 'diamond_union_db';

const getDB = () => {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || {};
  } catch {
    return {};
  }
};

const setDB = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

const getCollection = (name) => getDB()[name] || [];

const setCollection = (name, items) => {
  const db = getDB();
  db[name] = items;
  setDB(db);
};

const nextId = (collection) => {
  const items = getCollection(collection);
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
};

const entityMethods = (name) => ({
  list: async (sortKey) => {
    let items = getCollection(name);
    if (sortKey) items.sort((a, b) => (a[sortKey] || 0) - (b[sortKey] || 0));
    return items;
  },
  filter: async (query) => {
    return getCollection(name).filter(item =>
      Object.entries(query).every(([k, v]) => item[k] === v)
    );
  },
  create: async (data) => {
    const items = getCollection(name);
    const newItem = { id: nextId(name), ...data };
    items.push(newItem);
    setCollection(name, items);
    return newItem;
  },
  update: async (id, data) => {
    const items = getCollection(name);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Item ${id} not found in ${name}`);
    items[idx] = { ...items[idx], ...data };
    setCollection(name, items);
    return items[idx];
  },
  delete: async (id) => {
    const items = getCollection(name);
    setCollection(name, items.filter(i => i.id !== id));
  },
});

const seedProjects = [
  { id: 1, name_ar: 'جناح معرض رياضة', name_en: 'Riyada Exhibition Stand', category: 'exhibition', images: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
  ], order: 1 },
  { id: 2, name_ar: 'تصميم داخلي لمكتب', name_en: 'Office Interior Design', category: 'interior', images: [
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop'
  ], order: 2 },
  { id: 3, name_ar: 'لافتة خارجية', name_en: 'Outdoor Signage', category: 'signage', images: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464938050520-ef2571e0d6e0?w=800&h=600&fit=crop'
  ], order: 3 },
];

const seedContent = [
  { id: 1, content_key: 'hero_title_ar', content_value: 'اتحاد الألماس' },
  { id: 2, content_key: 'hero_title_en', content_value: 'Diamond Union' },
  { id: 3, content_key: 'hero_subtitle_ar', content_value: 'حلول متكاملة في المقاولات، المعارض، التشطيبات، وتجهيز المشاريع' },
  { id: 4, content_key: 'hero_subtitle_en', content_value: 'Integrated solutions in contracting, exhibitions, finishing, and project setup' },
];

const initDB = () => {
  const db = getDB();
  if (!db.projects) db.projects = seedProjects;
  if (!db.site_content) db.site_content = seedContent;
  if (!db.theme) db.theme = [];
  setDB(db);
};

initDB();

export const base44 = {
  entities: {
    Project: entityMethods('projects'),
    SiteContent: entityMethods('site_content'),
    Theme: entityMethods('theme'),
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file_url: reader.result });
          reader.onerror = () => reject(new Error('File read failed'));
          reader.readAsDataURL(file);
        });
      },
    },
  },
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
  },
};

// Data export/import helpers
export const exportData = () => {
  const db = getDB();
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diamond-union-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.projects && !data.site_content && !data.theme) {
        throw new Error('Invalid backup file');
      }
      setDB(data);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  };
  reader.onerror = () => reject(new Error('Failed to read file'));
  reader.readAsText(file);
});
