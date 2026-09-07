'use client';

import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export default function Testimonials() {
  const { testimonials } = portfolioData;

  return (
    <section
      id="testimonials"
      className="px-6 py-24 lg:px-24 bg-bg border-b border-primary/10"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start mb-14 gap-6"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text/50 block mb-2">
              Recommendations
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">
              What colleagues <span className="text-accent">say.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-text/60 leading-relaxed font-sans">
            Verbatim from LinkedIn recommendations by teammates, managers, and
            clients across PureLogics, TechOrix, and HelloCustom.
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {testimonials.map((t, idx) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
              className="mb-6 break-inside-avoid rounded-2xl border border-primary/10 p-6 bg-bg"
            >
              <Quote className="w-5 h-5 text-accent mb-4" />
              <blockquote className="text-sm text-text/70 leading-relaxed font-sans">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-primary/10">
                <p className="text-sm font-semibold text-primary">{t.name}</p>
                <p className="text-xs text-text/60 mt-0.5">{t.title}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text/40 mt-2">
                  {t.relation} · {t.date}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
