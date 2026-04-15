export function getUtcOffsetHours(timezone: string): number {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone, timeZoneName: "shortOffset",
    }).formatToParts(now);
    const tzStr = parts.find(p => p.type === "timeZoneName")?.value ?? "";
    const m = tzStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!m) return 0;
    const sign = m[1] === "+" ? 1 : -1;
    const hours = parseInt(m[2] ?? "0");
    const mins  = parseInt(m[3] ?? "0");
    return sign * (hours + mins / 60);
  } catch { return 0; }
}

export type ChoghadiyaType = "Amrit" | "Shubh" | "Labh" | "Char" | "Udveg" | "Rog" | "Kaal";

export interface ChoghadiyaSlot {
  name:      ChoghadiyaType;
  start:     string;
  end:       string;
  startMin:  number;
  endMin:    number;
  quality:   "good" | "neutral" | "bad";
  meaning:   string;
  isCurrent: boolean;
}

export interface ChoghadiyaResult {
  day:   ChoghadiyaSlot[];
  night: ChoghadiyaSlot[];
  currentSlot: ChoghadiyaSlot | null;
}

const DAY_SEQ: ChoghadiyaType[][] = [
  ["Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg"],
  ["Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit"],
  ["Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog"],
  ["Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh"],
  ["Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh"],
  ["Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char"],
  ["Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal"],
];

const NIGHT_SEQ: ChoghadiyaType[][] = [
  ["Shubh","Amrit","Char","Rog","Kaal","Labh","Udveg","Shubh"],
  ["Char","Rog","Kaal","Labh","Udveg","Shubh","Amrit","Char"],
  ["Kaal","Labh","Udveg","Shubh","Amrit","Char","Rog","Kaal"],
  ["Udveg","Shubh","Amrit","Char","Rog","Kaal","Labh","Udveg"],
  ["Amrit","Char","Rog","Kaal","Labh","Udveg","Shubh","Amrit"],
  ["Rog","Kaal","Labh","Udveg","Shubh","Amrit","Char","Rog"],
  ["Labh","Udveg","Shubh","Amrit","Char","Rog","Kaal","Labh"],
];

const META: Record<ChoghadiyaType, { quality: ChoghadiyaSlot["quality"]; meaning: string }> = {
  Amrit: { quality: "good",    meaning: "Nectar — excellent for all works" },
  Shubh: { quality: "good",    meaning: "Auspicious — good for new beginnings" },
  Labh:  { quality: "good",    meaning: "Profit — ideal for business & finance" },
  Char:  { quality: "neutral", meaning: "Movement — favourable for travel" },
  Udveg: { quality: "bad",     meaning: "Anxiety — only for government work" },
  Rog:   { quality: "bad",     meaning: "Disease — avoid important tasks" },
  Kaal:  { quality: "bad",     meaning: "Time — avoid new ventures" },
};

function parseMins(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1] ?? "0");
  const min = parseInt(m[2] ?? "0");
  const ampm = (m[3] ?? "AM").toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function fmtMins(totalMin: number): string {
  const wrapped = ((totalMin % 1440) + 1440) % 1440;
  const h24 = Math.floor(wrapped / 60);
  const m   = Math.round(wrapped % 60);
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12  = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function nowMins(utcOffsetHours: number): number {
  const n = new Date();
  const utcMs   = n.getTime() + n.getTimezoneOffset() * 60000;
  const cityMs  = utcMs + utcOffsetHours * 3600000;
  const cityNow = new Date(cityMs);
  return cityNow.getHours() * 60 + cityNow.getMinutes();
}

function buildSlots(names: ChoghadiyaType[], startMin: number, slotLen: number, now: number, isNight: boolean): ChoghadiyaSlot[] {
  return names.map((name, i) => {
    const s = startMin + i * slotLen;
    const e = s + slotLen;
    const sW = ((s % 1440) + 1440) % 1440;
    const eW = ((e % 1440) + 1440) % 1440;
    let isCurrent = false;
    if (!isNight) {
      isCurrent = now >= s && now < e;
    } else {
      if (s % 1440 <= eW) { isCurrent = now >= sW && now < eW; }
      else { isCurrent = now >= sW || now < eW; }
    }
    return { name, quality: META[name].quality, meaning: META[name].meaning, start: fmtMins(s), end: fmtMins(e), startMin: sW, endMin: eW, isCurrent };
  });
}

export function computeChoghadiya(date: Date, sunriseStr: string, sunsetStr: string, utcOffsetHours = 5.5): ChoghadiyaResult {
  const weekday  = date.getDay();
  const rise     = parseMins(sunriseStr);
  const set      = parseMins(sunsetStr);
  const now      = nowMins(utcOffsetHours);
  const dayDur   = set - rise;
  const daySlot  = dayDur / 8;
  const nextRise = rise + 1440;
  const nightDur = nextRise - set;
  const nightSlot = nightDur / 8;
  const daySlots   = buildSlots(DAY_SEQ[weekday] ?? DAY_SEQ[0]!,   rise, daySlot,   now, false);
  const nightSlots = buildSlots(NIGHT_SEQ[weekday] ?? NIGHT_SEQ[0]!, set,  nightSlot, now, true);
  const allSlots    = [...daySlots, ...nightSlots];
  const currentSlot = allSlots.find(s => s.isCurrent) ?? null;
  return { day: daySlots, night: nightSlots, currentSlot };
}
