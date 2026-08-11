'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import portfolioData from '@/data/portfolio.json';

export default function Navbar() {
  const pathname = usePathname();
  const initials = portfolioData.profile.name.split(' ').map(n => n[0]).join('');

  const links = [
    { href: '/', label: 'Home' },
    { href: '/experience', label: 'Experience' },
    { href: '/skills', label: 'Skills' },
    { href: '/project', label: 'Projects' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 lg:px-24 flex justify-between items-center pointer-events-none">
      <Link 
        href="/"
        className="font-mono text-[10px] md:text-xs tracking-widest uppercase pointer-events-auto bg-bg/85 backdrop-blur-md px-3 py-1.5 border border-primary/10 rounded shadow-sm hover:border-primary/20 transition-all text-primary font-medium"
      >
        {initials} / 2026
      </Link>
      
      <div className="flex gap-1 md:gap-2 pointer-events-auto bg-bg/85 backdrop-blur-md p-1 border border-primary/10 rounded-full shadow-sm">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3.5 py-1.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-mono transition-colors ${
                isActive ? 'text-bg font-semibold' : 'text-zinc-500 hover:text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
