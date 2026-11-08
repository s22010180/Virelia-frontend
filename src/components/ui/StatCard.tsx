import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

export function StatCard({
  label,
  value,
  icon,
  tone = 'brand',
  loading,
  hint,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: 'brand' | 'green' | 'amber' | 'violet';
  loading?: boolean;
  hint?: string;
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  } as const;
  return (
    <Card className="flex items-center gap-4 p-5 transition hover:shadow-lift">
      <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', tones[tone])}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-slate-500">{label}</p>
        {loading ? <Skeleton className="mt-1.5 h-7 w-14" /> : <p className="tabular text-2xl font-extrabold text-slate-900">{value}</p>}
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    </Card>
  );
}
