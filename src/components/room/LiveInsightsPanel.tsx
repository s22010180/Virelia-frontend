import { Hourglass, MicOff, Radio, ShieldAlert, Users } from 'lucide-react';
import { LiveMetricTile } from '@/components/metrics/LiveMetricTile';
import { Alert } from '@/components/ui/Alert';
import { InfoTip } from '@/components/ui/InfoTip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { METRICS } from '@/config/metrics';
import type { MetricPoint } from '@/hooks/useTelemetry';
import { useCountUp } from '@/hooks/useCountUp';
import { formatNumber } from '@/lib/format';
import type { LiveMetrics } from '@/types/realtime';

/**
 * Deliberately small: the examiner is busy asking questions. Three signals only. Everything else - depth,
 * technical content, the question-by-question breakdown - is in the report after the viva.
 */
export function LiveInsightsPanel({
  ready,
  consent,
  metrics,
  history,
}: {
  ready: boolean;
  consent: boolean;
  metrics: LiveMetrics | null;
  history: ReadonlyArray<MetricPoint>;
}) {
  const provisional = !metrics || metrics.status === 'warming_up';
  const talk = metrics?.student_talk_ratio ?? null;
  const animatedTalk = useCountUp(talk, 600);
  const series = (key: 'promptness_score' | 'fluency_score') => history.slice(-90).map((h) => h[key]);

  return (
    <div className="space-y-4">
      {!ready && <Alert tone="info" title="Connecting to the analysis service…">Signals will appear as soon as the connection is established.</Alert>}

      {ready && !consent && (
        <Alert tone="warning" title="AI analysis is off">
          <span className="flex items-start gap-2">
            <MicOff className="mt-0.5 size-4 shrink-0" />
            The student has not enabled (or has withdrawn) analysis. No audio is processed and no signals are produced. Assess the viva
            without them - this is a fully supported choice.
          </span>
        </Alert>
      )}

      {ready && consent && !metrics && (
        <Alert tone="info" title="Listening…">
          <span className="flex items-start gap-2"><Radio className="mt-0.5 size-4 shrink-0" /> Signals appear after the first question and answer.</span>
        </Alert>
      )}

      {metrics && provisional && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-amber-900">
            <Hourglass className="size-4" /> Calibrating - values are provisional
          </p>
          <ProgressBar value={metrics.data_sufficiency * 100} className="mt-2.5 bg-amber-100" barClassName="bg-amber-500" />
          <p className="mt-1.5 text-xs text-amber-800/80">Stable signals need about 45 s of student speech ({Math.round(metrics.data_sufficiency * 100)}%).</p>
        </div>
      )}

      <LiveMetricTile
        def={METRICS.promptness}
        value={metrics?.promptness_score ?? null}
        history={series('promptness_score')}
        provisional={provisional}
        caption={metrics?.avg_latency != null ? `Answers typically begin after ${formatNumber(metrics.avg_latency, 1)} s` : METRICS.promptness.description}
      />
      <LiveMetricTile
        def={METRICS.fluency}
        value={metrics?.fluency_score ?? null}
        history={series('fluency_score')}
        provisional={provisional}
        caption={metrics?.avg_wpm != null ? `Speaking at about ${formatNumber(metrics.avg_wpm, 0)} words per minute` : METRICS.fluency.description}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
            <span className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-500"><Users className="size-4" /></span>
            Student speaking share
          </div>
          <InfoTip align="right">Share of all speech that came from the student. A viva is usually student-led, but there is no right or wrong value.</InfoTip>
        </div>
        <p className="tabular mt-3 text-3xl font-extrabold tracking-tight text-slate-800">
          {animatedTalk == null ? '--' : formatNumber(animatedTalk, 0)}<span className="text-lg font-bold text-slate-400">%</span>
        </p>
        <ProgressBar value={talk ?? 0} className="mt-2.5" barClassName="bg-slate-400" />
      </div>

      <p className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-slate-400" />
        <span>Decision support only. Signals can be wrong (accents, noise, network lag, echo). The full report with question-by-question evidence appears when you end the viva. You decide.</span>
      </p>
    </div>
  );
}
