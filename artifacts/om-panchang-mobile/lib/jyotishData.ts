import { ZODIAC_NAMES, ZODIAC_ENGLISH, NAKSHATRA_NAMES } from "./panchangData";
import {
  DEG as R, mod360, julianDay, getLahiriAyanamsa,
  computeMoonTropicalLon, computeSunTropicalLon,
} from "./astronomyCore";

export interface PlanetKundali {
  id: string;
  name: string;
  nameEn: string;
  symbol: string;
  siderealLon: number;
  signIndex: number;
  sign: string;
  signEn: string;
  degInSign: number;
  house: number;
  nakshatra: string;
  nakshatraIndex: number;
  nakshatraPada: number;
  isRetrograde: boolean;
  navamsaSign: string;
}

export interface KundaliData {
  lagna: number;
  lagnaSignIndex: number;
  lagnaSign: string;
  lagnaSignEn: string;
  planets: PlanetKundali[];
  houses: number[];
  currentDasha: DashaPeriod;
  dashaBalance: number;
  upcomingDashas: DashaPeriod[];
  antar: AntarDasha[];
  moonNakshatra: string;
  moonNakshatraIndex: number;
  moonNakshatraPada: number;
  moonSign: string;
  moonSignIndex: number;
  sunSign: string;
  navamsaLagna: string;
}

export interface DashaPeriod {
  lord: string;
  lordEn: string;
  symbol: string;
  years: number;
  start: Date;
  end: Date;
}

export interface AntarDasha {
  lord: string;
  symbol: string;
  start: Date;
  end: Date;
  isCurrent: boolean;
}

const OUTER_PLANETS = [
  { id: "mars", name: "Mangal", nameEn: "Mars",    symbol: "♂",  L0: 355.433,  rate:  0.5240207766, retroPeriod: 780,  retroT: -0.85 },
  { id: "merc", name: "Budha",  nameEn: "Mercury", symbol: "☿",  L0: 252.251,  rate:  4.092317,     retroPeriod: 0,    retroT: 0    },
  { id: "jup",  name: "Guru",   nameEn: "Jupiter", symbol: "♃",  L0: 34.396,   rate:  0.0830853,    retroPeriod: 398,  retroT: -0.7 },
  { id: "ven",  name: "Shukra", nameEn: "Venus",   symbol: "♀",  L0: 181.979,  rate:  1.6021302,    retroPeriod: 0,    retroT: 0    },
  { id: "sat",  name: "Shani",  nameEn: "Saturn",  symbol: "♄",  L0: 50.0774,  rate:  0.0334442,    retroPeriod: 378,  retroT: -0.7 },
];

const RAHU_EPOCH_LON = 125.0445;
const RAHU_DAILY_MOTION = -0.0529539;

const NAVAMSA_START: Record<number, number> = {
  0:0,4:0,8:0, 1:9,5:9,9:9, 2:6,6:6,10:6, 3:3,7:3,11:3,
};

function navamsaSign(signIndex: number, degInSign: number): string {
  const part  = Math.floor(degInSign * 9 / 30);
  const start = NAVAMSA_START[signIndex] ?? 0;
  return ZODIAC_NAMES[(start + part) % 12] ?? "N/A";
}

const DASHA_ORDER = [
  { id: "ketu", name: "Ketu",    nameEn: "Ketu",    symbol: "☋",  years: 7  },
  { id: "ven",  name: "Shukra",  nameEn: "Venus",   symbol: "♀",  years: 20 },
  { id: "sun",  name: "Surya",   nameEn: "Sun",     symbol: "☀️", years: 6  },
  { id: "moon", name: "Chandra", nameEn: "Moon",    symbol: "🌙", years: 10 },
  { id: "mars", name: "Mangal",  nameEn: "Mars",    symbol: "♂",  years: 7  },
  { id: "rahu", name: "Rahu",    nameEn: "Rahu",    symbol: "☊",  years: 18 },
  { id: "jup",  name: "Guru",    nameEn: "Jupiter", symbol: "♃",  years: 16 },
  { id: "sat",  name: "Shani",   nameEn: "Saturn",  symbol: "♄",  years: 19 },
  { id: "merc", name: "Budha",   nameEn: "Mercury", symbol: "☿",  years: 17 },
];

const NAKSHATRA_LORD_INDEX = [
  0,1,2,3,4,5,6,7,8,
  0,1,2,3,4,5,6,7,8,
  0,1,2,3,4,5,6,7,8,
];

