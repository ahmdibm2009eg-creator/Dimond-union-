import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Presentation, Palette, Building2, Briefcase, HardHat, Package } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function Services() {
  const { t } = useLanguage();
  const icons = [Presentation, Palette, Building2, Briefcase, HardHat, Package];

  return (
    <section id="services" className="py-20 lg:py-28 bg-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary"></div>
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">
              {t.services.title}
            </span>
            <div className="w-8 h-0.5 bg-primary"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.services.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.services.subtitle}</p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.services.items.map((service, i) => {
            const Icon = icons[i] || Presentation;
            return (
              <ScrollReveal key={i} delay={(i % 3) * 0.1}>
                <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-500 ease-out h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}