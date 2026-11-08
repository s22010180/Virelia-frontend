import { Sparkline } from '@/components/charts/Sparkline';
import { InfoTip } from '@/components/ui/InfoTip';
import { useCountUp } from '@/hooks/useCountUp';
import { toneFor } from '@/config/metrics';
import type { MetricDef } from '@/config/metrics';
import { TONE_HEX, TONE_TEXT } from '@/lib/tone';
import { formatNumber } from '@/lib/format';

export function LiveMetricTile({
  def,
  value,
  history,
  provisional,
  caption,
}: {
  def: MetricDef;
  value: number | null;
  history: ReadonlyArray<number | null>;
  provisional: boolean;
  caption?: string;
}) {
  const animated = useCountUp(value, 600);
  const tone = provisional ? 'muted' : toneFor(value);
  const Icon = def.icon;
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:shadow-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
          <span className="grid size-7 place-items-center rounded-lg" style={{ background: `${def.color}14`, color: def.color }}>
            <Icon className="size-4" />
          </span>
          {def.short}
        </div>
        <InfoTip align="right">
          <strong className="block text-white">{def.label}</strong>
          {def.basis}
        </InfoTip>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className={`tabular text-3xl font-extrabold tracking-tight ${provisional ? 'text-slate-400' : TONE_TEXT[tone]}`}>
          {animated == null ? '--' : formatNumber(animated, 0)}
        </p>
        <div className="w-24 pb-1">
          <Sparkline data={history} color={provisional ? '#cbd5e1' : TONE_HEX[tone === 'muted' ? 'neutral' : tone]} />
        </div>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{caption ?? def.description}</p>
    </div>
  );
}
