import type { ReactNode } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/sessions/StatusBadge';
import { formatDateTime } from '@/lib/format';
import type { VivaSession } from '@/types/api';

export function SessionListItem({
  session,
  counterpart,
  action,
}: {
  session: VivaSession;
  counterpart: string;
  action?: ReactNode;
}) {
  return (
    <li className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/70">
      <Avatar name={counterpart} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{session.title || `Viva with ${counterpart}`}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">
          {counterpart} · {formatDateTime(session.ended_at ?? session.started_at ?? session.created_at)}
        </p>
      </div>
      <div className="hidden sm:block"><StatusBadge status={session.status} /></div>
      {action}
    </li>
  );
}
