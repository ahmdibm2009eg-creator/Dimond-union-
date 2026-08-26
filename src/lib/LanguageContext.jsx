import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './translations';
import { base44 } from '@/api/base44Client';
import { applyOverrides, applyOverridesEn } from './contentUtils';
import { useRealtimeSync } from './useRealtimeSync';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ar');
  const [overrides, setOverrides] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const loadOverrides = useCallback(async () => {
    try {
      const data = await base44.entities.SiteContent.list();
      setOverrides(data);
    } catch (err) {
      // Entity might not exist yet or error — silently ignore
    }
  }, []);

  useEffect(() => {
    loadOverrides();
  }, [loadOverrides, reloadTrigger]);

  useRealtimeSync(loadOverrides);

  const reloadContent = useCallback(() => {
    setReloadTrigger(n => n + 1);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');

  const tAr = overrides.length > 0 ? applyOverrides(translations.ar, overrides) : translations.ar;
  const tEn = overrides.length > 0 ? applyOverridesEn(translations.en, overrides) : translations.en;
  const t = lang === 'ar' ? tAr : tEn;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, reloadContent }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}