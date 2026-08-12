import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a3c75a3bbe27499fdf641b2/98d6b1c22_image.png';

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
  { id: 'home', label: t.nav.home },
  { id: 'about', label: t.nav.about },
  { id: 'services', label: t.nav.services },
  { id: 'portfolio', label: t.nav.portfolio },
  { id: 'contact', label: t.nav.contact }];


  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center">
            <img src="https://media.base44.com/images/public/6a75b32be1751696858b1e3d/1d102d7e0_photo_6035282697564917489_y.jpg" alt="Diamond Union" className="object-contain opacity-100 h-1w-auto" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group">
              
                {link.label}
                <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></span>
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLang}
              className="gap-2 font-medium">
              
              <Globe className="w-4 h-4" />
              {lang === 'ar' ? 'EN' : 'ع'}
            </Button>
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}>
              
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen &&
        <nav className="lg:hidden py-4 border-t border-border">
            {navLinks.map((link) =>
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="block w-full text-start py-3 px-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors rounded-md">
            
                {link.label}
              </button>
          )}
          </nav>
        }
      </div>
    </header>);

}