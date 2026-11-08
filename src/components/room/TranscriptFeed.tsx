import { useEffect, useRef } from 'react';
import { MessageSquareText } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';

export interface FeedItem {
  role: 'student' | 'examiner';
  start: number;
  text: string;
}

export function TranscriptFeed({ items, emptyHint }: { items: ReadonlyArray<FeedItem>; emptyHint: string }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const nearBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 120;
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [items.length]);

  if (items.length === 0) {
    return <EmptyState icon={<MessageSquareText className="size-6" />} title="No transcript yet" description={emptyHint} />;
  }

  return (
    <div ref={containerRef} className="h-full space-y-3 overflow-y-auto pr-1">
      {items.map((it, i) => (
        <div key={`${it.start}-${i}`} className={cn('flex animate-slide-up flex-col', it.role === 'student' ? 'items-start' : 'items-end')}>
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span className={it.role === 'student' ? 'text-brand-600' : 'text-emerald-600'}>
              {it.role === 'student' ? 'Student' : 'Examiner'}
            </span>
            <span className="tabular">{formatDuration(it.start)}</span>
          </div>
          <p
            className={cn(
              'max-w-[92%] rounded-2xl px-3.5 py-2 text-[13px] leading-5',
              it.role === 'student' ? 'rounded-tl-md bg-brand-50 text-slate-800' : 'rounded-tr-md bg-emerald-50 text-slate-800',
            )}
          >
            {it.text}
          </p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
