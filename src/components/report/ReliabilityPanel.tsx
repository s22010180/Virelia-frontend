import { CircleAlert, CircleCheck, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Ring } from '@/components/charts/Ring';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { InfoTip } from '@/components/ui/InfoTip';
import { useCountUp } from '@/hooks/useCountUp';
import { TONE_TEXT } from '@/lib/tone';
import type { Tone } from '@/lib/tone';
import { formatNumber } from '@/lib/format';
import type { Reliability } from '@/types/api';

const LEVEL: Record<Reliability['level'], { label: string; tone: Tone }> = {
  high: { label: 'High reliability', tone: 'good' },
  moderate: { label: 'Moderate reliability', tone: 'warn' },
  low: { label: 'Low reliability', tone: 'bad' },
};

const FACTOR_ICON = {
  good: <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />,
  warn: <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />,
  poor: <CircleAlert className="mt-0.5 size-4 shrink-0 text-rose-500" />,
} as const;

/** Tells the examiner how far to trust the indicators for THIS session - never a statement about the student. */
export function ReliabilityPanel({ reliability }: { reliability: Reliability }) {
  const { label, tone } = LEVEL[reliability.level];
  const animated = useCountUp(reliability.score, 900);
  return (
    <Card className="print-break h-full">
      <CardHeader
        title={
          <span className="flex items-center gap-1.5">
            Data reliability
            <InfoTip align="left">
              How much to trust the indicators in this session, based on audio quality, amount of speech, transcript coverage and echo. It says
              nothing about the student.
            </InfoTip>
          </span>
        }
        subtitle="How far to trust the numbers below"
        icon={<ShieldCheck className="size-[18px]" />}
      />
      <CardBody className="space-y-4">
        <div className="flex items-center gap-4">
          <Ring value={reliability.score} tone={tone} size={84} stroke={8}>
            <span className={`tabular text-xl font-extrabold ${TONE_TEXT[tone]}`}>{animated == null ? '--' : formatNumber(animated, 0)}</span>
          </Ring>
          <div>
            <p className={`text-base font-extrabold ${TONE_TEXT[tone]}`}>{label}</p>
            <p className="mt-1 text-[13px] leading-5 text-slate-600">{reliability.advice}</p>
          </div>
        </div>
        <ul className="space-y-2">
          {reliability.factors.map((f) => (
            <li key={f.name} className="flex gap-2.5 text-[13px] leading-5">
              {FACTOR_ICON[f.status]}
              <span>
                <span className="font-semibold text-slate-800">{f.name}: </span>
                <span className="text-slate-600">{f.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
