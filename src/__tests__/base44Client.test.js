import { describe, it, expect, beforeEach } from 'vitest';
import { base44, exportData, importData } from '@/api/base44Client';

// Re-seed localStorage before each test
const DB_KEY = 'diamond_union_db';
const seedProjects = [
  { id: 1, name_ar: 'جناح معرضريادة', name_en: 'Riyada Exhibition Stand', category: 'exhibition', images: [], order: 1 },
  { id: 2, name_ar: 'تصميم داخلي لمكتب', name_en: 'Office Interior Design', category: 'interior', images: [], order: 2 },
  { id: 3, name_ar: 'لافتة خارجية', name_en: 'Outdoor Signage', category: 'signage', images: [], order: 3 },
];
const seedContent = [
  { id: 1, content_key: 'hero_title_ar', content_value: 'اتحاد الألماس' },
  { id: 2, content_key: 'hero_title_en', content_value: 'Diamond Union' },
  { id: 3, content_key: 'hero_subtitle_ar', content_value: 'حلول متكاملة في المقاولات، المعارض، التشطيبات، وتجهيز المشاريع' },
  { id: 4, content_key: 'hero_subtitle_en', content_value: 'Integrated solutions in contracting, exhibitions, finishing, and project setup' },
];

beforeEach(() => {
  localStorage.setItem(DB_KEY, JSON.stringify({
    projects: [...seedProjects],
    site_content: [...seedContent],
    theme: [],
  }));
});

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

    const projects = await base44.entities.Project.list('order');
    expect(projects.find(p => p.id === 1).name_en).toBe('Updated Name');
  });

  it('deletes a project', async () => {
    await base44.entities.Project.delete(2);
    const projects = await base44.entities.Project.list('order');
    expect(projects.length).toBe(2);
    expect(projects.find(p => p.id === 2)).toBeUndefined();
  });

  it('throws on updating non-existent item', async () => {
    await expect(base44.entities.Project.update(999, { name_en: 'X' }))
      .rejects.toThrow('Item 999 not found in projects');
  });

  it('filters entities by query', async () => {
    const results = await base44.entities.Project.filter({ category: 'signage' });
    expect(results.length).toBe(1);
    expect(results[0].name_en).toBe('Outdoor Signage');
  });

  it('lists seeded site_content', async () => {
    const content = await base44.entities.SiteContent.list();
    expect(content.length).toBe(4);
    expect(content[0].content_key).toBe('hero_title_ar');
  });

  it('creates and lists theme', async () => {
    await base44.entities.Theme.create({ primary: '0 0% 0%' });
    const themes = await base44.entities.Theme.list();
    expect(themes.length).toBe(1);
    expect(themes[0].primary).toBe('0 0% 0%');
  });
});

describe('exportData / importData', () => {
  it('exports and reimports data correctly', async () => {
    await base44.entities.Project.create({
      name_ar: 'تصدير',
      name_en: 'Export Test',
      category: 'stands',
      images: [],
      order: 10,
    });

    // Mock download
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = (tag) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') el.click = () => {};
      return el;
    };
    exportData();
    document.createElement = originalCreateElement;

    const db = JSON.parse(localStorage.getItem(DB_KEY));
    expect(db.projects.length).toBe(4);

    // Clear and reimport
    localStorage.clear();
    const blob = new Blob([JSON.stringify(db)], { type: 'application/json' });
    const file = new File([blob], 'backup.json', { type: 'application/json' });
    await importData(file);

    const reimported = await base44.entities.Project.list('order');
    expect(reimported.length).toBe(4);
    expect(reimported.find(p => p.name_en === 'Export Test')).toBeTruthy();
  });

  it('rejects invalid backup files', async () => {
    const blob = new Blob([JSON.stringify({ invalid: true })], { type: 'application/json' });
    const file = new File([blob], 'bad.json', { type: 'application/json' });
    await expect(importData(file)).rejects.toThrow('Invalid backup file');
  });
});

describe('UploadFile', () => {
  it('converts file to data URL', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    const result = await base44.integrations.Core.UploadFile({ file });
    expect(result.file_url).toContain('data:text/plain');
  });
});
