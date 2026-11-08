import { CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Insight } from '@/types/api';

const STYLE = {
  positive: { icon: CircleCheck, box: 'bg-emerald-50/70 border-emerald-200', ic: 'text-emerald-600' },
  info: { icon: Info, box: 'bg-slate-50 border-slate-200', ic: 'text-slate-500' },
  attention: { icon: TriangleAlert, box: 'bg-amber-50/70 border-amber-200', ic: 'text-amber-600' },
} as const;

export function InsightList({ insights }: { insights: ReadonlyArray<Insight> }) {
  if (insights.length === 0) return <p className="text-sm text-slate-500">No observations were generated for this session.</p>;
  return (
    <ul className="grid gap-2.5 md:grid-cols-2">
      {insights.map((it, i) => {
        const s = STYLE[it.level] ?? STYLE.info;
        const Icon = s.icon;
        return (
          <li key={`${it.title}-${i}`} className={cn('print-break flex gap-3 rounded-xl border p-3.5', s.box)}>
            <Icon className={cn('mt-0.5 size-5 shrink-0', s.ic)} />
            <div className="text-sm leading-5">
              <p className="font-semibold text-slate-900">{it.title}</p>
              <p className="mt-0.5 text-slate-600">{it.message}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
