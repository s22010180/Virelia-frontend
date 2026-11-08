import { Badge } from '@/components/ui/Badge';
import type { SessionStatus } from '@/types/api';

export function StatusBadge({ status }: { status: SessionStatus }) {
  return status === 'ACTIVE' ? (
    <Badge tone="green" dot>Live / open</Badge>
  ) : (
    <Badge tone="slate">Completed</Badge>
  );
}
