import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme, DEFAULT_THEME, applyTheme } from '@/lib/ThemeContext';
import { X, Save, RotateCcw, Loader2 } from 'lucide-react';

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslToHex(hsl) {
  const parts = hsl.split(' ');
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) { [r, g, b] = [c, x, 0]; }
  else if (h < 120) { [r, g, b] = [x, c, 0]; }
  else if (h < 180) { [r, g, b] = [0, c, x]; }
  else if (h < 240) { [r, g, b] = [0, x, c]; }
  else if (h < 300) { [r, g, b] = [x, 0, c]; }
  else { [r, g, b] = [c, 0, x]; }
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function StyleEditorModal({ onClose }) {
  const { lang } = useLanguage();
  const { theme, saveTheme, resetTheme } = useTheme();
  const [draft, setDraft] = useState(theme);
  const [saving, setSaving] = useState(false);

  const update = (key, value) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    applyTheme(next);
  };

  const updateColor = (key, hex) => update(key, hexToHsl(hex));
  const updateSize = (key, val) => update(key, val);

  const handleSave = async () => {
    setSaving(true);
    await saveTheme(draft);
    setSaving(false);
  };

  const handleReset = () => {
    setDraft(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  };

  const handleClose = () => {
    applyTheme(theme);
    onClose();
  };

  const colorFields = [
    { key: 'primary', label: lang === 'ar' ? 'اللون الأحمر (الأساسي)' : 'Red (Primary)' },
    { key: 'foreground', label: lang === 'ar' ? 'الأسود (النصوص)' : 'Black (Text)' },
    { key: 'background', label: lang === 'ar' ? 'خلفية الموقع' : 'Background' },
    { key: 'card', label: lang === 'ar' ? 'خلفية البطاقات' : 'Card Background' },
    { key: 'accent', label: lang === 'ar' ? 'الأسطح الثانوية' : 'Accent Surfaces' },
    { key: 'border', label: lang === 'ar' ? 'الحدود' : 'Borders' }
  ];

  const sizeFields = [
    { key: 'rootFontSize', label: lang === 'ar' ? 'حجم الخط' : 'Font Size', min: 13, max: 22, step: 1, suffix: 'px' },
    { key: 'radius', label: lang === 'ar' ? 'استدارة الزوايا' : 'Corner Radius', min: 0, max: 1.5, step: 0.1, suffix: 'rem' }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={handleClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col border border-border shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h3 className="text-xl font-bold text-foreground">
            {lang === 'ar' ? 'تعديل التصميم' : 'Edit Design'}
          </h3>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-6 pe-1">
          {/* Colors */}
          <div>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">
              {lang === 'ar' ? 'الألوان' : 'Colors'}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {colorFields.map(f => (
                <div key={f.key} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-accent/30">
                  <span className="text-sm font-medium text-foreground">{f.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono uppercase">{hslToHex(draft[f.key])}</span>
                    <input
                      type="color"
                      value={hslToHex(draft[f.key])}
                      onChange={e => updateColor(f.key, e.target.value)}
                      className="w-9 h-9 rounded-md border border-border cursor-pointer bg-transparent p-0.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">
              {lang === 'ar' ? 'الأحجام' : 'Sizes'}
            </h4>
            <div className="space-y-3">
              {sizeFields.map(f => (
                <div key={f.key} className="p-3 rounded-lg border border-border bg-accent/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                    <span className="text-sm font-mono text-primary">{draft[f.key]}{f.suffix}</span>
                  </div>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={draft[f.key]}
                    onChange={e => updateSize(f.key, e.target.value)}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} />
            {lang === 'ar' ? 'استعادة الافتراضي' : 'Reset'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {lang === 'ar' ? 'حفظ التصميم' : 'Save Design'}
          </button>
        </div>
      </div>
    </div>
  );
}