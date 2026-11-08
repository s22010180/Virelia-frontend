import { Info } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { InfoTip } from '@/components/ui/InfoTip';
import { cn } from '@/lib/cn';
import type { EvidenceItem } from '@/types/api';

/** Unscored facts about the SESSION (not the student), so the examiner can read the indicators in context. */
export function SessionConditions({ items }: { items: ReadonlyArray<EvidenceItem> }) {
  if (items.length === 0) return null;
  return (
    <Card className="print-break">
      <CardHeader title="Session conditions" subtitle="Context for the indicators - facts about the session, not scores" icon={<Info className="size-[18px]" />} />
      <CardBody className="pt-2">
        <dl className="divide-y divide-slate-100">
          {items.map((it) => (
            <div key={it.key} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="flex items-center gap-1.5 text-[13px] text-slate-600">
                {it.label}
                {it.hint && <InfoTip align="left">{it.hint}</InfoTip>}
              </dt>
              <dd className={cn('tabular text-sm font-bold', it.status === 'review' ? 'text-amber-600' : 'text-slate-900')}>{it.display}</dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}
