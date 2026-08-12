import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import Diamond3D from '@/components/Diamond3D';

export default function Hero() {
  const { t, lang } = useLanguage();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const { scrollY } = useScroll();

  const logoScale = useTransform(scrollY, [0, 500], [1, 0.2]);
  const logoOpacity = useTransform(scrollY, [0, 400, 500], [1, 1, 0]);
  const logoY = useTransform(scrollY, [0, 500], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -30]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Logo with dividing lines */}
      <div className="flex items-center w-full max-w-3xl">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="flex-1 h-px bg-border" />
        
        <motion.div
          style={{ scale: logoScale, opacity: logoOpacity, y: logoY }}
          className="mx-6 sm:mx-10 relative">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-44 h-44 sm:w-64 sm:h-64 lg:w-80 lg:h-80">

            <Diamond3D />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="flex-1 h-px bg-border" />
        
      </div>

      {/* Brand name */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="text-center mt-8">
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
          className="sm:text-4xl font-bold text-foreground tracking-tight text-4xl lg:text-4xl">
          
          Diamond Union
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="w-16 h-px bg-primary mx-auto my-3" />
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl font-bold text-foreground"
          dir="rtl">
          
          اتحاد الألماس
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
          className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mt-4">
          
          {t.hero.subtitle}
        </motion.p>
      </motion.div>

      {/* CTA */}
      <motion.div
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="flex flex-col sm:flex-row gap-4 mt-10">
        
        <Button size="lg" onClick={() => scrollTo('contact')} className="bg-primary hover:bg-primary/90 text-white gap-2 text-base px-8">
          {t.hero.cta}
          <ArrowIcon className="w-5 h-5" />
        </Button>
        <Button size="lg" variant="outline" onClick={() => scrollTo('portfolio')} className="text-base px-8">
          {t.hero.cta2}
        </Button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-8">
        
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>);

}