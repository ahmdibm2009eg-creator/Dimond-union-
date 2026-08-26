import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase before importing base44Client
const mockData = { projects: [], site_content: [] };

function buildQuery(table) {
  const q = {
    _table: table,
    _filters: {},
    _orderCol: null,
    _limit: null,
    select() { return this; },
    order(col) { this._orderCol = col; return this; },
    eq(k, v) { this._filters[k] = v; return this; },
    neq(k, v) { this._filters[`__neq_${k}`] = v; return this; },
    single() { this._single = true; return this; },
    then(resolve) {
      let rows = [...(mockData[table] || [])];
      for (const [k, v] of Object.entries(this._filters)) {
        if (k.startsWith('__neq_')) {
          const col = k.slice(6);
          rows = rows.filter(r => r[col] !== v);
        } else {
          rows = rows.filter(r => r[k] === v);
        }
      }
      if (this._orderCol) rows.sort((a, b) => (a[this._orderCol] || 0) - (b[this._orderCol] || 0));
      const result = this._single ? rows[0] : rows;
      if (this._single && !result) resolve({ data: null, error: new Error('Not found') });
      else resolve({ data: result, error: null, count: rows.length });
    },
  };
  return q;
}

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from(table) {
      mockData[table] = mockData[table] || [];
      return {
        select() { return buildQuery(table); },
        insert(rows) {
          const items = Array.isArray(rows) ? rows : [rows];
          const inserted = items.map((r, i) => ({
            id: mockData[table].length + i + 1,
            ...r,
          }));
          mockData[table].push(...inserted);
          return {
            select() { return this; },
            single() {
              return { then(resolve) { resolve({ data: inserted[0], error: null }); } };
            },
            then(resolve) { resolve({ data: inserted, error: null }); },
          };
        },
        update(data) {
          return {
            eq(_col, id) {
              const idx = mockData[table].findIndex(r => r.id === id);
              if (idx === -1) return { select() { return this; }, single() { return { then(resolve) { resolve({ data: null, error: new Error('Not found') }); } }; } };
              mockData[table][idx] = { ...mockData[table][idx], ...data };
              return {
                select() { return this; },
                single() { return { then(resolve) { resolve({ data: mockData[table][idx], error: null }); } }; },
              };
            },
          };
        },
        delete() {
          return {
            eq(_col, id) {
              mockData[table] = mockData[table].filter(r => r.id !== id);
              return { then(resolve) { resolve({ data: null, error: null }); } };
            },
            neq(_col, _v) {
              mockData[table] = [];
              return { then(resolve) { resolve({ data: null, error: null }); } };
            },
          };
        },
      };
    },
    channel() { return { on() { return this; }, subscribe() { return this; } }; },
    storage: {
      getBucket() { return { then(resolve) { resolve({ error: new Error('not found') }); } }; },
      createBucket() { return { then(resolve) { resolve({ error: null }); } }; },
      from() {
        return {
          upload() { return { then(resolve) { resolve({ error: null }); } }; },
          getPublicUrl(path) { return { data: { publicUrl: `https://test.supabase.co/storage/v1/object/public/project-images/${path}` } }; },
        };
      },
    },
  },
}));

// Seed test data
const seedProjects = [
  { name_ar: 'جناح معرضريادة', name_en: 'Riyada Exhibition Stand', category: 'exhibition', images: [], order: 1 },
  { name_ar: 'تصميم داخلي لمكتب', name_en: 'Office Interior Design', category: 'interior', images: [], order: 2 },
  { name_ar: 'لافتة خارجية', name_en: 'Outdoor Signage', category: 'signage', images: [], order: 3 },
];
const seedContent = [
  { content_key: 'hero_title_ar', value_ar: 'اتحاد الألماس', value_en: 'Diamond Union' },
  { content_key: 'hero_title_en', value_ar: 'Diamond Union', value_en: 'Diamond Union' },
];

beforeEach(() => {
  mockData.projects = seedProjects.map((p, i) => ({ id: i + 1, ...p }));
  mockData.site_content = seedContent.map((c, i) => ({ id: i + 1, ...c }));
});

// Import after mock is set up
const { base44 } = await import('@/api/base44Client');

describe('base44 entities', () => {
  it('lists seeded projects', async () => {
    const projects = await base44.entities.Project.list('order');
    expect(projects.length).toBe(3);
    expect(projects[0].name_en).toBe('Riyada Exhibition Stand');
  });

  it('creates a new project', async () => {
    const created = await base44.entities.Project.create({
      name_ar: 'مشروع جديد',
      name_en: 'New Project',
      category: 'interior',
      images: [],
      order: 4,
    });
    expect(created.id).toBe(4);
    expect(created.name_en).toBe('New Project');

    const all = await base44.entities.Project.list('order');
    expect(all.length).toBe(4);
  });

  it('updates a project', async () => {
    const updated = await base44.entities.Project.update(1, { name_en: 'Updated Name' });
    expect(updated.name_en).toBe('Updated Name');
  });

  it('deletes a project', async () => {
    await base44.entities.Project.delete(2);
    const projects = await base44.entities.Project.list('order');
    expect(projects.length).toBe(2);
  });

  it('filters entities by query', async () => {
    const results = await base44.entities.Project.filter({ category: 'signage' });
    expect(results.length).toBe(1);
    expect(results[0].name_en).toBe('Outdoor Signage');
  });

  it('lists seeded site_content', async () => {
    const content = await base44.entities.SiteContent.list();
    expect(content.length).toBe(2);
    expect(content[0].content_key).toBe('hero_title_ar');
  });
});

describe('UploadFile', () => {
  it('uploads file and returns public URL', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    const result = await base44.integrations.Core.UploadFile({ file });
    expect(result.file_url).toContain('project-images/');
  });
});
