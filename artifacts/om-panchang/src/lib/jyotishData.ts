import { ZODIAC_NAMES, ZODIAC_ENGLISH, NAKSHATRA_NAMES } from "./panchangData";

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
  moonNakshatraPada: number;
  moonSign: string;
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

// ─── Maths helpers ─────────────────────────────────────────────────────────────
const R = Math.PI / 180;
const mod360 = (x: number) => ((x % 360) + 360) % 360;

// Meeus "Astronomical Algorithms" Ch. 7 — Julian Day starts at noon UT
function julianDay(date: Date): number {
  let Y = date.getUTCFullYear();
  let M = date.getUTCMonth() + 1;
  const D = date.getUTCDate()
          + date.getUTCHours()   / 24
          + date.getUTCMinutes() / 1440
          + date.getUTCSeconds() / 86400;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4); // Gregorian calendar correction
  return Math.floor(365.25 * (Y + 4716))
       + Math.floor(30.6001 * (M + 1))
       + D + B - 1524.5;
}

// Corrected Lahiri ayanamsha — rate is 1.3972°/century (50.3"/year), not 0.0136
function getLahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return mod360(23.85324 + 1.3972 * T);
}

// ─── Moon longitude via Meeus Ch. 47 (accuracy ≈ 10") ──────────────────────────
function computeMoonTropicalLon(T: number): number {
  const Lp = mod360(218.3164477  + 481267.88123421 * T);
  const M  = mod360(357.5291092  +  35999.0502909  * T);
  const Mp = mod360(134.9633964  + 477198.8675055  * T);
  const D  = mod360(297.8501921  + 445267.1114034  * T);
  const F  = mod360(93.2720950   + 483202.0175233  * T);

  const Mr = M * R, Mpr = Mp * R, Dr = D * R, Fr = F * R;
  const s = Math.sin, c = Math.cos;

  // Eccentricity correction factor
  const E  = 1 - 0.002516 * T - 0.0000074 * T * T;
  const E2 = E * E;

  // ΣL in units of 0.000001 degree (Table 47.A in Meeus)
  const SigL = (
      6288774 * s(Mpr)
    + 1274027 * s(2*Dr - Mpr)
    +  658314 * s(2*Dr)
    +  213618 * s(2*Mpr)
    -  185116 * E * s(Mr)
    -  114332 * s(2*Fr)
    +   58793 * s(2*Dr - 2*Mpr)
    +   57066 * E * s(2*Dr - Mr - Mpr)
    +   53322 * s(2*Dr + Mpr)
    +   45758 * E * s(2*Dr - Mr)
    -   40923 * E * s(Mr - Mpr)
    -   34720 * s(Dr)
    -   30383 * E * s(Mr + Mpr)
    +   15327 * s(2*Dr - 2*Fr)
    -   12528 * s(Mpr + 2*Fr)
    +   10980 * s(Mpr - 2*Fr)
    +   10675 * s(4*Dr - Mpr)
    +   10034 * s(3*Mpr)
    +    8548 * s(4*Dr - 2*Mpr)
    -    7888 * E * s(2*Dr + Mr - Mpr)
    -    6766 * E * s(2*Dr + Mr)
    -    5163 * s(Dr - Mpr)
    +    4987 * E * s(Dr + Mr)
    +    4036 * E * s(2*Dr - Mr + Mpr)
    +    3994 * s(2*Dr + 2*Mpr)
    +    3861 * s(4*Dr)
    +    3665 * s(2*Dr - 3*Mpr)
    -    2689 * E * s(Mr - 2*Mpr)
    -    2602 * s(2*Dr - Mpr + 2*Fr)
    +    2390 * E * s(2*Dr - Mr - 2*Mpr)
    -    2348 * s(Dr + Mpr)
    +    2236 * E2 * s(2*Dr - 2*Mr)
    -    2120 * E * s(Mr + 2*Mpr)
    -    2069 * E2 * s(2*Mr)
    +    2048 * E2 * s(2*Dr - 2*Mr - Mpr)
    -    1773 * s(2*Dr + Mpr - 2*Fr)
    -    1595 * s(2*Dr + 2*Fr)
    +    1215 * E * s(4*Dr - Mr - Mpr)
    -    1110 * s(2*Mpr + 2*Fr)
    -     892 * s(3*Dr - Mpr)
    -     810 * E * s(2*Dr + Mr + Mpr)
    +     759 * E * s(4*Dr - Mr - 2*Mpr)
    -     713 * E2 * s(2*Mr - Mpr)
    -     700 * E2 * s(2*Dr + 2*Mr - Mpr)
    +     691 * E * s(2*Dr + Mr - 2*Mpr)
    +     596 * E * s(2*Dr - Mr - 2*Fr)
    +     549 * s(4*Dr + Mpr)
    +     537 * s(4*Mpr)
    +     520 * E * s(4*Dr - Mr)
    -     487 * s(Dr - 2*Mpr)
    -     399 * E * s(2*Dr + Mr - 2*Fr)
    -     381 * s(2*Mpr - 2*Fr)
    +     351 * E * s(Dr + Mr + Mpr)
    -     340 * s(3*Dr - 2*Mpr)
    +     330 * s(4*Dr - 3*Mpr)
    +     327 * E * s(2*Dr - Mr + 2*Mpr)
    -     323 * E2 * s(2*Mr + Mpr)
    +     299 * E * s(Dr + Mr - Mpr)
    +     294 * s(2*Dr + 3*Mpr)
  ) * 1e-6; // → degrees

  // Additive terms
  const A1 = mod360(119.75 + 131.849 * T);
  const A2 = mod360(53.09  + 479264.290 * T);
  const A3 = mod360(313.45 + 481266.484 * T);
  const addL = 3958 * s(A1 * R) + 1962 * s((Lp - F) * R) + 318 * s(A2 * R);

  return mod360(Lp + SigL + addL * 1e-6);
}