function makePlanet(
  id: string, name: string, nameEn: string, symbol: string,
  tropLon: number, ayanamsa: number, lagnaLon: number, isRetro: boolean
): PlanetKundali {
  const sidLon   = mod360(tropLon - ayanamsa);
  const signIdx  = Math.floor(sidLon / 30);
  const degInSign = sidLon - signIdx * 30;
  const house    = Math.floor(mod360(sidLon - lagnaLon) / 30) + 1;
  const nakIdx   = Math.floor(sidLon / (360 / 27));
  const nakDeg   = sidLon - nakIdx * (360 / 27);
  const pada     = Math.floor(nakDeg / ((360 / 27) / 4)) + 1;

  return {
    id, name, nameEn, symbol,
    siderealLon: sidLon,
    signIndex: signIdx,
    sign:   ZODIAC_NAMES[signIdx]   ?? "N/A",
    signEn: ZODIAC_ENGLISH[signIdx] ?? "N/A",
    degInSign,
    house,
    nakshatra: NAKSHATRA_NAMES[nakIdx] ?? "N/A",
    nakshatraIndex: nakIdx,
    nakshatraPada: pada,
    isRetrograde: isRetro,
    navamsaSign: navamsaSign(signIdx, degInSign),
  };
}

export function computeKundali(birthDate: Date, lat: number, lon: number): KundaliData {
  const jd = julianDay(birthDate);
  const D  = jd - 2451545.0;
  const T  = D / 36525.0;
  const ayanamsa = getLahiriAyanamsa(jd);

  const obliquity   = (23.439 - 0.0000004 * D) * R;
  const GMST_deg    = mod360(280.46061837 + 360.98564736629 * D);
  const LST_deg     = mod360(GMST_deg + lon);
  const RAMC        = LST_deg * R;
  const latR        = lat * R;
  const ascTropical = mod360((Math.atan2(-Math.cos(RAMC),
    Math.sin(RAMC) * Math.cos(obliquity) + Math.tan(latR) * Math.sin(obliquity)
  ) * 180) / Math.PI + 180);
  const lagnaLon    = mod360(ascTropical - ayanamsa);
  const lagnaSignIndex = Math.floor(lagnaLon / 30);

  const sunTrop  = computeSunTropicalLon(T);
  const moonTrop = computeMoonTropicalLon(T);

  const rahuTrop = mod360(RAHU_EPOCH_LON + RAHU_DAILY_MOTION * D);
  const ketuTrop = mod360(rahuTrop + 180);

  const outerTrop = OUTER_PLANETS.map(p => ({
    ...p,
    tropLon: mod360(p.L0 + p.rate * D),
    isRetro: p.retroPeriod > 0
      ? Math.sin((D / p.retroPeriod) * 2 * Math.PI) < p.retroT
      : false,
  }));

  const planets: PlanetKundali[] = [
    makePlanet("sun",  "Surya",  "Sun",     "☀️", sunTrop,  ayanamsa, lagnaLon, false),
    makePlanet("moon", "Chandra","Moon",    "🌙", moonTrop, ayanamsa, lagnaLon, false),
    ...outerTrop.map(p =>
      makePlanet(p.id, p.name, p.nameEn, p.symbol, p.tropLon, ayanamsa, lagnaLon, p.isRetro)
    ),
    makePlanet("rahu", "Rahu",   "N.Node",  "☊", rahuTrop, ayanamsa, lagnaLon, false),
    makePlanet("ketu", "Ketu",   "S.Node",  "☋", ketuTrop, ayanamsa, lagnaLon, false),
  ];

  const moon = planets.find(p => p.id === "moon")!;
  const moon_sid = moon.siderealLon;
  const moonNakIdx  = Math.floor(moon_sid / (360 / 27));
  const moonFracInNak = (moon_sid - moonNakIdx * (360 / 27)) / (360 / 27);

  const dashLordIdx  = NAKSHATRA_LORD_INDEX[moonNakIdx % 27];
  const balanceFrac  = 1 - moonFracInNak;
  const balanceYears = balanceFrac * DASHA_ORDER[dashLordIdx].years;

  const dashas: DashaPeriod[] = [];
  const elapsed = (1 - balanceFrac) * DASHA_ORDER[dashLordIdx].years;
  let cursor = new Date(birthDate.getTime() - elapsed * 365.25 * 86400000);

  for (let i = 0; i < 9; i++) {
    const dIdx = (dashLordIdx + i) % 9;
    const d    = DASHA_ORDER[dIdx];
    const start = new Date(cursor);
    const end   = new Date(cursor.getTime() + d.years * 365.25 * 86400000);
    dashas.push({ lord: d.name, lordEn: d.nameEn, symbol: d.symbol, years: d.years, start, end });
    cursor = end;
  }

  const now = new Date();
  const curIdx      = dashas.findIndex(d => now >= d.start && now < d.end);
  const currentDasha = dashas[Math.max(0, curIdx)];

  const antar: AntarDasha[] = [];
  if (currentDasha) {
    const mahaDurMs = currentDasha.years * 365.25 * 86400000;
    let anterCursor = new Date(currentDasha.start);
    const mIdx = dashas.indexOf(currentDasha);
    const mahaDashLordIdx = (dashLordIdx + mIdx) % 9;

    for (let i = 0; i < 9; i++) {
      const aIdx = (mahaDashLordIdx + i) % 9;
      const ad   = DASHA_ORDER[aIdx];
      const adDur = (ad.years / 120) * mahaDurMs;
      const aStart = new Date(anterCursor);
      const aEnd   = new Date(anterCursor.getTime() + adDur);
      antar.push({ lord: ad.name, symbol: ad.symbol, start: aStart, end: aEnd,
                   isCurrent: now >= aStart && now < aEnd });
      anterCursor = aEnd;
    }
  }

  const lagnaNavamsa = navamsaSign(lagnaSignIndex, lagnaLon - lagnaSignIndex * 30);
  const houses = Array.from({ length: 12 }, (_, i) => mod360(lagnaLon + i * 30));
  const sun = planets.find(p => p.id === "sun")!;

  return {
    lagna: lagnaLon,
    lagnaSignIndex,
    lagnaSign:   ZODIAC_NAMES[lagnaSignIndex]   ?? "N/A",
    lagnaSignEn: ZODIAC_ENGLISH[lagnaSignIndex] ?? "N/A",
    planets,
    houses,
    currentDasha,
    dashaBalance: balanceYears,
    upcomingDashas: dashas,
    antar,
    moonNakshatra:    moon.nakshatra,
    moonNakshatraIndex: moon.nakshatraIndex,
    moonNakshatraPada: moon.nakshatraPada,
    moonSign: moon.sign,
    moonSignIndex: moon.signIndex,
    sunSign:  sun.sign,
    navamsaLagna: lagnaNavamsa,
  };
}

