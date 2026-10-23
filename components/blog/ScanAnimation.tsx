'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Visualizes a linear scan: a cursor sweeps one cell at a time through a grid
 * until it hits the match, showing exactly why "no index" means "no shortcut."
 * Deliberately generic — reusable for any "check everything until you find it"
 * scenario (table scans, linear search, brute-force attempts, naive polling).
 */
export default function ScanAnimation({
  total,
  matchIndex,
  itemLabel = 'row',
  stepMs = 110,
  foundDwellMs = 2400,
}: {
  total: number;
  matchIndex: number;
  itemLabel?: string;
  stepMs?: number;
  foundDwellMs?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const delay = current === matchIndex ? foundDwellMs : stepMs;
    timerRef.current = setTimeout(() => {
      setCurrent((c) => (c >= matchIndex ? 0 : c + 1));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isPlaying, matchIndex, stepMs, foundDwellMs]);

  const goTo = (i: number) => {
    setCurrent(Math.max(0, Math.min(matchIndex, i)));
    setIsPlaying(false);
  };

  const found = current === matchIndex;

  return (
    <div className="not-prose rounded-2xl md:rounded-3xl border border-primary/10 bg-zinc-50/60 p-5 md:p-8">
      <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center mb-6 md:mb-8">
        {Array.from({ length: total }).map((_, i) => {
          const isPast = i < current;
          const isNow = i === current;
          const isMatch = i === matchIndex;
          return (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`${itemLabel} ${i + 1}`}
              className="relative w-6 h-6 md:w-7 md:h-7 rounded-md flex items-center justify-center shrink-0 cursor-pointer"
              animate={{
                backgroundColor:
                  isNow && isMatch
                    ? 'var(--highlight)'
                    : isNow
                      ? 'var(--primary)'
                      : isPast
                        ? '#e4e4e7'
                        : '#f4f4f5',
                scale: isNow ? 1.18 : 1,
                opacity: !isPast && !isNow ? 0.45 : 1,
              }}
              transition={{ duration: 0.15 }}
            >
              {isNow && isMatch && (
                <motion.span
                  className="absolute inset-0 rounded-md pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 0 2px var(--background)' }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: [0.9, 0.15, 0.9] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <span
                className="text-[7px] md:text-[8px] font-mono relative z-10"
                style={{
                  color: isNow ? 'var(--background)' : isPast ? '#71717a' : '#a1a1aa',
                }}
              >
                {i + 1}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="pt-5 md:pt-6 border-t border-primary/10">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: found ? 'var(--highlight)' : 'var(--primary)' }}
          >
            {found
              ? `Found — ${matchIndex + 1} of ${total} checked`
              : `Checking ${itemLabel} ${current + 1} of ${total}…`}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(current - 1)}
              aria-label="Step back"
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
              aria-label="Step forward"
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo(0)}
              aria-label="Restart"
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <motion.p
          key={found ? 'found' : current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm md:text-base text-text/70 leading-relaxed"
        >
          {found
            ? `${itemLabel[0].toUpperCase()}${itemLabel.slice(1)} ${matchIndex + 1} matched — but only after inspecting every ${itemLabel} before it, one at a time, with no way to skip ahead.`
            : `No index means no shortcut: compare ${itemLabel} ${current + 1} against the target, find no match, move to the next.`}
        </motion.p>
      </div>
    </div>
  );
}
