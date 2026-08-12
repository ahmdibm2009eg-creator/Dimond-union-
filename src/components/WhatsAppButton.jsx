import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function WhatsAppButton() {
  const { lang } = useLanguage();
  return (
    <a
      href="https://wa.me/966549884339"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 end-6 z-40 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 ps-4 pe-5 py-3"
      aria-label="WhatsApp"
    >
      <MessageCircle size={24} className="shrink-0" />
      <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline">
        {lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Us'}
      </span>
    </a>
  );
}