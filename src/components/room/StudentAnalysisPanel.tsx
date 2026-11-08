import { HelpCircle, ShieldCheck } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function StudentAnalysisPanel({
  analysisOn,
  connected,
  busy,
  onToggle,
  onInfo,
}: {
  analysisOn: boolean;
  connected: boolean;
  busy: boolean;
  onToggle: (next: boolean) => void;
  onInfo: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="AI-assisted analysis" subtitle="You are in control" icon={<ShieldCheck className="size-[18px]" />} />
        <CardBody className="space-y-4">
          <div className={cn('flex items-center justify-between gap-4 rounded-2xl p-4 transition-colors', analysisOn ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-100')}>
            <div>
              <p className="text-sm font-bold text-slate-900">{analysisOn ? 'Analysis is ON' : 'Analysis is OFF'}</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-600">
                {analysisOn ? 'Your microphone audio is being analysed for your examiner.' : 'No audio is analysed. The viva continues normally.'}
              </p>
            </div>
            <Switch checked={analysisOn} onChange={onToggle} label="Toggle AI-assisted analysis" disabled={busy || !connected} />
          </div>

          <ul className="space-y-2 text-[13px] leading-5 text-slate-600">
            <li>• Only your examiner sees the results, and <strong>they make every decision</strong>.</li>
            <li>• No video or raw audio is recorded.</li>
            <li>• You can change this at any moment.</li>
          </ul>

          <Button variant="secondary" block icon={<HelpCircle className="size-4" />} onClick={onInfo}>How is my data used?</Button>
        </CardBody>
      </Card>
    </div>
  );
}
