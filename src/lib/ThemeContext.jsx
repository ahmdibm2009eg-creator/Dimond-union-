import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useRealtimeSync } from './useRealtimeSync';

export const DEFAULT_THEME = {
  primary: '356 72% 32%',
  foreground: '0 0% 10%',
  background: '0 0% 100%',
  card: '0 0% 100%',
  accent: '0 0% 96%',
  border: '0 0% 90%',
  rootFontSize: '16',
  radius: '0.5'
};

const ThemeContext = createContext();

export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-foreground', '40 47% 97%');
  root.style.setProperty('--foreground', theme.foreground);
  root.style.setProperty('--card-foreground', theme.foreground);
  root.style.setProperty('--popover-foreground', theme.foreground);
  root.style.setProperty('--secondary-foreground', theme.foreground);
  root.style.setProperty('--sidebar-foreground', theme.foreground);
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--card', theme.card);
  root.style.setProperty('--popover', theme.card);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--muted', theme.accent);
  root.style.setProperty('--secondary', theme.accent);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--input', theme.border);
  root.style.setProperty('--ring', theme.primary);
  root.style.setProperty('--accent-foreground', theme.primary);
  root.style.setProperty('--sidebar-primary', theme.primary);
  root.style.setProperty('--sidebar-accent-foreground', theme.primary);
  root.style.setProperty('--sidebar-ring', theme.primary);
  root.style.setProperty('--radius', `${theme.radius}rem`);
  root.style.setProperty('--root-font-size', `${theme.rootFontSize}px`);
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const loadTheme = useCallback(async () => {
    try {
      const data = await base44.entities.SiteContent.filter({ content_key: 'theme_settings' });
      if (data.length > 0 && data[0].value_ar) {
        const parsed = JSON.parse(data[0].value_ar);
        const merged = { ...DEFAULT_THEME, ...parsed };
        setTheme(merged);
        applyTheme(merged);
      } else {
        applyTheme(DEFAULT_THEME);
      }
    } catch {
      applyTheme(DEFAULT_THEME);
    }
  }, []);

  useEffect(() => { loadTheme(); }, [loadTheme]);

  useRealtimeSync(loadTheme);

  const saveTheme = useCallback(async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      const data = await base44.entities.SiteContent.filter({ content_key: 'theme_settings' });
      const payload = {
        content_key: 'theme_settings',
        value_ar: JSON.stringify(newTheme),
        value_en: JSON.stringify(newTheme)
      };
      if (data.length > 0) {
        await base44.entities.SiteContent.update(data[0].id, payload);
      } else {
        await base44.entities.SiteContent.create(payload);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, saveTheme, resetTheme, DEFAULT_THEME }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}