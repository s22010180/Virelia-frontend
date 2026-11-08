import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircleCheck, Hourglass, LogIn, Mic, ShieldCheck, TriangleAlert, Video } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { VideoTile } from '@/components/room/VideoTile';
import { ConsentPanel } from '@/components/compliance/ConsentPanel';
import type { ConsentChoice } from '@/components/compliance/ConsentPanel';
import { useAsync } from '@/hooks/useAsync';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLocalMedia } from '@/hooks/useLocalMedia';
import { useMicLevel } from '@/hooks/useMicLevel';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

function CheckRow({ ok, pending, label, detail }: { ok: boolean; pending?: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
      {ok ? <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" /> : pending ? <Hourglass className="mt-0.5 size-5 shrink-0 text-amber-500" /> : <TriangleAlert className="mt-0.5 size-5 shrink-0 text-rose-500" />}
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs leading-5 text-slate-500">{detail}</p>
      </div>
    </li>
  );
}

export default function LobbyPage() {
  useDocumentTitle('Viva lobby');
  const { sessionId } = useParams<{ sessionId: string }>();
  const id = Number(sessionId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const media = useLocalMedia();
  const level = useMicLevel(media.stream, media.micOn);
  const [busy, setBusy] = useState(false);

  const session = useAsync(() => api.getSession(id), [id]);
  const isLecturer = user?.role === 'lecturer';

  // Examiner: keep the student's consent status fresh while waiting.
  useEffect(() => {
    if (!isLecturer) return;
    const t = window.setInterval(() => session.reload(), 5000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLecturer]);

  const s = session.data;

  const enter = () => {
    if (s) navigate(`/app/room/${s.room_id}`);
  };

  const onChoose = async (choice: ConsentChoice) => {
    if (!s) return;
    setBusy(true);
    try {
      await api.setConsent(s.id, choice.analysis);
      toast.info(choice.analysis ? 'AI analysis enabled. You can switch it off during the viva.' : 'Joining without AI analysis.');
      navigate(`/app/room/${s.room_id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save your choice.');
    } finally {
      setBusy(false);
    }
  };

  if (session.loading && !s) return <PageLoader label="Loading session…" />;
  if (session.error || !s) {
    return <Alert tone="danger" title="Session not available" action={<Button variant="secondary" onClick={() => navigate('/app/dashboard')}>Back to dashboard</Button>}>{session.error ?? 'This session could not be found.'}</Alert>;
  }
  if (s.status === 'COMPLETED') {
    return <Alert tone="info" title="This viva has ended" action={<Button variant="secondary" onClick={() => navigate('/app/dashboard')}>Dashboard</Button>}>It can no longer be joined.</Alert>;
  }

  const other = isLecturer ? s.student?.full_name : s.lecturer?.full_name;

  return (
    <>
      <PageHeader
        back={{ to: '/app/dashboard', label: 'Dashboard' }}
        title={s.title || `Viva with ${other ?? 'participant'}`}
        description={isLecturer ? 'Check your equipment, then enter the room. The student decides whether AI analysis is used.' : 'Check your equipment and choose how you would like to take part.'}
        actions={<Badge tone="green" dot>Session open</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-5">
          <VideoTile stream={media.stream} label={user?.full_name ?? 'You'} muted mirrored camOff={!media.camOn} micOff={!media.micOn} className="aspect-video" />

          {media.error ? (
            <Alert tone="danger" title="Camera / microphone problem" action={<Button size="sm" variant="secondary" onClick={media.retry}>Try again</Button>}>{media.error}</Alert>
          ) : (
            <Card>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  <Button variant={media.micOn ? 'secondary' : 'danger'} size="sm" icon={<Mic className="size-4" />} onClick={media.toggleMic}>{media.micOn ? 'Mic on' : 'Mic muted'}</Button>
                  <Button variant={media.camOn ? 'secondary' : 'danger'} size="sm" icon={<Video className="size-4" />} onClick={media.toggleCam}>{media.camOn ? 'Camera on' : 'Camera off'}</Button>
                </div>
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-slate-700">Microphone level - say something</p>
                  <div className="flex h-3 gap-1" aria-hidden="true">
                    {Array.from({ length: 24 }, (_, i) => (
                      <span key={i} className={cn('flex-1 rounded-full transition-colors duration-100', level * 24 > i ? (i > 19 ? 'bg-rose-400' : i > 14 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-slate-200')} />
                    ))}
                  </div>
                </div>
                <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  This preview stays on your device. Headphones are strongly recommended - speaker echo can distort the timing measures.
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader
            title={isLecturer ? 'Before you enter' : 'AI-assisted analysis'}
            subtitle={isLecturer ? 'Readiness checklist' : 'Your choice - you can change it at any time'}
            icon={<ShieldCheck className="size-[18px]" />}
          />
          <CardBody>
            {isLecturer ? (
              <div className="space-y-5">
                <ul className="space-y-2.5">
                  <CheckRow ok={!!media.stream && !media.error} pending={!media.stream && !media.error} label="Camera & microphone" detail={media.stream ? 'Ready.' : media.error ?? 'Waiting for permission…'} />
                  <CheckRow
                    ok={s.consent_student}
                    pending
                    label="Student's AI-analysis consent"
                    detail={s.consent_student ? `${s.student?.full_name ?? 'The student'} has allowed analysis.` : 'Not given yet. The student chooses when they join; this updates automatically. You can also run the viva without analysis.'}
                  />
                </ul>
                <Alert tone="info">
                  You see indicators only when the student has opted in. They never replace your judgement, and you record your own assessment in the report.
                </Alert>
                <Button size="lg" block icon={<LogIn className="size-5" />} onClick={enter} disabled={!media.stream}>Enter viva room</Button>
              </div>
            ) : (
              <ConsentPanel busy={busy} alreadyGranted={s.consent_student} onChoose={onChoose} />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
