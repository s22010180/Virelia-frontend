import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const STYLES: Record<AlertTone, { box: string; icon: ReactNode }> = {
  info: { box: 'border-brand-200 bg-brand-50/70 text-brand-900', icon: <Info className="size-5 text-brand-600" /> },
  success: { box: 'border-emerald-200 bg-emerald-50/70 text-emerald-900', icon: <CircleCheck className="size-5 text-emerald-600" /> },
  warning: { box: 'border-amber-200 bg-amber-50/80 text-amber-900', icon: <TriangleAlert className="size-5 text-amber-600" /> },
  danger: { box: 'border-rose-200 bg-rose-50/80 text-rose-900', icon: <CircleAlert className="size-5 text-rose-600" /> },
};

export function Alert({
  tone = 'info',
  title,
  children,
  action,
  className,
}: {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const s = STYLES[tone];
  return (
    <div role="alert" className={cn('flex gap-3 rounded-xl border p-4', s.box, className)}>
      <span className="mt-0.5 shrink-0">{s.icon}</span>
      <div className="min-w-0 flex-1 text-sm leading-6">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && 'opacity-90')}>{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
