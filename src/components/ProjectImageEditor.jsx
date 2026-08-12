import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/LanguageContext';
import { X, Upload, Trash2, Loader2 } from 'lucide-react';

export default function ProjectImageEditor({ project, onClose, onUpdate }) {
  const { lang } = useLanguage();
  const [images, setImages] = useState(project.images || []);
  const [uploading, setUploading] = useState(false);

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
      const newImages = [...images, ...uploaded];
      setImages(newImages);
      await base44.entities.Project.update(project.id, { images: newImages });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleRemove = async (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    await base44.entities.Project.update(project.id, { images: newImages });
    onUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">
            {lang === 'ar' ? 'تعديل الصور' : 'Edit Images'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {project.name_ar} {project.name_en ? `/ ${project.name_en}` : ''}
        </p>

        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 mb-6 cursor-pointer hover:border-primary transition-colors">
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-muted-foreground">{lang === 'ar' ? 'جاري الرفع...' : 'Uploading...'}</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">{lang === 'ar' ? 'اضغط لرفع صور جديدة' : 'Click to upload new images'}</span>
            </>
          )}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>

        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
              <button
                onClick={() => handleRemove(i)}
                className="absolute top-2 end-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-center text-muted-foreground py-8">{lang === 'ar' ? 'لا توجد صور' : 'No images'}</p>
        )}
      </div>
    </div>
  );
}