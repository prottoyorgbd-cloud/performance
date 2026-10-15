export type AppSettings = {
  orgName: string;
  defaultCycleMonths: number;
  defaultMonthlyFee: number;
};

export type MemberRecord = {
  id: string;
  name: string;
  cycleMonths: number;
  monthlyFee: number;
  monthsPassed: number;
  monthsPaid: number;
  programsTotal: number;
  programsAttended: number;
  createdAt: number;
  updatedAt: number;
};

type PersistedStateV1 = {
  v: 1;
  settings: AppSettings;
  records: MemberRecord[];
};

const KEY = "org-committee-tracker:v1";

function safeParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const defaultSettings: AppSettings = {
  orgName: "আমাদের অর্গানাইজেশন",
  defaultCycleMonths: 3,
  defaultMonthlyFee: 0,
};

export function loadState(): PersistedStateV1 {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { v: 1, settings: defaultSettings, records: [] };

  const parsed = safeParse(raw) as PersistedStateV1 | null;
  if (!parsed || parsed.v !== 1) return { v: 1, settings: defaultSettings, records: [] };

  return {
    v: 1,
    settings: {
      ...defaultSettings,
      ...(parsed.settings ?? {}),
    },
    records: Array.isArray(parsed.records) ? parsed.records : [],
  };
}

export function saveState(state: PersistedStateV1) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
