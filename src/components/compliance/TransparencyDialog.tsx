import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DOES_NOT } from '@/config/compliance';

export function TransparencyDialog({ open, onClose, role }: { open: boolean; onClose: () => void; role: 'lecturer' | 'student' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="How AI is used in this viva"
      description="A short summary. The full explanation, your rights and limitations are on the Transparency page."
      footer={
        <>
          <Link to="/app/transparency" target="_blank">
            <Button variant="secondary">Read the full notice</Button>
          </Link>
          <Button onClick={onClose}>Close</Button>
        </>
      }
    >
      <div className="space-y-4 text-sm leading-6 text-slate-600">
        <p className="flex gap-2.5">
          <Check className="mt-1 size-4 shrink-0 text-emerald-500" />
          {role === 'student'
            ? 'While analysis is ON, your microphone audio is analysed on the institution’s server for timing and speech measures and a transcript. Only your examiner sees the results.'
            : 'While analysis is ON, both microphones are analysed on the institution’s server for timing and speech measures and a transcript. Only you see the results.'}
        </p>
        <p className="flex gap-2.5">
          <Check className="mt-1 size-4 shrink-0 text-emerald-500" />
          The examiner makes every assessment decision. The indicators are supporting information only and can be wrong.
        </p>
        <p className="flex gap-2.5">
          <Check className="mt-1 size-4 shrink-0 text-emerald-500" />
          The student can switch analysis off at any time, and the viva continues normally.
        </p>
        <ul className="space-y-1.5 border-t border-slate-100 pt-4">
          {DOES_NOT.map((t) => (
            <li key={t} className="flex gap-2.5">
              <X className="mt-1 size-4 shrink-0 text-rose-400" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
