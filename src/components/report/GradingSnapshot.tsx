import type { ReactNode } from 'react';
import { BookOpenText, MessageCircleQuestion, Timer, TextQuote } from 'lucide-react';
import { ReliabilityPanel } from '@/components/report/ReliabilityPanel';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/lib/format';
import type { QASummary, Reliability } from '@/types/api';

function Tile({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card className="print-break flex items-start gap-3.5 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="tabular mt-0.5 text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{sub}</p>
      </div>
    </Card>
  );
}

/** First thing the examiner sees: can I trust the data, and what did the viva look like at a glance? */
export function GradingSnapshot({ qa, reliability }: { qa: QASummary; reliability: Reliability }) {
  const hasQa = qa.n_questions > 0;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <ReliabilityPanel reliability={reliability} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Tile
          icon={<MessageCircleQuestion className="size-5" />}
          label="Questions answered"
          value={hasQa ? `${qa.n_answered} / ${qa.n_questions}` : '-'}
          sub={hasQa ? 'Questions that received a spoken answer' : 'No transcribed questions'}
        />
        <Tile
          icon={<Timer className="size-5" />}
          label="Time to start answering"
          value={qa.median_latency_s != null ? `${formatNumber(qa.median_latency_s, 1)} s` : '-'}
          sub={qa.within_3s_ratio != null ? `${Math.round(qa.within_3s_ratio * 100)}% began within 3 s` : 'Median across questions'}
        />
        <Tile
          icon={<BookOpenText className="size-5" />}
          label="Technical terms used"
          value={hasQa ? String(qa.technical_terms_total) : '-'}
          sub={qa.technical_terms.length ? qa.technical_terms.slice(0, 4).join(', ') : 'Distinct terms from the syllabus glossary'}
        />
        <Tile
          icon={<TextQuote className="size-5" />}
          label="Average answer length"
          value={qa.mean_answer_words != null ? `${formatNumber(qa.mean_answer_words, 0)} words` : '-'}
          sub={qa.longest_answer_words != null ? `Longest: ${qa.longest_answer_words} words` : 'Across answered questions'}
        />
      </div>
    </div>
  );
}
