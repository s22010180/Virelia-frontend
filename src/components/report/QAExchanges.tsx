import { useState } from 'react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/cn';
import { formatDuration, formatNumber } from '@/lib/format';
import type { QAExchange } from '@/types/api';

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="tabular font-bold text-slate-800">{value}</span>
    </span>
  );
}

export function QAExchanges({ exchanges }: { exchanges: ReadonlyArray<QAExchange> }) {
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());

  if (exchanges.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircleQuestion className="size-6" />}
        title="No questions were detected"
        description="Question-by-question evidence needs a transcript. It is produced only while the student has AI analysis switched on."
      />
    );
  }

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const allOpen = open.size === exchanges.length;

  return (
    <div>
      <div className="no-print mb-3 flex justify-end">
        <Button size="sm" variant="ghost" onClick={() => setOpen(allOpen ? new Set() : new Set(exchanges.map((e) => e.index)))}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>
      <ul className="space-y-2.5">
        {exchanges.map((e) => {
          const isOpen = open.has(e.index);
          return (
            <li key={e.index} className="print-break overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => toggle(e.index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-extrabold text-brand-700">Q{e.index}</span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">{e.question}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="tabular">asked at {formatDuration(e.q_start)}</span>
                    {e.latency_s != null && <span className="tabular">answer began after {formatNumber(e.latency_s, 1)} s</span>}
                    {e.answered && <span className="tabular">{e.answer_words} words</span>}
                  </span>
                </span>
                {e.answered ? <Badge tone="green">Answered</Badge> : <Badge tone="amber">{e.answer_words > 0 ? 'Very brief' : 'No answer heard'}</Badge>}
                <ChevronDown className={cn('size-4 shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
              </button>

              {(isOpen) && (
                <div className="animate-fade-in space-y-3.5 border-t border-slate-100 bg-slate-50/50 px-4 py-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">Question</p>
                    <p className="mt-0.5 text-sm leading-6 text-slate-700">{e.question}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600">Answer (transcribed)</p>
                    <p className="mt-0.5 text-sm leading-6 text-slate-700">{e.answer || 'No speech was transcribed after this question.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {e.latency_s != null && <Chip label="Started after" value={`${formatNumber(e.latency_s, 1)} s`} />}
                    {e.answer_speaking_s != null && e.answer_speaking_s > 0 && <Chip label="Spoke for" value={`${formatNumber(e.answer_speaking_s, 0)} s`} />}
                    {e.wpm != null && <Chip label="Rate" value={`${formatNumber(e.wpm, 0)} wpm`} />}
                    {e.coverage != null && <Chip label={`Question ${e.coverage_basis ?? 'terms'} addressed`} value={`${Math.round(e.coverage * 100)}%`} />}
                    <Chip label="Hedging phrases" value={String(e.hedges)} />
                    <Chip label="Fillers" value={String(e.fillers)} />
                    {e.overlap && <Chip label="Note" value="started over the question" />}
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Technical terms in the answer</p>
                    {e.technical_terms.length === 0 ? (
                      <p className="text-xs text-slate-500">None from the glossary were detected.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">{e.technical_terms.map((t) => <Badge key={t} tone="brand">{t}</Badge>)}</div>
                    )}
                  </div>
                  <p className="text-[11px] leading-5 text-slate-400">
                    Evidence of what was said - not of whether it was correct. Speech recognition may mis-hear technical words.
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
