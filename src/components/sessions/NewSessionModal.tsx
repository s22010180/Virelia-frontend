import { useEffect, useMemo, useState } from 'react';
import { Search, UserRoundX } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { User, VivaSession } from '@/types/api';

export function NewSessionModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (session: VivaSession) => void;
}) {
  const toast = useToast();
  const [students, setStudents] = useState<User[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [studentId, setStudentId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setStudents(null);
    setLoadError(null);
    setStudentId(null);
    setQuery('');
    setTitle('');
    setFormError(null);
    api
      .students()
      .then((s) => active && setStudents(s))
      .catch((e: unknown) => active && setLoadError(e instanceof Error ? e.message : 'Could not load students'));
    return () => {
      active = false;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (students ?? []).filter((s) => !q || s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }, [students, query]);

  const submit = async () => {
    if (studentId === null) {
      setFormError('Choose a student first.');
      return;
    }
    setBusy(true);
    setFormError(null);
    try {
      const session = await api.createSession(studentId, title.trim());
      toast.success('Viva session created.');
      onCreated(session);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not create the session.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={busy}
      title="Start a new viva"
      description="Pick the student being examined. They will see the session on their dashboard."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} loading={busy} disabled={studentId === null}>Create session</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Session title (optional)"
          placeholder="e.g. Final Year Project Viva - Group 7"
          value={title}
          maxLength={150}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <p className="mb-1.5 text-[13px] font-semibold text-slate-700">Student</p>
          <Input
            aria-label="Search students"
            placeholder="Search by name or email"
            leftIcon={<Search className="size-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-2.5 max-h-64 overflow-y-auto rounded-xl border border-slate-200">
            {students === null && !loadError && (
              <div className="grid place-items-center py-10"><Spinner /></div>
            )}
            {loadError && <div className="p-3"><Alert tone="danger" title="Could not load students">{loadError}</Alert></div>}
            {students !== null && filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-9 text-sm text-slate-500">
                <UserRoundX className="size-6 text-slate-300" />
                {students.length === 0 ? 'No students have registered yet.' : 'No students match your search.'}
              </div>
            )}
            {filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStudentId(s.id)}
                className={cn(
                  'flex w-full items-center gap-3 border-b border-slate-100 px-3.5 py-3 text-left transition last:border-0',
                  studentId === s.id ? 'bg-brand-50' : 'hover:bg-slate-50',
                )}
              >
                <Avatar name={s.full_name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{s.full_name}</span>
                  <span className="block truncate text-xs text-slate-500">{s.email}</span>
                </span>
                <span className={cn('size-4 rounded-full border-2 transition', studentId === s.id ? 'border-brand-600 bg-brand-600 ring-2 ring-brand-200 ring-offset-1' : 'border-slate-300')} />
              </button>
            ))}
          </div>
        </div>
        {formError && <Alert tone="danger">{formError}</Alert>}
      </div>
    </Modal>
  );
}
