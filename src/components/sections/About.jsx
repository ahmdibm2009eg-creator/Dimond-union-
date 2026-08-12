import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Target, Eye, Gem, ShieldCheck } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function About() {
  const { t } = useLanguage();
  const values = t.about.values;

  return (
    <section id="about" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary"></div>
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">
              {t.about.title}
            </span>
            <div className="w-8 h-0.5 bg-primary"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.about.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="max-w-4xl mx-auto space-y-6 mb-20">
          <p className="text-lg text-muted-foreground leading-relaxed text-center">{t.about.p1}</p>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">{t.about.p2}</p>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">{t.about.p3}</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <ScrollReveal>
            <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{t.about.visionTitle}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{t.about.vision}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{t.about.missionTitle}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{t.about.mission}</p>
            </div>
          </ScrollReveal>
        </div>

        <div>
          <ScrollReveal className="flex items-center justify-center gap-3 mb-10">
            <Gem className="w-6 h-6 text-primary" />
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{t.about.valuesTitle}</h3>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {values.map((value, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="text-center p-6 bg-accent/50 rounded-xl border border-border hover:border-primary/40 hover:bg-accent hover:-translate-y-1 transition-all duration-500 ease-out h-full">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground leading-snug">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}