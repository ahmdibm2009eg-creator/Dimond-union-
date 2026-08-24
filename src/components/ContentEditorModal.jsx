import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { getEditableTexts, getValueAtPath } from '@/lib/contentUtils';
import { X, Search, Save, Loader2 } from 'lucide-react';

export default function ContentEditorModal({ onClose, onUpdated }) {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [edits, setEdits] = useState({}); // { [key]: { ar, en } }
  const [saving, setSaving] = useState(false);
  const [existingRecords, setExistingRecords] = useState({}); // { [key]: record }

  const allTexts = getEditableTexts(lang);
  const filtered = search
    ? allTexts.filter(item => item.key.toLowerCase().includes(search.toLowerCase()) || item.value.toLowerCase().includes(search.toLowerCase()))
    : allTexts;

  useEffect(() => {
    base44.entities.SiteContent.list().then(data => {
      const map = {};
      data.forEach(r => { map[r.content_key] = r; });
      setExistingRecords(map);
    }).catch(() => {});
  }, []);

  const getEditValue = (key, field) => {
    if (edits[key] && edits[key][field] !== undefined) return edits[key][field];
    const existing = existingRecords[key];
    if (existing) return existing[field] || '';
    return '';
  };

  const handleChange = (key, field, value) => {
    setEdits(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const hasEdit = (key) => edits[key] && (edits[key].ar !== undefined || edits[key].en !== undefined);

  const handleSave = async (key) => {
    const edit = edits[key];
    if (!edit) return;
    setSaving(true);
    try {
      const payload = {
        content_key: key,
        value_ar: edit.ar !== undefined ? edit.ar : (existingRecords[key]?.value_ar || ''),
        value_en: edit.en !== undefined ? edit.en : (existingRecords[key]?.value_en || ''),
      };
      if (existingRecords[key]) {
        await base44.entities.SiteContent.update(existingRecords[key].id, payload);
      } else {
        const created = await base44.entities.SiteContent.create(payload);
        setExistingRecords(prev => ({ ...prev, [key]: created }));
      }
      setEdits(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      onUpdated();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const editedCount = Object.keys(edits).filter(hasEdit).length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-xl font-bold text-foreground">
            {lang === 'ar' ? 'تعديل نصوص الموقع' : 'Edit Site Content'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        {editedCount > 0 && (
          <div className="mb-3 p-2 bg-primary/10 border border-primary/30 rounded-lg text-sm text-primary text-center">
            {lang === 'ar' ? `${editedCount} تعديل غير محفوظ` : `${editedCount} unsaved edit(s)`}
          </div>
        )}

        <div className="relative mb-4 shrink-0">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث في النصوص...' : 'Search texts...'}
            className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div className="overflow-y-auto flex-1 space-y-2">
          {filtered.map(item => {
            const isEdited = hasEdit(item.key);
            const arVal = getEditValue(item.key, 'ar');
            const enVal = getEditValue(item.key, 'en');
            return (
              <div key={item.key} className={`p-3 rounded-lg border ${isEdited ? 'border-primary bg-primary/5' : 'border-border bg-accent/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <code className="text-xs text-muted-foreground font-mono">{item.key}</code>
                  {isEdited && (
                    <button
                      onClick={() => handleSave(item.key)}
                      disabled={saving}
                      className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      {lang === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">AR</label>
                    <input
                      type="text"
                      value={arVal}
                      onChange={e => handleChange(item.key, 'ar', e.target.value)}
                      dir="rtl"
                      placeholder={getValueAtPath(t, item.key) || item.value}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">EN</label>
                    <input
                      type="text"
                      value={enVal}
                      onChange={e => handleChange(item.key, 'en', e.target.value)}
                      dir="ltr"
                      placeholder={item.key}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {lang === 'ar' ? 'لا توجد نتائج' : 'No results'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}