import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, FlaskConical, MessageCircleQuestion, Printer, ScanSearch } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { InsightList } from '@/components/metrics/InsightList';
import { GradingSnapshot } from '@/components/report/GradingSnapshot';
import { PerformanceProfile } from '@/components/report/PerformanceProfile';
import { SessionConditions } from '@/components/report/SessionConditions';
import { QuestionCharts } from '@/components/report/QuestionCharts';
import { QAExchanges } from '@/components/report/QAExchanges';
import { RubricAssessment } from '@/components/report/RubricAssessment';
import { TranscriptView } from '@/components/report/TranscriptView';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { api } from '@/lib/api';
import { formatDateTime, formatDuration, formatNumber } from '@/lib/format';
import type { Assessment, Report } from '@/types/api';

function SectionTitle({ n, title, subtitle }: { n: number; title: string; subtitle: string }) {
  return (
    <div className="mb-4 mt-10 flex items-start gap-3.5 first:mt-0">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-extrabold text-white shadow-sm">{n}</span>
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
        <p className="text-[13px] leading-5 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}

export default function ReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const id = Number(sessionId);
  const { data, loading, error, setData } = useAsync<Report>(() => api.getReport(id), [id]);
  useDocumentTitle('Viva report');

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-80" />
        <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <Alert tone={error?.includes('after the session') ? 'info' : 'danger'} title="Report not available">
        {error ?? 'This report could not be loaded.'}
      </Alert>
    );
  }

  const { session, performance } = data;
  const onSaved = (a: Assessment) =>
    setData({ ...data, assessment: a, session: { ...session, lecturer_label: a.overall_mark ?? session.lecturer_label } });

  return (
    <>
      <PageHeader
        back={{ to: '/app/sessions', label: 'Sessions & Reports' }}
        title={session.title || `Viva report - ${session.student?.full_name ?? 'Student'}`}
        description={`${session.student?.full_name ?? 'Student'} · ${formatDateTime(session.ended_at ?? session.created_at)} · Duration ${formatDuration(data.duration_s)}`}
        actions={<Button variant="secondary" icon={<Printer className="size-4" />} onClick={() => window.print()}>Print / Save as PDF</Button>}
      />

      <div className="mb-8">
        <Alert tone="info" title="AI-assisted evidence - you decide the grade">{data.disclaimer}</Alert>
      </div>

      <Section>
        <SectionTitle n={1} title="Can I trust the data?" subtitle="Check the reliability of this session first, then see the viva at a glance." />
        <GradingSnapshot qa={data.qa.summary} reliability={data.reliability} />
      </Section>

      <Section>
        <SectionTitle n={2} title="Student performance profile" subtitle="Five separate indicators of how the answers went. They describe delivery and content, not knowledge or feelings." />
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
          <PerformanceProfile performance={performance} />
          <SessionConditions items={data.conditions} />
        </div>
      </Section>

      <Section>
        <SectionTitle n={3} title="Grade with evidence" subtitle="Each criterion lists the measurements that relate to it. You give the rating; the overall mark is arithmetic over your ratings." />
        <RubricAssessment key={session.id} report={data} onSaved={onSaved} />
      </Section>

      <Section>
        <SectionTitle n={4} title="Question by question" subtitle="How each answer went - open a question to read the exchange and its evidence." />
        <div className="space-y-6">
          <QuestionCharts exchanges={data.qa.exchanges} />
          <Card>
            <CardHeader title="Exchanges" subtitle="Derived from the transcript; speech recognition may contain errors" icon={<MessageCircleQuestion className="size-[18px]" />} />
            <CardBody><QAExchanges exchanges={data.qa.exchanges} /></CardBody>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionTitle n={5} title="Observations & transcript" subtitle="Plain-language notes and the full conversation." />
        <div className="space-y-6">
          <Card className="print-break">
            <CardHeader title="Observations" subtitle="Generated from the measurements" icon={<ScanSearch className="size-[18px]" />} />
            <CardBody><InsightList insights={data.insights} /></CardBody>
          </Card>
          <Card>
            <CardHeader title="Transcript" subtitle="Automatic speech recognition - may contain errors, especially for technical terms" icon={<FileText className="size-[18px]" />} />
            <CardBody><TranscriptView items={data.transcript} /></CardBody>
          </Card>
          {data.predicted_rating !== null && (
            <Card className="no-print border-dashed">
              <CardHeader title="Research estimate" icon={<FlaskConical className="size-[18px]" />} action={<Badge tone="amber">Experimental</Badge>} />
              <CardBody>
                <p className="tabular text-2xl font-extrabold text-slate-400">{formatNumber(data.predicted_rating, 0)}</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  A model trained on previous examiner marks. For research evaluation only - <strong>not for grading</strong>, and it must never be shown to students or used to decide an outcome.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </Section>
    </>
  );
}
