import { useMemo, useState } from 'react';
import { CircleCheck, ClipboardCheck, Eye, Save } from 'lucide-react';
import { CohortPanel } from '@/components/report/CohortPanel';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { InfoTip } from '@/components/ui/InfoTip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Textarea } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { Assessment, EvidenceItem, Report, RubricCriterion } from '@/types/api';

const LABELS = ['Poor', 'Weak', 'Satisfactory', 'Good', 'Excellent'] as const;

const STATUS_STYLE: Record<EvidenceItem['status'], { dot: string; text: string; tag: string | null }> = {
  typical: { dot: 'bg-emerald-500', text: 'text-slate-900', tag: 'Typical range' },
  review: { dot: 'bg-amber-500', text: 'text-slate-900', tag: 'Worth a look' },
  info: { dot: 'bg-slate-300', text: 'text-slate-900', tag: null },
};

function overallFrom(scores: Record<string, number>, rubric: ReadonlyArray<RubricCriterion>): number | null {
  if (rubric.some((c) => !scores[c.id])) return null;
  const total = rubric.reduce((a, c) => a + c.weight, 0);
  return Math.round((rubric.reduce((a, c) => a + (c.weight * scores[c.id]) / 5, 0) / total) * 1000) / 10;
}

function EvidenceRow({ item }: { item: EvidenceItem }) {
  const st = STATUS_STYLE[item.status];
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <span className="flex min-w-0 items-center gap-2.5 text-[13px] text-slate-600">
        <span className={cn('size-2 shrink-0 rounded-full', st.dot)} />
        <span className="truncate">{item.label}</span>
        {item.hint && <InfoTip align="left">{item.hint}</InfoTip>}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {st.tag && <span className={cn('hidden text-[11px] font-semibold sm:inline', item.status === 'typical' ? 'text-emerald-600' : 'text-amber-600')}>{st.tag}</span>}
        <span className={cn('tabular text-sm font-bold', st.text)}>{item.display}</span>
      </span>
    </li>
  );
}

function RatingControl({ value, onChange, name }: { value: number | undefined; onChange: (v: number) => void; name: string }) {
  return (
    <div role="radiogroup" aria-label={`${name} rating`} className="grid grid-cols-5 gap-2">
      {LABELS.map((label, i) => {
        const v = i + 1;
        const active = value === v;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-xl border-2 px-1 py-2.5 transition-all active:scale-95',
              active ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            <span className={cn('tabular text-lg font-extrabold', active ? 'text-brand-700' : 'text-slate-700')}>{v}</span>
            <span className={cn('text-[10px] font-semibold', active ? 'text-brand-600' : 'text-slate-400')}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * The examiner rates each criterion 1-5 THEMSELVES, looking at the evidence attached to it.
 * The overall mark is weighted arithmetic over those ratings. No AI value is ever fed into it.
 */
export function RubricAssessment({ report, onSaved }: { report: Report; onSaved: (a: Assessment) => void }) {
  const toast = useToast();
  const { rubric, evidence, session } = report;
  const [scores, setScores] = useState<Record<string, number>>(report.assessment?.scores ?? {});
  const [notes, setNotes] = useState(report.assessment?.notes ?? '');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  const overall = useMemo(() => overallFrom(scores, rubric), [scores, rubric]);
  const rated = rubric.filter((c) => scores[c.id]).length;

  const rate = (id: string, v: number) => {
    setScores((s) => ({ ...s, [id]: v }));
    setDirty(true);
  };

  const save = async () => {
    setBusy(true);
    try {
      const res = await api.saveAssessment(session.id, scores, notes.trim());
      onSaved({ scores: res.scores, overall_mark: res.overall_mark, notes: res.notes, updated_at: res.updated_at });
      setDirty(false);
      toast.success(res.label_recorded ? `Assessment saved - overall mark ${res.overall_mark}.` : 'Draft saved. Rate every criterion to complete it.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save your assessment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
      <div className="min-w-0 space-y-4">
        {rubric.map((c, idx) => (
          <Card key={c.id} className="print-break">
            <div className="flex items-start justify-between gap-4 px-5 pt-5">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Criterion {idx + 1}</p>
                <h3 className="text-[15px] font-bold text-slate-900">{c.title}</h3>
                <p className="mt-0.5 text-[13px] leading-5 text-slate-500">{c.description}</p>
              </div>
              <Badge tone="slate">{c.weight}% weight</Badge>
            </div>
            <CardBody className="space-y-4 pt-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-1.5">
                <p className="flex items-center gap-1.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <Eye className="size-3.5" /> Evidence from the session
                </p>
                <ul className="divide-y divide-slate-100">{(evidence[c.id] ?? []).map((item) => <EvidenceRow key={item.key} item={item} />)}</ul>
              </div>
              <div className="no-print">
                <p className="mb-2 text-[13px] font-semibold text-slate-700">Your rating</p>
                <RatingControl value={scores[c.id]} onChange={(v) => rate(c.id, v)} name={c.title} />
              </div>
              <p className="hidden text-sm font-semibold text-slate-800 print:block">
                Rating: {scores[c.id] ? `${scores[c.id]} / 5 (${LABELS[scores[c.id] - 1]})` : 'not rated'}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <Card className="print-break">
          <CardHeader title="Your assessment" subtitle="Entered by you - independent of the AI" icon={<ClipboardCheck className="size-[18px]" />} />
          <CardBody className="space-y-5">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-slate-600">
                <span>Criteria rated</span>
                <span className="tabular">{rated} / {rubric.length}</span>
              </div>
              <ProgressBar value={(rated / rubric.length) * 100} barClassName={rated === rubric.length ? 'bg-emerald-500' : 'bg-brand-500'} />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-4 text-white">
              <p className="text-[13px] font-semibold text-white/80">Overall mark (from your ratings)</p>
              <p className="tabular mt-1 text-5xl font-extrabold tracking-tight">{overall === null ? '--' : overall.toFixed(0)}<span className="text-xl font-bold text-white/60"> / 100</span></p>
              <p className="mt-1.5 text-xs leading-5 text-white/75">Weighted average of your five ratings. Simple arithmetic - no AI value is included.</p>
            </div>

            <div className="no-print space-y-5">
              <Textarea
                label="Examiner notes (optional)"
                placeholder="Rationale, adjustments made for this student, points to feed back…"
                value={notes}
                maxLength={4000}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setDirty(true);
                }}
              />
              <Button block icon={<Save className="size-4" />} loading={busy} disabled={rated === 0 || !dirty} onClick={save}>
                {overall === null ? 'Save draft' : 'Save assessment'}
              </Button>
              {report.assessment?.overall_mark != null && !dirty && (
                <Alert tone="success"><span className="flex items-center gap-1.5"><CircleCheck className="size-4" /> Saved: {report.assessment.overall_mark} / 100</span></Alert>
              )}
            </div>
            {notes.trim() && <p className="hidden whitespace-pre-wrap text-sm text-slate-700 print:block">Notes: {notes}</p>}
          </CardBody>
        </Card>

        <CohortPanel cohort={report.cohort} overall={overall} />
      </div>
    </div>
  );
}
