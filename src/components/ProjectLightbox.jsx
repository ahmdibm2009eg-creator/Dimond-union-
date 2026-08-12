import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ProjectLightbox({ project, onClose }) {
  const { lang } = useLanguage();
  const [current, setCurrent] = useState(0);
  const images = project.images || [project.thumb];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [current]);

  const next = () => setCurrent(i => (i + 1) % images.length);
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-12 end-0 text-white hover:text-primary transition-colors z-10"
        >
          <X size={32} />
        </button>

        {/* Project title */}
        <div className="text-center mb-3">
          <h3 className="text-white text-xl font-bold">{project.name[lang]}</h3>
          <p className="text-white/60 text-sm mt-1">{current + 1} / {images.length}</p>
        </div>

        {/* Main Image */}
        <div className="relative bg-black rounded-2xl overflow-hidden" style={{ height: '60vh' }}>
          <img
            src={images[current]}
            alt={project.name[lang]}
            className="w-full h-full object-contain"
          />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute start-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white rounded-full p-2 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="absolute end-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white rounded-full p-2 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current ? 'border-primary' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}