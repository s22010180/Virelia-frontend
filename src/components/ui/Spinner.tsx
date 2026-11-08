import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn('size-5 animate-spin text-brand-600', className)} aria-label="Loading" />;
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex animate-fade-in flex-col items-center gap-3 text-slate-500">
        <Spinner className="size-8" />
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
