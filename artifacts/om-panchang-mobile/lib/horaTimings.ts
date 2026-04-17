// Hora (Planetary Hour) — Hermes-safe mobile version
import { weekdayInTimezone, dateKeyInTimezone, nowMinutesInTimezone } from "./tzMath";

export const CHALDEAN = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"] as const;
export type Planet = typeof CHALDEAN[number];

const DAY_START_IDX = [3, 6, 2, 5, 1, 4, 0];

export interface HoraSlot {
  planet:    Planet;
  icon:      string;
  color:     string;   // hex
  bgColor:   string;   // hex
  isDay:     boolean;
  start:     string;
  end:       string;
  startMin:  number;
  endMin:    number;
  isCurrent: boolean;
  slotNum:   number;
  domains:   string;
}

export interface HoraResult {
  day:         HoraSlot[];
  night:       HoraSlot[];
  currentSlot: HoraSlot | null;
}

export const PLANET_META: Record<Planet, { icon: string; color: string; bgColor: string; domains: string }> = {
  Sun:     { icon: "☀️", color: "#B45309", bgColor: "#FEF3C7", domains: "Authority, leadership, government, fame" },
  Moon:    { icon: "🌙", color: "#475569", bgColor: "#F1F5F9", domains: "Emotions, home, farming, nurturing" },
  Mars:    { icon: "🔴", color: "#BE123C", bgColor: "#FFE4E6", domains: "Courage, competition, physical work" },
  Mercury: { icon: "💚", color: "#047857", bgColor: "#D1FAE5", domains: "Communication, trade, learning, writing" },
  Jupiter: { icon: "🌟", color: "#B45309", bgColor: "#FEF9C3", domains: "Wisdom, dharma, education, blessings" },
  Venus:   { icon: "🩷", color: "#BE185D", bgColor: "#FCE7F3", domains: "Arts, beauty, love, creativity, luxury" },
  Saturn:  { icon: "🔵", color: "#4338CA", bgColor: "#E0E7FF", domains: "Discipline, hard work, persistence" },
};

// (legacy nowMinsInTimezone & isSameDay replaced by tzMath helpers)

function parseMins(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function fmtMins(totalMin: number): string {
  const wrapped = ((totalMin % 1440) + 1440) % 1440;
  const h24  = Math.floor(wrapped / 60);
  const min  = Math.round(wrapped % 60);
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12  = h24 % 12 || 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

export function computeHoraTimings(
  date:     Date,
  sunrise:  string,
  sunset:   string,
  timezone: string,
): HoraResult {
  const srMin    = parseMins(sunrise);
  const ssMin    = parseMins(sunset);
  // Day lord must be derived from the city's local weekday — not the device's.
  const weekday  = weekdayInTimezone(date, timezone);
  const startIdx = DAY_START_IDX[weekday];

  const dayLen      = ssMin - srMin;
  const nightLen    = 1440 - dayLen;
  const dayHoraLen  = dayLen  / 12;
  const nightHoraLen = nightLen / 12;

  const now = nowMinutesInTimezone(timezone);
  const isToday = dateKeyInTimezone(date, timezone) === dateKeyInTimezone(new Date(), timezone);

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
        : now >= sW || now < eW;
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
