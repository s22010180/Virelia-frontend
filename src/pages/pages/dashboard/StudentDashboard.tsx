import { Link } from 'react-router-dom';
import { ArrowRight, History, Radio, ScrollText, VideoOff } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { SessionListItem } from '@/components/sessions/SessionList';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const sessions = useAsync(() => api.listSessions(), []);
  const list = sessions.data ?? [];
  const active = list.filter((s) => s.status === 'ACTIVE');
  const past = list.filter((s) => s.status === 'COMPLETED');

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.full_name.split(' ')[0] ?? 'there'}`}
        description="Join your viva when your examiner has created the session. You choose whether AI-assisted analysis is used."
      />

      {sessions.error && <Alert tone="danger" className="mb-6" title="Could not load your sessions" action={<Button size="sm" variant="secondary" onClick={sessions.reload}>Retry</Button>}>{sessions.error}</Alert>}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="animate-slide-up overflow-hidden">
            <CardHeader title="Your upcoming viva" subtitle="Join through the lobby to check your camera and microphone" icon={<Radio className="size-[18px]" />} />
            <div className="mt-4 border-t border-slate-100">
              {sessions.loading ? (
                <div className="space-y-3 p-5"><Skeleton className="h-14 w-full" /></div>
              ) : active.length === 0 ? (
                <EmptyState icon={<VideoOff className="size-6" />} title="No viva scheduled yet" description="When your examiner creates a session for you, it appears here." />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {active.map((s) => (
                    <SessionListItem
                      key={s.id}
                      session={s}
                      counterpart={s.lecturer?.full_name ?? 'Examiner'}
                      action={<Link to={`/app/lobby/${s.id}`}><Button size="sm" iconRight={<ArrowRight className="size-4" />}>Join lobby</Button></Link>}
                    />
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card className="animate-slide-up overflow-hidden">
            <CardHeader title="Past vivas" icon={<History className="size-[18px]" />} />
            <div className="mt-4 border-t border-slate-100">
              {past.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-500">Nothing here yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {past.map((s) => <SessionListItem key={s.id} session={s} counterpart={s.lecturer?.full_name ?? 'Examiner'} />)}
                </ul>
              )}
            </div>
          </Card>
        </div>

        <Card className="h-fit animate-slide-up bg-linear-to-br from-violet-50 to-brand-50">
          <CardHeader title="Your data & rights" icon={<ScrollText className="size-[18px]" />} />
          <CardBody>
            <ul className="space-y-2.5 text-[13px] leading-6 text-slate-600">
              <li>• Analysis is <strong>optional</strong> - you can join without it.</li>
              <li>• You can switch it off at any moment during the viva.</li>
              <li>• Only your examiner sees results. They always make the decision.</li>
              <li>• No video or raw audio is recorded.</li>
            </ul>
            <Link to="/app/transparency" className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 hover:text-brand-700">
              Full transparency notice <ArrowRight className="size-3.5" />
            </Link>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
