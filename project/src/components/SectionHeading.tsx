import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({ eyebrow, title, subtitle, center = true, light = false }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {eyebrow && (
        <span className={`text-sm font-semibold uppercase tracking-wider ${light ? 'text-forest-300' : 'text-forest-600'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-2 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.5rem] ${light ? 'text-white' : 'text-forest-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? 'text-cream-100/70' : 'text-charcoal-600'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
