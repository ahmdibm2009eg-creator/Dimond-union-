import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { MapPin, Phone, Mail } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a3c75a3bbe27499fdf641b2/98d6b1c22_image.png';

export default function Footer() {
  const { t } = useLanguage();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
  { id: 'about', label: t.nav.about },
  { id: 'services', label: t.nav.services },
  { id: 'portfolio', label: t.nav.portfolio },
  { id: 'contact', label: t.nav.contact }];


  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            
            <p className="text-white/70 leading-relaxed text-sm">{t.footer.about}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              {links.map((link) =>
              <li key={link.id}>
                  <button
                  onClick={() => scrollTo(link.id)}
                  className="text-white/70 hover:text-primary transition-colors text-sm">
                  
                    {link.label}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">{t.footer.contact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{t.contact.info.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr">{t.contact.info.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr">{t.contact.info.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} {t.footer.company}. {t.footer.rights}.
          </p>
        </div>
      </div>
    </footer>);

}