import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  CircleCheck,
  FileText,
  LoaderCircle,
  ShieldCheck,
  TriangleAlert,
  UserRoundSearch,
  Wifi,
  WifiOff,
} from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { Tabs } from "@/components/ui/Tabs";
import { Card, CardBody } from "@/components/ui/Card";
import { VideoTile } from "@/components/room/VideoTile";
import { ControlBar } from "@/components/room/ControlBar";
import { LiveInsightsPanel } from "@/components/room/LiveInsightsPanel";
import { TranscriptFeed } from "@/components/room/TranscriptFeed";
import { StudentAnalysisPanel } from "@/components/room/StudentAnalysisPanel";
import { TransparencyDialog } from "@/components/compliance/TransparencyDialog";
import { useAsync } from "@/hooks/useAsync";
import { useAudioStreamer } from "@/hooks/useAudioStreamer";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useElapsed } from "@/hooks/useElapsed";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useToast } from "@/hooks/useToast";
import { useWebRTC } from "@/hooks/useWebRTC";
import { api } from "@/lib/api";
import { formatDuration } from "@/lib/format";

type PanelTab = "indicators" | "transcript";

export default function RoomPage() {
  useDocumentTitle("Viva room");
  const { roomId = "" } = useParams<{ roomId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const isLecturer = user?.role === "lecturer";

  const sessions = useAsync(() => api.listSessions(), [roomId]);
  const session = useMemo(
    () => sessions.data?.find((s) => s.room_id === roomId) ?? null,
    [sessions.data, roomId],
  );
  const live = !!token && session?.status === "ACTIVE";

  const media = useLocalMedia();
  const telemetry = useTelemetry({ roomId, token: token ?? "", enabled: live });
  const [endedByPeer, setEndedByPeer] = useState(false);
  const rtc = useWebRTC({
    roomId,
    token: token ?? "",
    localStream: media.stream,
    enabled: live,
    onSessionEnded: () => setEndedByPeer(true),
  });

  const analysisOn = telemetry.ready && telemetry.consent;
  useAudioStreamer({
    stream: media.stream,
    enabled: analysisOn,
    sendBinary: telemetry.sendBinary,
    sendJson: telemetry.sendJson,
    resetKey: telemetry.connectionId,
  });

  const [startedAt, setStartedAt] = useState<number | null>(null);
  useEffect(() => {
    if (rtc.peerState === "connected" && startedAt === null)
      setStartedAt(Date.now());
  }, [rtc.peerState, startedAt]);
  const elapsed = useElapsed(startedAt);

  const [tab, setTab] = useState<PanelTab>("indicators");
  const [infoOpen, setInfoOpen] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [ending, setEnding] = useState(false);
  const [consentBusy, setConsentBusy] = useState(false);

  const ended = !isLecturer && (telemetry.ended || endedByPeer);
  useEffect(() => {
    if (!ended) return;
    const t = window.setTimeout(
      () => navigate("/app/dashboard", { replace: true }),
      6000,
    );
    return () => window.clearTimeout(t);
  }, [ended, navigate]);

  const counterpart = isLecturer
    ? session?.student?.full_name
    : session?.lecturer?.full_name;
  const counterpartLabel = counterpart ?? (isLecturer ? "Student" : "Examiner");

  const endViva = async () => {
    if (!session) return;
    setEnding(true);
    try {
      await api.endSession(session.id);
      toast.success("Viva ended. Your report is ready.");
      navigate(`/app/sessions/${session.id}/report`, { replace: true });
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not end the session.",
      );
      setEnding(false);
    }
  };

  const toggleAnalysis = async (next: boolean) => {
    if (!session) return;
    setConsentBusy(true);
    try {
      await api.setConsent(session.id, next);
      telemetry.setConsent(next);
      toast.info(
        next
          ? "AI analysis switched on."
          : "AI analysis switched off. The viva continues normally.",
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not change the setting.",
      );
    } finally {
      setConsentBusy(false);
    }
  };

  if (sessions.loading && !session)
    return <PageLoader label="Joining the room…" />;
  if (!session) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <Alert
          tone="danger"
          title="Room not found"
          action={
            <Button
              variant="secondary"
              onClick={() => navigate("/app/dashboard")}
            >
              Dashboard
            </Button>
          }
        >
          {sessions.error ??
            "This viva room does not exist or you are not a participant."}
        </Alert>
      </div>
    );
  }
  if (session.status === "COMPLETED") {
    return (
      <div className="mx-auto max-w-lg p-8">
        <Alert
          tone="info"
          title="This viva has ended"
          action={
            <Button
              variant="secondary"
              onClick={() => navigate("/app/dashboard")}
            >
              Dashboard
            </Button>
          }
        >
          The room is closed.
        </Alert>
      </div>
    );
  }

  const fatal =
    telemetry.closeInfo && !telemetry.closeInfo.willRetry
      ? telemetry.closeInfo
      : null;
  const realtimeOk = telemetry.connected && rtc.signalReady;
  const waitingText = !rtc.peerPresent
    ? `Waiting for ${counterpartLabel} to join…`
    : "Connecting video…";

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:h-screen">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark className="size-8" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold text-slate-900">
              {session.title || `Viva with ${counterpartLabel}`}
            </p>
            <p className="truncate text-xs text-slate-500">
              {counterpartLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="hidden items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 sm:inline-flex"
          >
            <ShieldCheck className="size-3.5" /> AI-assisted · Examiner decides
          </button>
          <Badge tone={analysisOn ? "green" : "slate"} dot>
            {analysisOn ? "Analysis on" : "Analysis off"}
          </Badge>
          <Badge
            tone={realtimeOk ? "green" : "amber"}
            icon={
              realtimeOk ? (
                <Wifi className="size-3" />
              ) : (
                <WifiOff className="size-3" />
              )
            }
          >
            {realtimeOk ? "Connected" : "Connecting…"}
          </Badge>
          <span className="tabular w-14 text-right text-sm font-bold text-slate-700">
            {formatDuration(startedAt ? elapsed : null)}
          </span>
        </div>
      </header>

      {fatal && (
        <div className="px-4 pt-3">
          <Alert tone="danger" title="Live connection closed">
            {fatal.reason || "The server closed the connection."}
          </Alert>
        </div>
      )}

      <div className="grid flex-1 gap-4 p-4 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_400px]">
        <section className="flex flex-col gap-4 lg:min-h-0">
          <div className="relative aspect-video w-full lg:aspect-auto lg:min-h-0 lg:flex-1">
            <VideoTile
              className="size-full"
              stream={rtc.remoteStream}
              label={counterpartLabel}
              placeholder={
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  {rtc.peerPresent ? (
                    <LoaderCircle className="size-9 animate-spin text-brand-300" />
                  ) : (
                    <UserRoundSearch className="size-10 text-slate-500" />
                  )}
                  <p className="text-sm font-medium">{waitingText}</p>
                </div>
              }
            />
            <div className="absolute bottom-4 right-4 w-36 sm:w-52">
              <VideoTile
                className="aspect-video rounded-2xl!"
                stream={media.stream}
                label="You"
                muted
                mirrored
                camOff={!media.camOn}
                micOff={!media.micOn}
              />
            </div>
          </div>

          {media.error && (
            <Alert
              tone="danger"
              title="Camera / microphone problem"
              action={
                <Button size="sm" variant="secondary" onClick={media.retry}>
                  Try again
                </Button>
              }
            >
              {media.error}
            </Alert>
          )}

          <ControlBar
            micOn={media.micOn}
            camOn={media.camOn}
            onToggleMic={media.toggleMic}
            onToggleCam={media.toggleCam}
            onLeave={() =>
              isLecturer ? setConfirmEnd(true) : setConfirmLeave(true)
            }
            leaveLabel={isLecturer ? "End viva" : "Leave"}
          />
        </section>

        <aside className="lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          {isLecturer ? (
            <div className="space-y-4">
              <Tabs
                active={tab}
                onChange={setTab}
                items={[
                  {
                    key: "indicators",
                    label: "Indicators",
                    icon: <Activity className="size-4" />,
                  },
                  {
                    key: "transcript",
                    label: "Transcript",
                    icon: <FileText className="size-4" />,
                    badge:
                      telemetry.transcript.length > 0 ? (
                        <Badge tone="brand">
                          {telemetry.transcript.length}
                        </Badge>
                      ) : undefined,
                  },
                ]}
              />
              {tab === "indicators" ? (
                <LiveInsightsPanel
                  ready={telemetry.ready}
                  consent={telemetry.consent}
                  metrics={telemetry.metrics}
                  history={telemetry.history}
                />
              ) : (
                <Card>
                  <CardBody className="h-[28rem] max-h-[60vh]">
                    <TranscriptFeed
                      items={telemetry.transcript.map((t) => ({
                        role: t.role,
                        start: t.start,
                        text: t.text,
                      }))}
                      emptyHint={
                        analysisOn
                          ? "Speech is transcribed a few seconds after each answer."
                          : "Transcription runs only while the student has analysis switched on."
                      }
                    />
                  </CardBody>
                </Card>
              )}
            </div>
          ) : (
            <StudentAnalysisPanel
              analysisOn={analysisOn}
              connected={telemetry.ready}
              busy={consentBusy}
              onToggle={toggleAnalysis}
              onInfo={() => setInfoOpen(true)}
            />
          )}
        </aside>
      </div>

      <TransparencyDialog
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        role={isLecturer ? "lecturer" : "student"}
      />

      <Modal
        open={confirmEnd}
        onClose={() => setConfirmEnd(false)}
        locked={ending}
        size="sm"
        title="End the viva?"
        description="This closes the room for both of you and generates the report."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmEnd(false)}
              disabled={ending}
            >
              Keep going
            </Button>
            <Button variant="danger" onClick={endViva} loading={ending}>
              {ending ? "Finalising…" : "End & generate report"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-slate-600">
          {ending
            ? "Finishing the last transcription and computing the final indicators. This can take up to a minute - please keep this tab open."
            : "The remaining speech is transcribed and the final indicators are computed. You will then be able to record your own assessment."}
        </p>
      </Modal>

      <Modal
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        size="sm"
        title="Leave the viva?"
        description="You can rejoin while your examiner keeps the session open."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmLeave(false)}>
              Stay
            </Button>
            <Button variant="danger" onClick={() => navigate("/app/dashboard")}>
              Leave
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Your camera and microphone will be switched off.
        </p>
      </Modal>

      {ended && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-scale-in rounded-3xl bg-white p-8 text-center shadow-pop">
            <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CircleCheck className="size-8" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              The viva has ended
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Thank you. Returning to your dashboard…
            </p>
            <Button
              className="mt-6"
              block
              onClick={() => navigate("/app/dashboard", { replace: true })}
            >
              Go to dashboard
            </Button>
          </div>
        </div>
      )}

      {!isLecturer && !analysisOn && telemetry.ready && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 hidden -translate-x-1/2 sm:block">
          <p className="flex items-center gap-2 rounded-full bg-slate-900/85 px-4 py-2 text-xs font-medium text-white shadow-lift backdrop-blur">
            <TriangleAlert className="size-3.5 text-amber-300" /> AI analysis is
            off - your examiner will assess you without indicators.
          </p>
        </div>
      )}
    </div>
  );
}
