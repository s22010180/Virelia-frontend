import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Always-visible disclosure: AI is used, examiner decides. Links to the Transparency page. */
export function AiNoticeBadge({ to = '/app/transparency', className, compact = false }: { to?: string; className?: string; compact?: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100',
        className,
      )}
      title="This system uses AI for decision support. The examiner always makes the assessment decision. Click to learn more."
    >
      <ShieldCheck className="size-3.5" />
      {compact ? 'AI-assisted' : 'AI-assisted · Examiner decides'}
    </Link>
  );
}
