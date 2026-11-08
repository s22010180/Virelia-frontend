import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string };
}) {
  return (
    <div className="mb-7 animate-slide-up">
      {back && (
        <Link to={back.to} className="no-print mb-3 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-500 transition hover:text-brand-600">
          <ChevronLeft className="size-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-[28px]">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-[15px] leading-6 text-slate-500">{description}</p>}
        </div>
        {actions && <div className="no-print flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}
