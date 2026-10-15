import * as React from "react";
import { Badge, Button, Card, Input, Label, ProgressBar } from "./components/ui";

function num(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

type Result = {
  feePct: number;
  attendancePct: number;
  overallPct: number;
  dueMonths: number;
  advanceMonths: number;
  absentPrograms: number;
  warnings: string[];
};

export default function App() {
  const [monthsSinceCommittee, setMonthsSinceCommittee] = React.useState(0);
  const [monthsPaid, setMonthsPaid] = React.useState(0);
  const [programsTotal, setProgramsTotal] = React.useState(0);
  const [programsAttended, setProgramsAttended] = React.useState(0);

  const [result, setResult] = React.useState<Result | null>(null);

  function calculate() {
    const warnings: string[] = [];

    const mPassed = Math.max(0, Math.floor(monthsSinceCommittee));
    const mPaid = Math.max(0, Math.floor(monthsPaid));
    const pTotal = Math.max(0, Math.floor(programsTotal));
    const pAtt = Math.max(0, Math.floor(programsAttended));

    if (mPaid > mPassed) warnings.push("ফি দেয়া মাস সংখ্যাটি চলা মাসের চেয়ে বেশি (Advance)।");
    if (pAtt > pTotal) warnings.push("Attend সংখ্যা মোট Program-এর চেয়ে বেশি হতে পারে না।");

    const dueMonths = Math.max(0, mPassed - mPaid);
    const advanceMonths = Math.max(0, mPaid - mPassed);

    const feePct = mPassed > 0 ? round1(clamp((mPaid / mPassed) * 100, 0, 100)) : 0;
    const attendancePct = pTotal > 0 ? round1(clamp((pAtt / pTotal) * 100, 0, 100)) : 0;
    const overallPct = round1((feePct + attendancePct) / 2);

    const absentPrograms = Math.max(0, pTotal - pAtt);

    setResult({
      feePct,
      attendancePct,
      overallPct,
      dueMonths,
      advanceMonths,
      absentPrograms,
      warnings,
    });
  }

  function reset() {
    setMonthsSinceCommittee(0);
    setMonthsPaid(0);
    setProgramsTotal(0);
    setProgramsAttended(0);
    setResult(null);
  }

  const feeTone =
    !result
      ? ("slate" as const)
      : result.dueMonths > 0
        ? ("rose" as const)
        : ("green" as const);

  const overallTone = !result
    ? ("slate" as const)
    : result.overallPct >= 75
      ? ("green" as const)
      : result.overallPct >= 50
        ? ("amber" as const)
        : ("rose" as const);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Protty</h1>
          <p className="mt-1 text-sm text-slate-600">Monthly Fee + Program Attendance Performance Calculator</p>
        </header>

        <Card className="mt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">ইনপুট দিন</h2>
              <p className="text-sm text-slate-600">তারপর “Calculate” চাপুন</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={feeTone}>Fee</Badge>
              <Badge tone={overallTone}>Performance</Badge>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="mPassed">সর্বশেষ কমিটি হওয়ার পর কতো মাস চলেছে?</Label>
              <Input
                id="mPassed"
                type="number"
                min={0}
                step={1}
                value={monthsSinceCommittee}
                onChange={(e) => setMonthsSinceCommittee(Math.max(0, Math.floor(num(e.target.value))))}
                placeholder="যেমন: 2"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="mPaid">কয় মাসের মাসিক ফি দেয়া হয়েছে?</Label>
              <Input
                id="mPaid"
                type="number"
                min={0}
                step={1}
                value={monthsPaid}
                onChange={(e) => setMonthsPaid(Math.max(0, Math.floor(num(e.target.value))))}
                placeholder="যেমন: 2"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pTotal">কয়টা Program হয়েছে so far?</Label>
              <Input
                id="pTotal"
                type="number"
                min={0}
                step={1}
                value={programsTotal}
                onChange={(e) => setProgramsTotal(Math.max(0, Math.floor(num(e.target.value))))}
                placeholder="যেমন: 10"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pAtt">আপনি কয়টায় attend করছেন?</Label>
              <Input
                id="pAtt"
                type="number"
                min={0}
                step={1}
                value={programsAttended}
                onChange={(e) => setProgramsAttended(Math.max(0, Math.floor(num(e.target.value))))}
                placeholder="যেমন: 7"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={calculate}>Calculate Performance</Button>
            <Button type="button" variant="secondary" onClick={reset}>Reset</Button>
          </div>
        </Card>

        {result && (
          <Card className="mt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-slate-900">রেজাল্ট</h2>
              <div className="flex flex-wrap gap-2">
                {result.dueMonths > 0 ? (
                  <Badge tone="rose">Fee Due: {result.dueMonths} মাস</Badge>
                ) : result.advanceMonths > 0 ? (
                  <Badge tone="green">Fee Advance: {result.advanceMonths} মাস</Badge>
                ) : (
                  <Badge tone="green">Fee On Track</Badge>
                )}
                <Badge tone={overallTone}>Overall: {result.overallPct}%</Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Fee Performance</p>
                  <Badge tone={feeTone}>{result.feePct}%</Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={result.feePct} />
                </div>
                <p className="mt-3 text-sm text-slate-700">
                  Paid {Math.max(0, Math.floor(monthsPaid))} / {Math.max(0, Math.floor(monthsSinceCommittee))} মাস
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Attendance</p>
                  <Badge tone={result.attendancePct >= 75 ? "green" : result.attendancePct >= 50 ? "amber" : "rose"}>
                    {result.attendancePct}%
                  </Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={result.attendancePct} />
                </div>
                <p className="mt-3 text-sm text-slate-700">
                  Attend {Math.max(0, Math.floor(programsAttended))} / {Math.max(0, Math.floor(programsTotal))} (Absent {result.absentPrograms})
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Overall</p>
                  <Badge tone={overallTone}>{result.overallPct}%</Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={result.overallPct} />
                </div>
                <p className="mt-3 text-sm text-slate-700">Overall = (Fee% + Attendance%) / 2</p>
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">সতর্কতা</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
                  {result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <footer className="mt-8 text-center text-xs text-slate-500">
          Static website (GitHub Pages friendly) — কোন server লাগবে না।
        </footer>
      </div>
    </div>
  );
}
