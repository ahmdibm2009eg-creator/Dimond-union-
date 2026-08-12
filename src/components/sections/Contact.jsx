import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Send, MessageCircle } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const WHATSAPP_NUMBER = '966549884339';

export default function Contact() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lines = [
      lang === 'ar' ? 'رسالة جديدة من الموقع:' : 'New message from website:',
      `${t.contact.form.name}: ${form.name}`,
      `${t.contact.form.phone}: ${form.phone || '-'}`,
      `${t.contact.form.message}: ${form.message}`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const contactInfo = [
    { icon: MapPin, label: t.contact.info.addressLabel, value: t.contact.info.address },
    { icon: MessageCircle, label: lang === 'ar' ? 'واتساب' : 'WhatsApp', value: t.contact.info.phone, href: `https://wa.me/${WHATSAPP_NUMBER}` },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary"></div>
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">
              {t.contact.title}
            </span>
            <div className="w-8 h-0.5 bg-primary"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.contact.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.contact.subtitle}</p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12">
          <ScrollReveal>
            <div className="space-y-6">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                const content = (
                  <div className="flex items-start gap-5 p-6 bg-accent/50 rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.label}</h3>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </div>
                );
                return info.href ? (
                  <a key={i} href={info.href} target="_blank" rel="noopener noreferrer" className="block">
                    {content}
                  </a>
                ) : (
                  <div key={i}>{content}</div>
                );
              })}

              {/* Big WhatsApp CTA */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-6 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-7 h-7" />
                <span className="text-lg font-bold">
                  {lang === 'ar' ? 'تواصل معنا مباشرة عبر واتساب' : 'Chat with us on WhatsApp'}
                </span>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.contact.form.name}</Label>
                  <Input id="name" type="text" placeholder={t.contact.form.namePlaceholder} required value={form.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.contact.form.phone}</Label>
                  <Input id="phone" type="tel" placeholder={t.contact.form.phonePlaceholder} required value={form.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t.contact.form.message}</Label>
                  <Textarea id="message" rows={5} placeholder={t.contact.form.messagePlaceholder} required value={form.message} onChange={handleChange} />
                </div>
                <Button type="submit" size="lg" className="w-full bg-[#25D366] hover:bg-[#1da851] text-white gap-2">
                  {t.contact.form.submit}
                  <Send className="w-4 h-4" />
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {lang === 'ar'
                    ? 'سيتم تحويلك إلى واتساب لإرسال رسالتك مباشرة'
                    : 'You will be redirected to WhatsApp to send your message'}
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}