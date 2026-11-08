import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AudioLines, ClipboardCheck, ShieldCheck, Waves } from 'lucide-react';
import { Logo, LogoMark } from '@/components/ui/Logo';

const POINTS = [
  { icon: ShieldCheck, title: 'Privacy-first, human-led', text: 'Student opt-in, no video recording, no emotion recognition. The examiner always decides.' },
  { icon: ClipboardCheck, title: 'Evidence-rich reports', text: 'Question-by-question evidence mapped to a rubric - ready to support the examiner’s own judgement.' },
  { icon: Waves, title: 'Live viva signals', text: 'How soon answers begin and how smoothly they are delivered, shown to the examiner as the viva happens.' },
];

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-linear-to-br from-brand-800 via-brand-700 to-violet-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 size-[28rem] rounded-full bg-violet-400/20 blur-3xl" />
        <Logo light className="relative" />
        <div className="relative max-w-lg">
          
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight">
            AI-Powered Multimodal Viva Performance Assessment Support System for <span className="text-brand-200">Software Engineering Undergraduates</span>
          </h1>
         
          <ul className="mt-10 space-y-6">
            {POINTS.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <p.icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-brand-100">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-brand-200">
          Decision-support tool. See the{' '}
          <Link to="/transparency" className="font-semibold text-white underline underline-offset-2">AI transparency &amp; compliance</Link>.
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md animate-slide-up">
          <LogoMark className="mb-6 size-11 lg:hidden" />
          <h2 className="text-[26px] font-extrabold tracking-tight text-slate-900">{title}</h2>
          <p className="mb-8 mt-1.5 text-[15px] text-slate-500">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
