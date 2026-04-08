// ─── Choghadiya Calculation ──────────────────────────────────────────────────

// Derive UTC offset in decimal hours from an IANA timezone string (e.g. "Asia/Kolkata" → 5.5)
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
    const hours = parseInt(m[2]);
    const mins  = parseInt(m[3] ?? "0");
    return sign * (hours + mins / 60);
  } catch { return 0; }
}
// Classical Vedic time-quality system dividing day & night into 8 slots each.

export type ChoghadiyaType = "Amrit" | "Shubh" | "Labh" | "Char" | "Udveg" | "Rog" | "Kaal";

export interface ChoghadiyaSlot {
  name:      ChoghadiyaType;
  start:     string;   // formatted local time e.g. "6:08 AM"
  end:       string;
  startMin:  number;   // minutes since midnight (local)
  endMin:    number;
  quality:   "good" | "neutral" | "bad";
  icon:      string;
  meaning:   string;
  isCurrent: boolean;
}

export interface ChoghadiyaResult {
  day:   ChoghadiyaSlot[];
  night: ChoghadiyaSlot[];
  currentSlot: ChoghadiyaSlot | null;
}

// Day Choghadiya starting sequence indexed by weekday (0=Sun … 6=Sat)
const DAY_SEQ: ChoghadiyaType[][] = [
  ["Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg"],   // Sun
  ["Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit"],   // Mon
  ["Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh","Rog"],     // Tue
  ["Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char","Labh"],    // Wed
  ["Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal","Shubh"],   // Thu
  ["Char","Labh","Amrit","Kaal","Shubh","Rog","Udveg","Char"],    // Fri
  ["Kaal","Shubh","Rog","Udveg","Char","Labh","Amrit","Kaal"],    // Sat
];

// Night Choghadiya starting sequence indexed by weekday
const NIGHT_SEQ: ChoghadiyaType[][] = [
  ["Shubh","Amrit","Char","Rog","Kaal","Labh","Udveg","Shubh"],   // Sun
  ["Char","Rog","Kaal","Labh","Udveg","Shubh","Amrit","Char"],    // Mon
  ["Kaal","Labh","Udveg","Shubh","Amrit","Char","Rog","Kaal"],    // Tue
  ["Udveg","Shubh","Amrit","Char","Rog","Kaal","Labh","Udveg"],   // Wed
  ["Amrit","Char","Rog","Kaal","Labh","Udveg","Shubh","Amrit"],   // Thu
  ["Rog","Kaal","Labh","Udveg","Shubh","Amrit","Char","Rog"],     // Fri
  ["Labh","Udveg","Shubh","Amrit","Char","Rog","Kaal","Labh"],    // Sat
];

const META: Record<ChoghadiyaType, { quality: ChoghadiyaSlot["quality"]; icon: string; meaning: string }> = {
  Amrit: { quality: "good",    icon: "💧", meaning: "Nectar — excellent for all works" },
  Shubh: { quality: "good",    icon: "✨", meaning: "Auspicious — good for all new beginnings" },
  Labh:  { quality: "good",    icon: "💰", meaning: "Profit — ideal for business & finance" },
  Char:  { quality: "neutral", icon: "🚗", meaning: "Movement — favourable for travel" },
  Udveg: { quality: "bad",     icon: "😟", meaning: "Anxiety — only for government work" },
  Rog:   { quality: "bad",     icon: "🤒", meaning: "Disease — avoid important tasks" },
  Kaal:  { quality: "bad",     icon: "⏳", meaning: "Time/Death — avoid new ventures" },
};

// Parse "6:08 AM" → minutes since midnight
function parseMins(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

// Format minutes since midnight → "6:08 AM"
function fmtMins(totalMin: number): string {
  const wrapped = ((totalMin % 1440) + 1440) % 1440;
  const h24 = Math.floor(wrapped / 60);
  const m   = Math.round(wrapped % 60);
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12  = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Current time as minutes since midnight in city local time
function nowMins(utcOffsetHours: number): number {
  const n = new Date();
  const utcMs   = n.getTime() + n.getTimezoneOffset() * 60000;
  const cityMs  = utcMs + utcOffsetHours * 3600000;
  const cityNow = new Date(cityMs);
  return cityNow.getHours() * 60 + cityNow.getMinutes();
}

function buildSlots(
  names:    ChoghadiyaType[],
  startMin: number,
  slotLen:  number,
  now:      number,
  isNight:  boolean,
): ChoghadiyaSlot[] {
  return names.map((name, i) => {
    const s    = startMin + i * slotLen;
    const e    = s + slotLen;
    // For night slots that cross midnight, normalize
    const sW   = ((s % 1440) + 1440) % 1440;
    const eW   = ((e % 1440) + 1440) % 1440;
    // isCurrent: now falls within [s, e) — handle midnight crossing
    let isCurrent = false;
    if (!isNight) {
      isCurrent = now >= s && now < e;
    } else {
      // Night slots may cross midnight
      if (s % 1440 <= eW) {
        isCurrent = now >= sW && now < eW;
      } else {
        isCurrent = now >= sW || now < eW;
      }
    }
    return {
      name, quality: META[name].quality, icon: META[name].icon, meaning: META[name].meaning,
      start: fmtMins(s), end: fmtMins(e),
      startMin: sW, endMin: eW,
      isCurrent,
    };
  });
}

export function computeChoghadiya(
  date:           Date,    // the calendar date (used for weekday)
  sunriseStr:     string,  // e.g. "6:08 AM"
  sunsetStr:      string,  // e.g. "6:38 PM"
  utcOffsetHours: number = 5.5, // city UTC offset (IST default)
): ChoghadiyaResult {
  const weekday  = date.getDay(); // 0=Sun
  const rise     = parseMins(sunriseStr);
  const set      = parseMins(sunsetStr);
  const now      = nowMins(utcOffsetHours);

  // Day duration and slot length
  const dayDur   = set - rise;
  const daySlot  = dayDur / 8;

  // Night: from sunset to next sunrise (~rise + 24h)
  const nextRise = rise + 1440;
  const nightDur = nextRise - set;
  const nightSlot = nightDur / 8;

  const daySlots   = buildSlots(DAY_SEQ[weekday],   rise, daySlot,   now, false);
  const nightSlots = buildSlots(NIGHT_SEQ[weekday],  set,  nightSlot, now, true);

  const allSlots    = [...daySlots, ...nightSlots];
  const currentSlot = allSlots.find(s => s.isCurrent) ?? null;

  return { day: daySlots, night: nightSlots, currentSlot };
}
