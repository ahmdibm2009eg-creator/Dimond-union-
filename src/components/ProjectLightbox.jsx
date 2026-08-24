import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function ProjectLightbox({ project, onClose }) {
  const { lang } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [flipKey, setFlipKey] = useState(0);
  const dragStart = useRef(null);
  const touchStart = useRef(null);
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
  }, []);

  const goTo = (i) => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFlipKey(k => k + 1);
    setCurrent(i);
  };
  const next = () => goTo((current + 1) % images.length);
  const prev = () => goTo((current - 1 + images.length) % images.length);

  const zoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const zoomOut = () => { setZoom(z => Math.max(z - 0.25, 1)); if (zoom <= 1.25) setPan({ x: 0, y: 0 }); };
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const onPointerDown = (e) => {
    if (zoom <= 1) return;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const onPointerMove = (e) => {
    if (!dragStart.current || zoom <= 1) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onPointerUp = () => { dragStart.current = null; };

  // Touch swipe to flip between images (only when not zoomed)
  const onTouchStart = (e) => {
    if (zoom > 1) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!touchStart.current || zoom > 1) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) prev(); else next();
    }
    touchStart.current = null;
  };

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

        {/* Main Image with flip + zoom */}
        <div
          className="relative bg-black rounded-2xl overflow-hidden select-none"
          style={{ height: '60vh', perspective: '1200px' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={flipKey}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src={images[current]}
                alt={project.name[lang]}
                className="w-full h-full object-contain"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center',
                  transition: dragStart.current ? 'none' : 'transform 0.2s ease-out',
                  cursor: zoom > 1 ? (dragStart.current ? 'grabbing' : 'grab') : 'default'
                }}
                draggable={false}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              />
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute start-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white rounded-full p-2 transition-colors z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="absolute end-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white rounded-full p-2 transition-colors z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1.5 z-10">
            <button
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="text-white hover:text-primary disabled:opacity-40 disabled:hover:text-white p-1.5 transition-colors"
              title={lang === 'ar' ? 'تصغير' : 'Zoom out'}
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-white text-xs w-12 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="text-white hover:text-primary disabled:opacity-40 disabled:hover:text-white p-1.5 transition-colors"
              title={lang === 'ar' ? 'تكبير' : 'Zoom in'}
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={resetZoom}
              className="text-white hover:text-primary p-1.5 transition-colors"
              title={lang === 'ar' ? 'إعادة' : 'Reset'}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
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