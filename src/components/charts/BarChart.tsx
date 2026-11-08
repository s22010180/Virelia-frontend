import { useElementSize } from '@/hooks/useElementSize';
import { cn } from '@/lib/cn';

export interface Bar {
  label: string;
  value: number | null;
  color: string;
  title: string;
}

/** Simple, accessible bar chart (SVG). `value === null` renders an empty slot marked "-". */
export function BarChart({
  bars,
  unit,
  height = 190,
  maxValue,
  className,
}: {
  bars: ReadonlyArray<Bar>;
  unit: string;
  height?: number;
  maxValue?: number;
  className?: string;
}) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const w = Math.max(width, 240);
  const pad = { l: 30, r: 8, t: 22, b: 24 };
  const innerW = w - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const top = maxValue ?? Math.max(1, ...bars.map((b) => b.value ?? 0)) * 1.15;
  const slot = bars.length ? innerW / bars.length : innerW;
  const barW = Math.min(46, slot * 0.62);
  const y = (v: number) => pad.t + innerH - (Math.min(v, top) / top) * innerH;
  const ticks = [0, top / 2, top];

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <svg width={w} height={height} role="img" aria-label={`Bar chart, ${unit}`}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke="#e8ecf4" strokeDasharray={i === 0 ? undefined : '3 4'} />
            <text x={pad.l - 6} y={y(t) + 3.5} textAnchor="end" className="fill-slate-400 text-[10px]">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {bars.map((b, i) => {
          const cx = pad.l + slot * i + slot / 2;
          const h = b.value == null ? 0 : innerH - (y(b.value) - pad.t);
          return (
            <g key={i}>
              <title>{b.title}</title>
              {b.value != null && (
                <rect x={cx - barW / 2} y={y(b.value)} width={barW} height={Math.max(h, 1)} rx={5} fill={b.color} className="animate-fade-in" />
              )}
              <text x={cx} y={b.value == null ? y(0) - 6 : y(b.value) - 6} textAnchor="middle" className="fill-slate-600 text-[10.5px] font-semibold">
                {b.value == null ? '-' : b.value % 1 === 0 ? b.value : b.value.toFixed(1)}
              </text>
              <text x={cx} y={height - 7} textAnchor="middle" className="fill-slate-500 text-[11px] font-semibold">
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
