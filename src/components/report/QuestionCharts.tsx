import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import type { Bar } from '@/components/charts/BarChart';
import { TONE_HEX } from '@/lib/tone';
import type { QAExchange } from '@/types/api';

function snippet(text: string): string {
  return text.length > 90 ? `${text.slice(0, 87)}…` : text;
}

/** One bar per question: how soon the answer began, and how long it was. Hover a bar to see the question. */
export function QuestionCharts({ exchanges }: { exchanges: ReadonlyArray<QAExchange> }) {
  if (exchanges.length === 0) return null;

  const latency: Bar[] = exchanges.map((e) => ({
    label: `Q${e.index}`,
    value: e.answered && e.latency_s != null ? Math.round(e.latency_s * 10) / 10 : null,
    color: e.latency_s == null ? TONE_HEX.muted : e.latency_s <= 3 ? TONE_HEX.good : e.latency_s <= 6 ? TONE_HEX.warn : TONE_HEX.bad,
    title: `Q${e.index}: ${snippet(e.question)}\n${e.answered && e.latency_s != null ? `Answer began after ${e.latency_s.toFixed(1)} s` : 'No answer heard'}`,
  }));
  const length: Bar[] = exchanges.map((e) => ({
    label: `Q${e.index}`,
    value: e.answered ? e.answer_words : null,
    color: !e.answered ? TONE_HEX.muted : e.answer_words >= 15 ? TONE_HEX.neutral : TONE_HEX.warn,
    title: `Q${e.index}: ${snippet(e.question)}\n${e.answered ? `${e.answer_words} words` : 'No answer heard'}`,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="print-break">
        <CardHeader title="Time to start answering" subtitle="Seconds after each question (green ≤ 3 s, amber ≤ 6 s)" />
        <CardBody><BarChart bars={latency} unit="seconds" maxValue={Math.max(8, ...latency.map((b) => b.value ?? 0)) * 1.1} /></CardBody>
      </Card>
      <Card className="print-break">
        <CardHeader title="Answer length" subtitle="Words per answer (amber = under 15 words)" />
        <CardBody><BarChart bars={length} unit="words" /></CardBody>
      </Card>
    </div>
  );
}