export function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

export function formatDate(d: Date): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function dashaProgress(dasha: DashaPeriod): number {
  const now   = Date.now();
  const total = dasha.end.getTime() - dasha.start.getTime();
  const elapsed = now - dasha.start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export const PLANET_COLOR: Record<string, string> = {
  sun: "#D97706", moon: "#3B82F6", mars: "#DC2626", merc: "#059669",
  jup: "#F97316", ven: "#EC4899", sat: "#4338CA", rahu: "#475569", ketu: "#64748B",
};

export const LAGNA_INTERPRETATIONS: Record<string, { title: string; body: string }> = {
  Mesha:     { title: "Mesha Lagna — The Pioneer",     body: "Bold, energetic, and action-first. You lead with courage and thrive on new beginnings. Mars gives you a sharp, competitive nature and strong physical vitality." },
  Vrishabha: { title: "Vrishabha Lagna — The Builder",  body: "Steady, sensual, and material-minded. Venus blesses you with beauty, comfort-seeking, and a remarkable capacity to create lasting wealth and stable relationships." },
  Mithuna:   { title: "Mithuna Lagna — The Communicator", body: "Witty, curious, and adaptable. Mercury makes you a natural networker and thinker, skilled with words and ideas. You see all sides of every situation." },
  Karka:     { title: "Karka Lagna — The Nurturer",    body: "Deeply empathetic, protective, and home-loving. The Moon gives you powerful intuition and emotional sensitivity, with a strong attachment to family and the past." },
  Simha:     { title: "Simha Lagna — The Sovereign",   body: "Regal, generous, and charismatic. The Sun gives you natural authority and a love of being centre stage. You are warm-hearted, creative, and born to lead." },
  Kanya:     { title: "Kanya Lagna — The Analyst",     body: "Discerning, service-minded, and precise. Mercury gifts you analytical brilliance. You notice every detail and excel in fields requiring accuracy — medicine, writing, research." },
  Tula:      { title: "Tula Lagna — The Diplomat",     body: "Balanced, charming, and relationship-oriented. Venus makes you graceful and fair-minded. You are drawn to beauty, justice, and harmonious partnerships." },
  Vrishchika:{ title: "Vrishchika Lagna — The Transformer", body: "Intense, perceptive, and psychologically deep. Mars gives penetrating insight and a magnetic personality. You are drawn to hidden truths and profound transformation." },
  Dhanu:     { title: "Dhanu Lagna — The Philosopher", body: "Optimistic, truth-seeking, and freedom-loving. Jupiter expands your horizons through philosophy, travel, and higher learning. You are the eternal student and teacher." },
  Makara:    { title: "Makara Lagna — The Achiever",   body: "Disciplined, ambitious, and patient. Saturn rewards your slow, steady climb with lasting success. You build structures that endure and earn respect through sheer perseverance." },
  Kumbha:    { title: "Kumbha Lagna — The Visionary",  body: "Unconventional, humanitarian, and intellectually independent. Saturn and your fixed nature make you a reformer who works for the collective good." },
  Meena:     { title: "Meena Lagna — The Dreamer",     body: "Compassionate, imaginative, and spiritually inclined. Jupiter dissolves boundaries and deepens empathy. You bridge the material and spiritual worlds with grace." },
};