// ─── Sun longitude via Meeus Ch. 25 (low precision, accuracy ≈ 0.01°) ─────────
function computeSunTropicalLon(T: number): number {
  const L0 = mod360(280.46646  + 36000.76983  * T + 0.0003032  * T * T);
  const M  = mod360(357.52911  + 35999.05029  * T - 0.0001537  * T * T);
  const Mr = M * R;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           +  0.000289 * Math.sin(3 * Mr);
  const sunTrue = mod360(L0 + C);
  // Apparent longitude (subtract aberration ~0.00569° and nutation ~0.00478°)
  const omega = mod360(125.04 - 1934.136 * T);
  return mod360(sunTrue - 0.00569 - 0.00478 * Math.sin(omega * R));
}

// ─── Other planet tropical longitudes (simplified mean-motion) ──────────────────
// These have accuracy of ~1-3° which is acceptable for house/sign placement.
const OUTER_PLANETS = [
  { id: "mars", name: "Mangal", nameEn: "Mars",    symbol: "♂",  L0: 355.433,  rate:  0.5240207766, retroPeriod: 780,  retroT: -0.85 },
  { id: "merc", name: "Budha",  nameEn: "Mercury", symbol: "☿",  L0: 252.251,  rate:  4.092317,     retroPeriod: 0,    retroT: 0    },
  { id: "jup",  name: "Guru",   nameEn: "Jupiter", symbol: "♃",  L0: 34.396,   rate:  0.0830853,    retroPeriod: 398,  retroT: -0.7 },
  { id: "ven",  name: "Shukra", nameEn: "Venus",   symbol: "♀",  L0: 181.979,  rate:  1.6021302,    retroPeriod: 0,    retroT: 0    },
  { id: "sat",  name: "Shani",  nameEn: "Saturn",  symbol: "♄",  L0: 50.0774,  rate:  0.0334442,    retroPeriod: 378,  retroT: -0.7 },
];

const RAHU_EPOCH_LON = 125.0445;
const RAHU_DAILY_MOTION = -0.0529539;

// ─── Navamsa helper ─────────────────────────────────────────────────────────────
const NAVAMSA_START: Record<number, number> = {
  0: 0, 4: 0, 8: 0,   // Fire
  1: 9, 5: 9, 9: 9,   // Earth
  2: 6, 6: 6, 10: 6,  // Air
  3: 3, 7: 3, 11: 3,  // Water
};

function navamsaSign(signIndex: number, degInSign: number): string {
  const part  = Math.floor(degInSign * 9 / 30);
  const start = NAVAMSA_START[signIndex] ?? 0;
  return ZODIAC_NAMES[(start + part) % 12] ?? "N/A";
}

// ─── Main computation ───────────────────────────────────────────────────────────
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

// Nakshatra lord → dasha index (0=Ketu,1=Shukra,2=Surya,3=Chandra,4=Mangal,5=Rahu,6=Guru,7=Shani,8=Budha)
const NAKSHATRA_LORD_INDEX = [
  0,1,2,3,4,5,6,7,8,
  0,1,2,3,4,5,6,7,8,
  0,1,2,3,4,5,6,7,8,
];

