import { useMemo, useState } from 'react';
import { MessageSquareText, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import type { TranscriptItem } from '@/types/api';

export function TranscriptView({ items }: { items: ReadonlyArray<TranscriptItem> }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.text.toLowerCase().includes(q)) : items;
  }, [items, query]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquareText className="size-6" />}
        title="No transcript for this session"
        description="Transcription runs only while the student has AI analysis switched on."
      />
    );
  }

  return (
    <div>
      <div className="no-print mb-4 max-w-sm">
        <Input aria-label="Search transcript" placeholder="Search the transcript" leftIcon={<Search className="size-4" />} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-2 print:max-h-none">
        {filtered.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No matches.</p>}
        {filtered.map((it, i) => (
          <div key={`${it.start_s}-${i}`} className="print-break flex gap-3">
            <span className="tabular w-12 shrink-0 pt-0.5 text-right text-xs font-semibold text-slate-400">{formatDuration(it.start_s)}</span>
            <div className={cn('min-w-0 flex-1 rounded-2xl border-l-4 px-4 py-2.5', it.speaker === 'student' ? 'border-brand-400 bg-brand-50/50' : 'border-emerald-400 bg-emerald-50/50')}>
              <p className={cn('text-[11px] font-bold uppercase tracking-wide', it.speaker === 'student' ? 'text-brand-600' : 'text-emerald-600')}>
                {it.speaker === 'student' ? 'Student' : 'Examiner'}
              </p>
              <p className="mt-0.5 text-sm leading-6 text-slate-700">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
