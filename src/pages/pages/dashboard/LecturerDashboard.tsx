import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, CircleCheck, ClipboardList, FileBarChart2, Plus, Radio, Server, VideoOff } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { SessionListItem } from '@/components/sessions/SessionList';
import { NewSessionModal } from '@/components/sessions/NewSessionModal';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import type { VivaSession } from '@/types/api';

export default function LecturerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const sessions = useAsync(() => api.listSessions(), []);
  const health = useAsync(() => api.health(), []);

  const list = sessions.data ?? [];
  const active = list.filter((s) => s.status === 'ACTIVE');
  const completed = list.filter((s) => s.status === 'COMPLETED');
  const assessed = completed.filter((s) => s.lecturer_label !== null).length;

  const onCreated = (s: VivaSession) => {
    setModal(false);
    navigate(`/app/lobby/${s.id}`);
  };

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.full_name.split(' ')[0] ?? 'Examiner'}`}
        description="Run a viva, watch interaction indicators live, and review evidence-rich reports afterwards."
        actions={<Button icon={<Plus className="size-4" />} onClick={() => setModal(true)}>New viva</Button>}
      />

      {sessions.error && <Alert tone="danger" className="mb-6" title="Could not load sessions" action={<Button size="sm" variant="secondary" onClick={sessions.reload}>Retry</Button>}>{sessions.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total vivas" value={list.length} icon={<ClipboardList className="size-6" />} loading={sessions.loading} />
        <StatCard label="Open now" value={active.length} icon={<Radio className="size-6" />} tone="green" loading={sessions.loading} />
        <StatCard label="Completed" value={completed.length} icon={<CircleCheck className="size-6" />} tone="violet" loading={sessions.loading} />
        <StatCard label="Assessed by you" value={assessed} icon={<FileBarChart2 className="size-6" />} tone="amber" loading={sessions.loading} hint="Examiner rubric recorded" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="animate-slide-up overflow-hidden">
            <CardHeader title="Open vivas" subtitle="Sessions waiting for, or in, a live viva" icon={<Radio className="size-[18px]" />} />
            <div className="mt-4 border-t border-slate-100">
              {sessions.loading ? (
                <div className="space-y-3 p-5">{[0, 1].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : active.length === 0 ? (
                <EmptyState
                  icon={<VideoOff className="size-6" />}
                  title="No open vivas"
                  description="Create a session for a student to begin. They will see it on their dashboard."
                  action={<Button icon={<Plus className="size-4" />} onClick={() => setModal(true)}>Start a viva</Button>}
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {active.map((s) => (
                    <SessionListItem
                      key={s.id}
                      session={s}
                      counterpart={s.student?.full_name ?? 'Student'}
                      action={
                        <div className="flex items-center gap-2.5">
                          <Badge tone={s.consent_student ? 'green' : 'slate'}>{s.consent_student ? 'AI analysis on' : 'Awaiting consent'}</Badge>
                          <Link to={`/app/lobby/${s.id}`}><Button size="sm" iconRight={<ArrowRight className="size-4" />}>Enter</Button></Link>
                        </div>
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card className="animate-slide-up overflow-hidden">
            <CardHeader
              title="Recent reports"
              subtitle="Completed vivas with timeline, transcript and your assessment"
              icon={<FileBarChart2 className="size-[18px]" />}
              action={<Link to="/app/sessions" className="text-[13px] font-semibold text-brand-600 hover:text-brand-700">View all</Link>}
            />
            <div className="mt-4 border-t border-slate-100">
              {sessions.loading ? (
                <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : completed.length === 0 ? (
                <EmptyState icon={<FileBarChart2 className="size-6" />} title="No completed vivas yet" description="Reports appear here after you end a viva." />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {completed.slice(0, 5).map((s) => (
                    <SessionListItem
                      key={s.id}
                      session={s}
                      counterpart={s.student?.full_name ?? 'Student'}
                      action={<Link to={`/app/sessions/${s.id}/report`}><Button size="sm" variant="secondary">Report</Button></Link>}
                    />
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader title="Analysis services" subtitle="Backend model status" icon={<Server className="size-[18px]" />} />
            <CardBody className="space-y-2.5">
              {health.loading && <Skeleton className="h-20 w-full" />}
              {health.error && <Alert tone="danger" title="Backend unreachable">{health.error}</Alert>}
              {health.data && (
                <>
                  {[
                    [`Speech-to-text${health.data.asr_engine ? ` (${health.data.asr_engine})` : ''}`, health.data.asr],
                    ['Trained scorer (research)', health.data.learned_scorer],
                  ].map(([label, ok]) => (
                    <div key={String(label)} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm">
                      <span className="font-medium text-slate-700">{label}</span>
                      <Badge tone={ok ? 'green' : 'slate'} dot>{ok ? 'Ready' : 'Off'}</Badge>
                    </div>
                  ))}
                  <p className="flex items-center gap-2 pt-1 text-xs text-slate-400"><Activity className="size-3.5" /> {health.data.active_rooms} active room(s)</p>
                </>
              )}
            </CardBody>
          </Card>

          <Card className="animate-slide-up bg-linear-to-br from-violet-50 to-brand-50">
            <CardBody>
              <p className="text-sm font-bold text-slate-900">Your role as examiner</p>
              <p className="mt-1.5 text-[13px] leading-6 text-slate-600">
                Indicators support - never replace - your judgement. Record your own assessment in each report; it is stored separately from the AI output.
              </p>
              <Link to="/app/transparency" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 hover:text-brand-700">
                Read the transparency notice <ArrowRight className="size-3.5" />
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>

      <NewSessionModal open={modal} onClose={() => setModal(false)} onCreated={onCreated} />
    </>
  );
}