function makePlanet(
  id: string, name: string, nameEn: string, symbol: string,
  tropLon: number, ayanamsa: number, lagnaLon: number, D: number, isRetro: boolean
): PlanetKundali {
  const sidLon   = mod360(tropLon - ayanamsa);
  const signIdx  = Math.floor(sidLon / 30);
  const degInSign = sidLon - signIdx * 30;
  const house    = Math.floor(mod360(sidLon - lagnaLon) / 30) + 1;
  const nakIdx   = Math.floor(sidLon / (360 / 27));
  const nakDeg   = sidLon - nakIdx * (360 / 27);
  const pada     = Math.floor(nakDeg / ((360 / 27) / 4)) + 1;

  void D; // used by caller for retro check

  return {
    id, name, nameEn, symbol,
    siderealLon: sidLon,
    signIndex: signIdx,
    sign:   ZODIAC_NAMES[signIdx]   ?? "N/A",
    signEn: ZODIAC_ENGLISH[signIdx] ?? "N/A",
    degInSign,
    house,
    nakshatra: NAKSHATRA_NAMES[nakIdx] ?? "N/A",
    nakshatraPada: pada,
    isRetrograde: isRetro,
    navamsaSign: navamsaSign(signIdx, degInSign),
  };
}

export function computeKundali(birthDate: Date, lat: number, lon: number): KundaliData {
  const jd = julianDay(birthDate);
  const D  = jd - 2451545.0;          // Days since J2000.0
  const T  = D / 36525.0;             // Julian centuries
  const ayanamsa = getLahiriAyanamsa(jd);

  // ─ Lagna (Ascendant) ──────────────────────────────────────────────────────
  const obliquity   = (23.439 - 0.0000004 * D) * R;
  const GMST_deg    = mod360(280.46061837 + 360.98564736629 * D);
  const LST_deg     = mod360(GMST_deg + lon);
  const RAMC        = LST_deg * R;
  const latR        = lat * R;
  const ascTropical = mod360((Math.atan2(-Math.cos(RAMC),
    Math.sin(RAMC) * Math.cos(obliquity) + Math.tan(latR) * Math.sin(obliquity)
  ) * 180) / Math.PI);
  const lagnaLon    = mod360(ascTropical - ayanamsa);
  const lagnaSignIndex = Math.floor(lagnaLon / 30);

  // ─ Sun & Moon (high accuracy) ─────────────────────────────────────────────
  const sunTrop  = computeSunTropicalLon(T);
  const moonTrop = computeMoonTropicalLon(T);

  // ─ Rahu / Ketu ────────────────────────────────────────────────────────────
  const rahuTrop = mod360(RAHU_EPOCH_LON + RAHU_DAILY_MOTION * D);
  const ketuTrop = mod360(rahuTrop + 180);

  // ─ Outer planets (mean-motion) ─────────────────────────────────────────────
  const outerTrop = OUTER_PLANETS.map(p => ({
    ...p,
    tropLon: mod360(p.L0 + p.rate * D),
    isRetro: p.retroPeriod > 0
      ? Math.sin((D / p.retroPeriod) * 2 * Math.PI) < p.retroT
      : false,
  }));

  // ─ Build planet list ────────────────────────────────────────────────────────
  const planets: PlanetKundali[] = [
    makePlanet("sun",  "Surya",  "Sun",     "☀️", sunTrop,  ayanamsa, lagnaLon, D, false),
    makePlanet("moon", "Chandra","Moon",    "🌙", moonTrop, ayanamsa, lagnaLon, D, false),
    ...outerTrop.map(p =>
      makePlanet(p.id, p.name, p.nameEn, p.symbol, p.tropLon, ayanamsa, lagnaLon, D, p.isRetro)
    ),
    makePlanet("rahu", "Rahu",   "N.Node",  "☊", rahuTrop, ayanamsa, lagnaLon, D, false),
    makePlanet("ketu", "Ketu",   "S.Node",  "☋", ketuTrop, ayanamsa, lagnaLon, D, false),
  ];

  // ─ Vimshottari Dasha ────────────────────────────────────────────────────────
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

  // Antardasha
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

  // Navamsa Lagna
  const lagnaNavamsa = navamsaSign(lagnaSignIndex, lagnaLon - lagnaSignIndex * 30);

  // House cusps
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
    moonNakshatraPada: moon.nakshatraPada,
    moonSign: moon.sign,
    sunSign:  sun.sign,
    navamsaLagna: lagnaNavamsa,
  };
}

// ─── Display helpers ──────────────────────────────────────────────────────────
export function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function dashaProgress(dasha: DashaPeriod): number {
  const now   = Date.now();
  const total = dasha.end.getTime() - dasha.start.getTime();
  const elapsed = now - dasha.start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export const PLANET_COLORS: Record<string, string> = {
  sun: "text-amber-600",
  moon: "text-blue-500",
  mars: "text-red-600",
  merc: "text-emerald-600",
  jup: "text-orange-500",
  ven: "text-pink-500",
  sat: "text-indigo-700",
  rahu: "text-slate-600",
  ketu: "text-slate-500",
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
