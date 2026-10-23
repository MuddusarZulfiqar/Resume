'use client';

import dynamic from 'next/dynamic';

// CommandPalette only matters once a visitor presses ⌘K or taps its launcher
// button — it has no SEO value and isn't part of any initial viewport, so
// keep it out of the critical bundle on every single page.
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });

export default function DeferredCommandPalette() {
  return <CommandPalette />;
}
