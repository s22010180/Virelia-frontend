import { Ring } from '@/components/charts/Ring';
import { InfoTip } from '@/components/ui/InfoTip';
import { useCountUp } from '@/hooks/useCountUp';
import { toneFor } from '@/config/metrics';
import type { MetricDef } from '@/config/metrics';
import { TONE_TEXT } from '@/lib/tone';
import { formatNumber } from '@/lib/format';

export function MetricRingCard({
  def,
  value,
  provisional = false,
  detail,
}: {
  def: MetricDef;
  value: number | null;
  provisional?: boolean;
  detail?: string;
}) {
  const animated = useCountUp(value, 900);
  const tone = provisional ? 'muted' : toneFor(value);
  return (
    <div className="print-break flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
      <Ring value={value} tone={tone} size={84} stroke={8}>
        <span className={`tabular text-xl font-extrabold ${TONE_TEXT[tone]}`}>{animated == null ? '--' : formatNumber(animated, 0)}</span>
      </Ring>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          {def.label}
          <InfoTip align="left">{def.basis}</InfoTip>
        </p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{def.description}</p>
        {detail && <p className="mt-1 text-[11px] font-medium leading-4 text-slate-400">{detail}</p>}
      </div>
    </div>
  );
}
