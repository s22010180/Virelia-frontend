import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Check, Mail, Scale, ScrollText, ShieldAlert, X } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Card, CardBody } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { ALIGNMENT, DATA_PRACTICES, DOES_NOT, LIMITATIONS } from '@/config/compliance';
import { APP_NAME, DPO_EMAIL } from '@/config/env';
import { METRICS, PERFORMANCE_ORDER } from '@/config/metrics';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

export default function TransparencyPage() {
  useDocumentTitle('Transparency & compliance');
  return (
    <div className="space-y-9">
      <PageHeader
        title="AI transparency & compliance"
        description={`How this system uses AI, what it does not do, who decides, and your rights.`}
      />

      <Alert tone="info" title="Summary">
        This system supports an examiner during an online viva by showing objective measures of the student's answers (response timing, speaking rate,
        answer length and technical vocabulary). <strong>The examiner makes every assessment decision.</strong> Using AI analysis is optional for the student.
      </Alert>

      <Section id="purpose" title="1. Intended purpose">
        <p className="text-[15px] leading-7 text-slate-600">
          Decision support for examiners in software-engineering viva examinations: it surfaces interaction indicators and a transcript so that
          the examiner can document and reflect on the conversation. It is not designed to grade, rank, admit, proctor or detect misconduct, and
          its output must not be the sole basis of any decision about a student.
        </p>
      </Section>

      <Section id="not" title="2. What it does not do">
        <ul className="space-y-2.5">
          {DOES_NOT.map((t) => (
            <li key={t} className="flex gap-3 text-[15px] text-slate-600"><X className="mt-1 size-4 shrink-0 text-rose-500" /> {t}</li>
          ))}
        </ul>
      </Section>

      <Section id="data" title="3. Data we process">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Data</th><th className="px-5 py-3">Where it is processed</th><th className="px-5 py-3">Purpose</th><th className="px-5 py-3">Stored?</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 align-top">
                {DATA_PRACTICES.map((d) => (
                  <tr key={d.data}>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{d.data}</td>
                    <td className="px-5 py-3.5 text-slate-600">{d.where}</td>
                    <td className="px-5 py-3.5 text-slate-600">{d.purpose}</td>
                    <td className="px-5 py-3.5 text-slate-600">{d.stored}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      <Section id="indicators" title="4. What the indicators mean">
        <div className="grid gap-3 md:grid-cols-2">
          {PERFORMANCE_ORDER.map((k) => {
            const m = METRICS[k];
            return (
              <Card key={k}>
                <CardBody>
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><m.icon className="size-4" style={{ color: m.color }} /> {m.label}</p>
                  <p className="mt-1.5 text-[13px] leading-6 text-slate-600">{m.basis}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section id="oversight" title="5. Human oversight">
        <ul className="space-y-2.5 text-[15px] text-slate-600">
          {[
            'Indicators are advisory. The examiner may ignore any or all of them.',
            'The examiner records their own assessment separately; no AI output is converted into a mark.',
            'If analysis is off, the viva proceeds without indicators and the student is assessed normally.',
            'Examiners should disregard indicators where accent, language, disability, noise or network quality may have affected them.',
          ].map((t) => (
            <li key={t} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-emerald-500" /> {t}</li>
          ))}
        </ul>
      </Section>

      <Section id="limits" title="6. Known limitations">
        <ul className="space-y-2.5 text-[15px] text-slate-600">
          {LIMITATIONS.map((t) => (
            <li key={t} className="flex gap-3"><ShieldAlert className="mt-1 size-4 shrink-0 text-amber-500" /> {t}</li>
          ))}
        </ul>
      </Section>

      <Section id="rights" title="7. Your rights">
        <p className="text-[15px] leading-7 text-slate-600">
          You may withdraw from AI analysis at any time (in the lobby or during the viva), and ask the institution for access to, correction
          of, or deletion of your data, and for human-only assessment. You may also complain to your data-protection authority.
        </p>
        <a href={`mailto:${DPO_EMAIL}`} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-slate-50">
          <Mail className="size-4" /> {DPO_EMAIL}
        </a>
      </Section>

      <Section id="regulation" title="8. Regulatory alignment (design level)">
        <Alert tone="warning" className="mb-4" title="Not legal advice">
          This page describes design measures taken to support compliance. It is not a statement of legal conformity. Final classification,
          obligations and lawful basis must be confirmed by the institution (DPO / legal counsel).
        </Alert>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Topic</th><th className="px-5 py-3">How the product addresses it</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 align-top">
                {ALIGNMENT.map((r) => (
                  <tr key={r.ref}>
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-slate-900"><Scale className="mr-1.5 inline size-3.5 text-slate-400" />{r.ref}</td>
                    <td className="px-5 py-3.5 text-slate-700">{r.topic}</td>
                    <td className="px-5 py-3.5 text-slate-600">{r.measure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

       
      </Section>

      <p className="text-center text-xs text-slate-400">
        Questions? Contact {DPO_EMAIL}. · <Link to="/login" className="font-semibold underline-offset-2 hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
