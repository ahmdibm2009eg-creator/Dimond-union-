import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { X, Upload, Loader2, Plus } from 'lucide-react';

export default function ProjectCreateModal({ onClose, onCreated }) {
  const { lang, t } = useLanguage();
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('stands');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploaded.push(file_url);
      }
      setImages(prev => [...prev, ...uploaded]);
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleRemove = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nameAr.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Project.create({
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        category,
        images,
        order: 0,
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const categories = [
    { key: 'stands', label: t.portfolio.categories.stands },
    { key: 'exhibition', label: t.portfolio.categories.exhibition },
    { key: 'interior', label: t.portfolio.categories.interior },
    { key: 'signage', label: t.portfolio.categories.signage },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <form
        onSubmit={handleCreate}
        className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            {lang === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}
          </h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === 'ar' ? 'اسم المشروع (عربي)' : 'Project Name (Arabic)'} *
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={e => setNameAr(e.target.value)}
              required
              dir="rtl"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
              placeholder={lang === 'ar' ? 'أدخل اسم المشروع بالعربية' : 'Enter project name in Arabic'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === 'ar' ? 'اسم المشروع (إنجليزي)' : 'Project Name (English)'}
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={e => setNameEn(e.target.value)}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
              placeholder={lang === 'ar' ? 'Enter project name in English' : 'أدخل اسم المشروع بالإنجليزية'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === 'ar' ? 'التصنيف' : 'Category'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
            >
              {categories.map(cat => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {lang === 'ar' ? 'صور المشروع' : 'Project Images'}
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary transition-colors">
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">{lang === 'ar' ? 'جاري الرفع...' : 'Uploading...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{lang === 'ar' ? 'اضغط لرفع الصور' : 'Click to upload images'}</span>
                </>
              )}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="absolute top-2 end-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || !nameAr.trim()}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {lang === 'ar' ? 'إضافة المشروع' : 'Add Project'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}