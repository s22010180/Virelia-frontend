import { Lock, Scale } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { METRICS } from '@/config/metrics';
import type { MetricKey } from '@/config/metrics';
import type { Cohort } from '@/types/api';

/**
 * Consistency check. Deliberately LOCKED until the examiner has rated every criterion, so the comparison
 * can never anchor their first judgement. Positions are within the examiner's OWN other vivas.
 */
export function CohortPanel({ cohort, overall }: { cohort: Cohort | null; overall: number | null }) {
  return (
    <Card className="no-print">
      <CardHeader title="Consistency check" subtitle="Compare with your own other vivas" icon={<Scale className="size-[18px]" />} />
      <CardBody className="space-y-3.5">
        {overall === null ? (
          <p className="flex items-start gap-2 rounded-xl bg-slate-50 p-3.5 text-[13px] leading-5 text-slate-600">
            <Lock className="mt-0.5 size-4 shrink-0 text-slate-400" />
            Rate all five criteria first. The comparison is shown afterwards so it cannot influence your own judgement.
          </p>
        ) : !cohort || cohort.n_sessions < cohort.min_required ? (
          <p className="rounded-xl bg-slate-50 p-3.5 text-[13px] leading-5 text-slate-600">
            Needs at least {cohort?.min_required ?? 5} other completed vivas with enough speech ({cohort?.n_sessions ?? 0} so far).
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {cohort.metrics
                .filter((m) => m.percentile != null)
                .map((m) => {
                  const def = METRICS[m.key as MetricKey];
                  return (
                    <li key={m.key}>
                      <div className="mb-1 flex items-center justify-between text-[13px]">
                        <span className="font-medium text-slate-700">{def?.short ?? m.key}</span>
                        <span className="tabular font-bold text-slate-900">{m.percentile}th percentile</span>
                      </div>
                      <ProgressBar value={m.percentile ?? 0} barClassName="bg-brand-400" />
                    </li>
                  );
                })}
            </ul>
            {cohort.similar && (
              <p className="rounded-xl bg-brand-50/60 p-3.5 text-[13px] leading-5 text-slate-700">
                Your mark here is <strong>{overall.toFixed(0)}</strong>. Your {cohort.similar.n} other vivas with a similar overall profile were marked{' '}
                <strong>{cohort.similar.min.toFixed(0)}-{cohort.similar.max.toFixed(0)}</strong>
                {overall < cohort.similar.min - 5 || overall > cohort.similar.max + 5
                  ? '. This mark sits outside that range - worth a second look at your reasoning, if it is not already clear.'
                  : '. This mark is in line with them.'}
              </p>
            )}
            <p className="text-[11px] leading-5 text-slate-400">
              Position within your own cohort, for consistency only. These indicators say nothing about technical correctness, so a different
              mark can be entirely right.
            </p>
          </>
        )}
      </CardBody>
    </Card>
  );
}
