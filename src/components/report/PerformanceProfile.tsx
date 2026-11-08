import { Hourglass } from 'lucide-react';
import { MetricRingCard } from '@/components/metrics/MetricRingCard';
import { Alert } from '@/components/ui/Alert';
import { METRICS, PERFORMANCE_ORDER } from '@/config/metrics';
import type { Performance } from '@/types/api';

/** The headline of the report: five separate student indicators. There is deliberately no overall score. */
export function PerformanceProfile({ performance }: { performance: Performance }) {
  return (
    <div className="space-y-4">
      {performance.provisional && (
        <Alert tone="warning" title="Provisional profile">
          <span className="flex items-start gap-2">
            <Hourglass className="mt-0.5 size-4 shrink-0" />
            {performance.reason ?? 'There was little data.'} Scores are pulled toward the neutral midpoint and should be treated with caution.
          </span>
        </Alert>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {PERFORMANCE_ORDER.map((k) => {
          const ind = performance.indicators[k];
          return (
            <MetricRingCard
              key={k}
              def={METRICS[k]}
              value={ind?.score ?? null}
              provisional={performance.provisional}
              detail={ind?.detail}
            />
          );
        })}
      </div>
      <p className="text-xs leading-5 text-slate-400">
        Five separate indicators on purpose - no single overall score. They describe how the answers went, not whether they were correct.
      </p>
    </div>
  );
}
