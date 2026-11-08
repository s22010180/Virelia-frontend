import { useState } from 'react';
import { FileText, ShieldCheck, UserRoundCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DOES_NOT } from '@/config/compliance';

export interface ConsentChoice {
  analysis: boolean;
}

/** Student-facing, plain-language consent. Two equally prominent choices: allow, or join without analysis. */
export function ConsentPanel({
  busy,
  onChoose,
  alreadyGranted,
}: {
  busy: boolean;
  onChoose: (choice: ConsentChoice) => void;
  alreadyGranted: boolean;
}) {
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-violet-900">
          <ShieldCheck className="size-4" /> This viva can use AI-assisted analysis
        </p>
        <p className="mt-1.5 text-[13px] leading-6 text-violet-900/80">
          If you allow it, your microphone audio is analysed on the institution's server to measure how soon you answer, your speaking
          rate and pauses, and to produce a transcript of the questions and answers. The results are shown <strong>only to your examiner</strong> as supporting
          information. <strong>Your examiner makes every assessment decision.</strong>
        </p>
      </div>

      <ul className="space-y-2">
        {DOES_NOT.map((t) => (
          <li key={t} className="flex gap-2.5 text-[13px] leading-5 text-slate-600">
            <X className="mt-0.5 size-4 shrink-0 text-rose-400" /> {t}
          </li>
        ))}
      </ul>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
        <input
          type="checkbox"
          checked={understood}
          onChange={(e) => setUnderstood(e.target.checked)}
          className="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-[13px] leading-5 text-slate-600">
          I have read how my data is used (see{' '}
          <Link to="/app/transparency" target="_blank" className="font-semibold text-brand-600 underline underline-offset-2">
            Transparency &amp; Compliance
          </Link>
          ), I understand the examiner decides, and that I can switch analysis off at any time during the viva.
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          size="lg"
          disabled={!understood}
          loading={busy}
          icon={<UserRoundCheck className="size-5" />}
          onClick={() => onChoose({ analysis: true })}
        >
          {alreadyGranted ? 'Continue with analysis' : 'Allow analysis & join'}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          loading={busy}
          icon={<FileText className="size-5" />}
          onClick={() => onChoose({ analysis: false })}
        >
          Join without AI analysis
        </Button>
      </div>
      <p className="text-center text-xs text-slate-500">
        Declining is fine: your examiner will simply assess you without the indicators.
      </p>
    </div>
  );
}
