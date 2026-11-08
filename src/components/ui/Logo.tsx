import { cn } from '@/lib/cn';
import { APP_SHORT_NAME } from '@/config/env';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-10', className)} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f63f0" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-g)" />
      <g fill="#fff">
        <rect x="14" y="26" width="6" height="12" rx="3" />
        <rect x="24" y="18" width="6" height="28" rx="3" />
        <rect x="34" y="22" width="6" height="20" rx="3" />
        <rect x="44" y="28" width="6" height="8" rx="3" />
      </g>
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <div className="leading-tight">
        <p className={cn('text-[20px] font-bold tracking-tight', light ? 'text-white' : 'text-slate-900')}>
          {APP_SHORT_NAME}
        </p>
        <p className={cn('text-[11px] font-medium', light ? 'text-brand-200' : 'text-slate-500')}>
          Real-Time Conversation Chemistry Analyzer
        </p>
      </div>
    </div>
  );
}
