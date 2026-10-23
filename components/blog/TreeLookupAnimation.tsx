'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, CheckCircle2 } from 'lucide-react';

export type TreeStep = {
  label: string;
  detail: string;
};

/**
 * Visualizes a divide-and-conquer descent: each step narrows the search and
 * indents further, ending in a highlighted leaf. Deliberately generic —
 * reusable for any "halve the space each step" scenario (B-tree indexes,
 * binary search, balanced trees, decision trees).
 */
export default function TreeLookupAnimation({
  steps,
  autoPlayMs = 1200,
}: {
  steps: TreeStep[];
  autoPlayMs?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = steps.length;

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % n);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, n, autoPlayMs]);

  const goTo = (i: number) => {
    setCurrent(((i % n) + n) % n);
    setIsPlaying(false);
  };

  const step = steps[current];

  return (
    <div className="not-prose rounded-2xl md:rounded-3xl border border-primary/10 bg-zinc-50/60 p-5 md:p-8">
      <div className="relative">
        {steps.map((s, i) => {
          const isPast = i < current;
          const isNow = i === current;
          const isLeaf = i === n - 1;
          const indent = Math.min(i, 6) * 7; // percent, capped so deep trees don't run off-screen
          return (
            <div key={i} className="relative flex items-stretch" style={{ paddingLeft: `${indent}%` }}>
              {i > 0 && (
                <div
                  className="absolute top-0 w-px h-1/2"
                  style={{
                    left: `calc(${indent}% - 14px)`,
                    background: isPast || isNow ? 'var(--primary)' : '#e4e4e7',
                    opacity: isPast || isNow ? 0.3 : 1,
                  }}
                />
              )}
              <motion.button
                onClick={() => goTo(i)}
                className="relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 md:px-4 md:py-3 my-1.5 cursor-pointer text-left shrink-0 max-w-full"
                animate={{
                  backgroundColor: isNow ? (isLeaf ? 'var(--highlight)' : 'var(--primary)') : isPast ? '#e4e4e7' : '#ffffff',
                  opacity: !isPast && !isNow ? 0.5 : 1,
                  scale: isNow ? 1.03 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{ border: isPast || isNow ? 'none' : '1px solid #e4e4e7' }}
              >
                {isNow && (
                  <motion.span
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 0 2px var(--background)' }}
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: [0.9, 0.15, 0.9] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <span
                  className="text-[8px] md:text-[9px] font-mono uppercase tracking-wider shrink-0 relative z-10"
                  style={{ color: isNow ? 'var(--background)' : isPast ? '#71717a' : '#a1a1aa' }}
                >
                  {isLeaf ? <CheckCircle2 className="w-3.5 h-3.5" /> : `L${i + 1}`}
                </span>
                <span
                  className="text-xs md:text-sm font-mono font-medium truncate relative z-10"
                  style={{ color: isNow ? 'var(--background)' : isPast ? '#3f3f46' : '#a1a1aa' }}
                >
                  {s.label}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-5 md:pt-6 border-t border-primary/10">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-highlight">
            Comparison {current + 1} of {n}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(current - 1)}
              aria-label="Previous step"
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => goTo(current + 1)}
              aria-label="Next step"
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <motion.p
          key={current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm md:text-base text-text/70 leading-relaxed"
        >
          {step.detail}
        </motion.p>
      </div>
    </div>
  );
}
