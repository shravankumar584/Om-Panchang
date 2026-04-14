// ─── Hora (Planetary Hour) Calculation ───────────────────────────────────────
// Traditional Vedic / Western hora system:
// • 12 day horas  = equal divisions of sunrise → sunset
// • 12 night horas = equal divisions of sunset → next sunrise
// • First hora lord is determined by the weekday (day lord)
// • Subsequent lords follow the Chaldean order (slowest to fastest planet)

export const CHALDEAN = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"] as const;
export type Planet = typeof CHALDEAN[number];

// Starting hora lord index in CHALDEAN[] for each weekday (0=Sun … 6=Sat)
// Sun→index 3, Mon→6, Tue→2, Wed→5, Thu→1, Fri→4, Sat→0
const DAY_START_IDX = [3, 6, 2, 5, 1, 4, 0];

export interface HoraSlot {
  planet:    Planet;
  icon:      string;
  textColor: string;
  bgColor:   string;
  isDay:     boolean;
  start:     string;
  end:       string;
  startMin:  number;
  endMin:    number;
  isCurrent: boolean;
  slotNum:   number; // 1–12 within its day/night half
  domains:   string; // e.g. "Authority, fame, government"
}

export interface HoraResult {
  day:         HoraSlot[];
  night:       HoraSlot[];
  currentSlot: HoraSlot | null;
}

const PLANET_META: Record<Planet, { icon: string; textColor: string; bgColor: string; domains: string }> = {
  Sun:     { icon: "☀️",  textColor: "text-amber-700",   bgColor: "bg-amber-50  border-amber-200",   domains: "Authority, leadership, government, fame" },
  Moon:    { icon: "🌙",  textColor: "text-slate-700",   bgColor: "bg-slate-50  border-slate-200",   domains: "Emotions, home, farming, nurturing" },
  Mars:    { icon: "🔴",  textColor: "text-rose-700",    bgColor: "bg-rose-50   border-rose-200",    domains: "Courage, competition, physical work" },
  Mercury: { icon: "💚",  textColor: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200", domains: "Communication, trade, learning, writing" },
  Jupiter: { icon: "🌟",  textColor: "text-yellow-700",  bgColor: "bg-yellow-50 border-yellow-200",  domains: "Wisdom, dharma, education, blessings" },
  Venus:   { icon: "🩷",  textColor: "text-pink-700",    bgColor: "bg-pink-50   border-pink-200",    domains: "Arts, beauty, love, creativity, luxury" },
  Saturn:  { icon: "🔵",  textColor: "text-indigo-700",  bgColor: "bg-indigo-50 border-indigo-200",  domains: "Discipline, hard work, persistence" },
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

// Format minutes since midnight → "6:08 AM" (handles next-day values > 1440)
function fmtMins(totalMin: number): string {
  const wrapped = ((totalMin % 1440) + 1440) % 1440;
  const h24  = Math.floor(wrapped / 60);
  const min  = Math.round(wrapped % 60);
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12  = h24 % 12 || 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

// Current city-local time in minutes since midnight
function nowMins(utcOffsetHours: number): number {
  const n = new Date();
  const utcMs  = n.getTime() + n.getTimezoneOffset() * 60000;
  const cityMs = utcMs + utcOffsetHours * 3600000;
  const city   = new Date(cityMs);
  return city.getHours() * 60 + city.getMinutes();
}

export function computeHoraTimings(
  date:           Date,
  sunrise:        string,
  sunset:         string,
  utcOffsetHours: number,
): HoraResult {
  const srMin    = parseMins(sunrise);
  const ssMin    = parseMins(sunset);
  const weekday  = date.getDay();
  const startIdx = DAY_START_IDX[weekday];

  const dayLen      = ssMin - srMin;          // minutes from sunrise to sunset
  const nightLen    = 1440 - dayLen;          // remaining minutes (to next sunrise)
  const dayHoraLen  = dayLen  / 12;
  const nightHoraLen = nightLen / 12;

  const now = nowMins(utcOffsetHours);
  const isToday = (() => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth()    === today.getMonth()    &&
           date.getDate()     === today.getDate();
  })();

  const makeSlot = (
    i: number, isDay: boolean,
    startMin: number, horaLen: number,
  ): HoraSlot => {
    const planet  = CHALDEAN[(startIdx + (isDay ? i : i + 12)) % 7];
    const sMin    = startMin + i * horaLen;
    const eMin    = sMin + horaLen;
    const sW      = ((sMin % 1440) + 1440) % 1440;
    const eW      = ((eMin % 1440) + 1440) % 1440;
    const meta    = PLANET_META[planet];
    let isCurrent = false;
    if (isToday) {
      isCurrent = sW < eW
        ? now >= sW && now < eW
        : now >= sW || now < eW; // midnight crossing
    }
    return {
      planet, ...meta,
      isDay, slotNum: i + 1,
      start: fmtMins(sMin), end: fmtMins(eMin),
      startMin: sMin, endMin: eMin,
      isCurrent,
    };
  };

  const day   = Array.from({ length: 12 }, (_, i) => makeSlot(i, true,  srMin, dayHoraLen));
  const night = Array.from({ length: 12 }, (_, i) => makeSlot(i, false, ssMin, nightHoraLen));
  const currentSlot = [...day, ...night].find(s => s.isCurrent) ?? null;

  return { day, night, currentSlot };
}
