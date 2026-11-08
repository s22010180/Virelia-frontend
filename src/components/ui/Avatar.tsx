import { cn } from '@/lib/cn';
import { initials } from '@/lib/format';

const PALETTE = [
  'bg-brand-100 text-brand-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
];

export function Avatar({ name, size = 'md', className }: { name: string | null | undefined; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const hash = [...(name ?? '?')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const dims = size === 'sm' ? 'size-8 text-xs' : size === 'lg' ? 'size-14 text-lg' : 'size-10 text-sm';
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-full font-bold', dims, PALETTE[hash % PALETTE.length], className)}>
      {initials(name)}
    </span>
  );
}
