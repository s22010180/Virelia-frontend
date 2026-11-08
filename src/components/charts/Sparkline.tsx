import { useId } from 'react';

export function Sparkline({
  data,
  color,
  height = 34,
}: {
  data: ReadonlyArray<number | null>;
  color: string;
  height?: number;
}) {
  const gid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const pts = data.map((v, i) => ({ v, i })).filter((p): p is { v: number; i: number } => p.v != null);
  if (pts.length < 2) {
    return <div style={{ height }} className="flex items-end"><div className="h-px w-full bg-slate-200" /></div>;
  }
  const n = data.length - 1;
  const W = 100;
  const H = 30;
  const x = (i: number) => (i / n) * W;
  const y = (v: number) => H - 2 - (Math.max(0, Math.min(100, v)) / 100) * (H - 4);
  const line = pts.map((p, k) => `${k === 0 ? 'M' : 'L'}${x(p.i).toFixed(2)},${y(p.v).toFixed(2)}`).join(' ');
  const area = `${line} L${x(pts[pts.length - 1].i).toFixed(2)},${H} L${x(pts[0].i).toFixed(2)},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }} aria-hidden="true">
      <defs>
        <linearGradient id={`sg${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
