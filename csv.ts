import type { MemberRecord } from "./storage";
import { calcAll, formatBDT } from "./calc";

function escapeCsv(value: unknown) {
  const s = String(value ?? "");
  if (/[\n\r\t",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function membersToCsv(records: MemberRecord[]) {
  const header = [
    "Name",
    "CycleMonths",
    "MonthsPassed",
    "MonthsPaid",
    "MonthlyFee",
    "ExpectedMonthsSoFar",
    "DueMonths",
    "FeePaidPct",
    "DueAmountBDT",
    "ProgramsTotal",
    "ProgramsAttended",
    "AttendancePct",
    "OverallPct",
    "UpdatedAt",
  ];

  const rows = records.map((r) => {
    const c = calcAll({
      cycleMonths: r.cycleMonths,
      monthsPassed: r.monthsPassed,
      monthsPaid: r.monthsPaid,
      monthlyFee: r.monthlyFee,
      programsTotal: r.programsTotal,
      programsAttended: r.programsAttended,
    });

    return [
      r.name,
      r.cycleMonths,
      r.monthsPassed,
      r.monthsPaid,
      r.monthlyFee,
      c.expectedMonths,
      c.dueMonths,
      c.feePaidPct,
      formatBDT(c.dueAmount),
      r.programsTotal,
      r.programsAttended,
      c.attendancePct,
      c.overallPct,
      new Date(r.updatedAt).toISOString(),
    ].map(escapeCsv);
  });

  return [header.map(escapeCsv).join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
