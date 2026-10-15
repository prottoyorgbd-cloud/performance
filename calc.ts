export type CalcInput = {
  cycleMonths: number;
  monthsPassed: number;
  monthsPaid: number;
  monthlyFee: number;
  programsTotal: number;
  programsAttended: number;
};

export type CalcResult = {
  expectedMonths: number;
  dueMonths: number;
  advanceMonths: number;
  feePaidPct: number;
  expectedAmount: number;
  paidAmount: number;
  dueAmount: number;
  attendancePct: number;
  overallPct: number;
  committeeLabel: string;
  warnings: string[];
};

function toNum(n: unknown) {
  const x = typeof n === "number" ? n : Number(n);
  return Number.isFinite(x) ? x : 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function calcAll(input: CalcInput): CalcResult {
  const warnings: string[] = [];

  const cycleMonths = Math.max(0, Math.floor(toNum(input.cycleMonths)));
  const monthsPassed = Math.max(0, Math.floor(toNum(input.monthsPassed)));
  const monthsPaid = Math.max(0, Math.floor(toNum(input.monthsPaid)));
  const monthlyFee = Math.max(0, toNum(input.monthlyFee));

  const programsTotal = Math.max(0, Math.floor(toNum(input.programsTotal)));
  const programsAttended = Math.max(0, Math.floor(toNum(input.programsAttended)));

  const expectedMonths = monthsPassed;
  const dueMonths = Math.max(0, expectedMonths - monthsPaid);
  const advanceMonths = Math.max(0, monthsPaid - expectedMonths);

  let feePaidPct = 100;
  if (expectedMonths > 0) feePaidPct = clamp((monthsPaid / expectedMonths) * 100, 0, 999);
  feePaidPct = round1(feePaidPct);

  if (monthsPaid > monthsPassed) {
    warnings.push("আপনি এখন পর্যন্ত যত মাস গেছে তার চেয়ে বেশি মাসের ফি দিয়েছেন (Advance)।");
  }

  let attendancePct = 0;
  if (programsTotal > 0) attendancePct = clamp((programsAttended / programsTotal) * 100, 0, 100);
  attendancePct = round1(attendancePct);

  if (programsAttended > programsTotal) {
    warnings.push("Present সংখ্যা মোট Program-এর চেয়ে বেশি হতে পারে না — ইনপুট চেক করুন।");
  }

  const expectedAmount = expectedMonths * monthlyFee;
  const paidAmount = monthsPaid * monthlyFee;
  const dueAmount = dueMonths * monthlyFee;

  let committeeLabel = "";
  if (cycleMonths <= 0) {
    committeeLabel = "কমিটির মেয়াদ সেট করা হয়নি";
  } else {
    const delta = cycleMonths - monthsPassed;
    if (delta > 0) committeeLabel = `${delta} মাস পরে কমিটি (মেয়াদ: ${cycleMonths} মাস)`;
    else if (delta === 0) committeeLabel = `এখনই কমিটি (মেয়াদ: ${cycleMonths} মাস)`;
    else committeeLabel = `${Math.abs(delta)} মাস ধরে কমিটি বাকি (মেয়াদ: ${cycleMonths} মাস)`;

    if (monthsPassed > cycleMonths) warnings.push("মেয়াদ শেষ হয়ে গেছে—কমিটি আপডেট করার সময় হয়েছে।");
  }

  const overallPct = round1((clamp(feePaidPct, 0, 100) + attendancePct) / 2);

  return {
    expectedMonths,
    dueMonths,
    advanceMonths,
    feePaidPct,
    expectedAmount,
    paidAmount,
    dueAmount,
    attendancePct,
    overallPct,
    committeeLabel,
    warnings,
  };
}

export function formatBDT(amount: number) {
  const n = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `৳${Math.round(n)}`;
  }
}
