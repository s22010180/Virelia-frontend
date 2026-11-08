import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Hover / keyboard-focus explanation bubble. */
export function InfoTip({ children, className, align = 'center' }: { children: ReactNode; className?: string; align?: 'left' | 'center' | 'right' }) {
  return (
    <span className={cn('group relative inline-flex', className)}>
      <button
        type="button"
        className="rounded-full text-slate-400 transition hover:text-brand-600 focus-visible:text-brand-600"
        aria-label="More information"
      >
        <Info className="size-3.5" />
      </button>
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none invisible absolute bottom-full z-30 mb-2 w-64 translate-y-1 rounded-xl bg-slate-900 p-3 text-left text-xs font-normal leading-5 text-slate-100 opacity-0 shadow-pop transition-all duration-150',
          'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'left' && 'left-0',
          align === 'right' && 'right-0',
        )}
      >
        {children}
      </span>
    </span>
  );
}
