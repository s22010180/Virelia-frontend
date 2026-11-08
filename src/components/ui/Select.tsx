import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: ReactNode;
  error?: string | null;
}

export function Select({ label, hint, error, className, id, children, ...rest }: SelectProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-[13px] font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={fieldId}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border bg-white pl-3.5 pr-10 text-sm text-slate-900 shadow-sm transition',
            'focus:outline-none focus:ring-4 disabled:bg-slate-50 disabled:text-slate-500',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-100',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
