import { useState } from 'react';
import { CircleCheck, Copy, Database, Download, FlaskConical, Tags } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatCard } from '@/components/ui/StatCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';

const MIN_ROWS = 20;
const COMMAND = 'python -m scripts.train_scorer --csv data/dataset.csv';

export default function ResearchPage() {
  useDocumentTitle('Research data');
  const toast = useToast();
  const { data, loading } = useAsync(() => api.listSessions(), []);
  const [busy, setBusy] = useState(false);

  const completed = (data ?? []).filter((s) => s.status === 'COMPLETED');
  const labelled = completed.filter((s) => s.lecturer_label !== null);
  const progress = Math.min(100, (labelled.length / MIN_ROWS) * 100);

  const download = async () => {
    setBusy(true);
    try {
      await api.downloadDataset();
      toast.success('Dataset downloaded.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      toast.success('Command copied.');
    } catch {
      toast.info(COMMAND);
    }
  };

  const steps = [
    { icon: Tags, title: 'Run vivas & record your assessment', text: 'After each viva, enter your own overall mark in the report. This is the ground truth the model learns from.', done: labelled.length > 0 },
    { icon: Database, title: `Collect at least ${MIN_ROWS} labelled sessions`, text: 'More sessions from more students gives a more trustworthy model. Split evaluation by student, not by session.', done: labelled.length >= MIN_ROWS },
    { icon: Download, title: 'Export the pseudonymised dataset', text: 'Students are replaced with stable pseudo-IDs. One row per session: measured features, indicators and your mark.', done: false },
    { icon: FlaskConical, title: 'Train and evaluate', text: 'Run the training script on the backend, then restart it. Reports then show an experimental research estimate next to your own mark.', done: false },
  ];

  return (
    <>
      <PageHeader title="Research data" description="Turn your collected vivas into a validated model - the evidence your project needs to show the indicators mean something." />

      <Alert tone="warning" className="mb-6" title="Research use needs its own permission">
        Consent for the live viva analysis does not automatically cover using recordings-derived data for model training. Obtain ethics approval and
        separate research consent from participants, and keep the dataset pseudonymised and access-controlled.
      </Alert>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Completed vivas" value={completed.length} icon={<CircleCheck className="size-6" />} tone="violet" loading={loading} />
        <StatCard label="With your assessment" value={labelled.length} icon={<Tags className="size-6" />} tone="green" loading={loading} />
        <StatCard label="Minimum for training" value={MIN_ROWS} icon={<Database className="size-6" />} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader title="Workflow" subtitle="From live vivas to a trained scorer" icon={<FlaskConical className="size-[18px]" />} />
          <CardBody>
            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', s.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500')}>
                    {s.done ? <CircleCheck className="size-5" /> : <s.icon className="size-5" />}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{i + 1}. {s.title}</p>
                    <p className="mt-0.5 text-[13px] leading-6 text-slate-500">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Labelled data progress" />
            <CardBody className="space-y-3">
              <ProgressBar value={progress} barClassName={labelled.length >= MIN_ROWS ? 'bg-emerald-500' : 'bg-brand-500'} />
              <p className="text-sm text-slate-600"><strong>{labelled.length}</strong> of {MIN_ROWS} labelled sessions</p>
              <Button block icon={<Download className="size-4" />} loading={busy} onClick={download} disabled={completed.length === 0}>Download dataset (CSV)</Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Train on the backend" />
            <CardBody className="space-y-3">
              <code className="block overflow-x-auto rounded-xl bg-slate-900 p-3.5 font-mono text-xs leading-5 text-slate-100">{COMMAND}</code>
              <Button variant="secondary" block icon={<Copy className="size-4" />} onClick={copy}>Copy command</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
