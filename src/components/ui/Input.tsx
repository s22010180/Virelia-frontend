import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface FieldShellProps {
  id: string;
  label?: string;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-slate-700">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

const FIELD =
  'w-full rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition ' +
  'focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

function fieldTone(error?: string | null): string {
  return error
    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
    : 'border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-100';
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: ReactNode;
  error?: string | null;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export function Input({ label, hint, error, leftIcon, rightSlot, className, id, ...rest }: InputProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          id={fieldId}
          aria-invalid={!!error}
          className={cn(FIELD, fieldTone(error), 'h-11 px-3.5', leftIcon && 'pl-10', rightSlot && 'pr-11', className)}
          {...rest}
        />
        {rightSlot && <span className="absolute inset-y-0 right-2 grid place-items-center">{rightSlot}</span>}
      </div>
    </FieldShell>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: ReactNode;
  error?: string | null;
}

export function Textarea({ label, hint, error, className, id, ...rest }: TextareaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <textarea
        id={fieldId}
        aria-invalid={!!error}
        className={cn(FIELD, fieldTone(error), 'min-h-24 resize-y px-3.5 py-3', className)}
        {...rest}
      />
    </FieldShell>
  );
}
