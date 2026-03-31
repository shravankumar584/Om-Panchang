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

const PLANET_DATA_JYOTISH = [
  { id: "sun",  name: "Surya",  nameEn: "Sun",     symbol: "☀️", epochLon: 280.460, dailyMotion: 0.9856474,    retroThreshold: null },
  { id: "moon", name: "Chandra",nameEn: "Moon",    symbol: "🌙", epochLon: 218.316, dailyMotion: 13.176396,    retroThreshold: null },
  { id: "mars", name: "Mangal", nameEn: "Mars",    symbol: "♂",  epochLon: 355.433, dailyMotion: 0.5240207766, retroThreshold: { period: 780, threshold: -0.85 } },
  { id: "merc", name: "Budha",  nameEn: "Mercury", symbol: "☿",  epochLon: 252.251, dailyMotion: 4.092317,     retroThreshold: null },
  { id: "jup",  name: "Guru",   nameEn: "Jupiter", symbol: "♃",  epochLon: 34.396,  dailyMotion: 0.0830853,    retroThreshold: { period: 398, threshold: -0.7 } },
  { id: "ven",  name: "Shukra", nameEn: "Venus",   symbol: "♀",  epochLon: 181.979, dailyMotion: 1.6021302,    retroThreshold: null },
  { id: "sat",  name: "Shani",  nameEn: "Saturn",  symbol: "♄",  epochLon: 50.0774, dailyMotion: 0.0334442,    retroThreshold: { period: 378, threshold: -0.7 } },
  { id: "rahu", name: "Rahu",   nameEn: "N.Node",  symbol: "☊",  epochLon: 125.0445,dailyMotion: -0.0529539,   retroThreshold: null },
  { id: "ketu", name: "Ketu",   nameEn: "S.Node",  symbol: "☋",  epochLon: 305.0445,dailyMotion: -0.0529539,   retroThreshold: null },
];

const DASHA_ORDER = [
  { id: "ketu", name: "Ketu",   nameEn: "Ketu",    symbol: "☋",  years: 7  },
  { id: "ven",  name: "Shukra", nameEn: "Venus",   symbol: "♀",  years: 20 },
  { id: "sun",  name: "Surya",  nameEn: "Sun",     symbol: "☀️", years: 6  },
  { id: "moon", name: "Chandra",nameEn: "Moon",    symbol: "🌙", years: 10 },
  { id: "mars", name: "Mangal", nameEn: "Mars",    symbol: "♂",  years: 7  },
  { id: "rahu", name: "Rahu",   nameEn: "Rahu",    symbol: "☊",  years: 18 },
  { id: "jup",  name: "Guru",   nameEn: "Jupiter", symbol: "♃",  years: 16 },
  { id: "sat",  name: "Shani",  nameEn: "Saturn",  symbol: "♄",  years: 19 },
  { id: "merc", name: "Budha",  nameEn: "Mercury", symbol: "☿",  years: 17 },
];

// Which dasha lord rules each nakshatra (0-indexed, 27 nakshatras)
// Ketu=0, Venus=1, Sun=2, Moon=3, Mars=4, Rahu=5, Jupiter=6, Saturn=7, Mercury=8
const NAKSHATRA_LORD_INDEX = [
  0,1,2,3,4,5,6,7,8, // Ashwini..Ashlesha
  0,1,2,3,4,5,6,7,8, // Magha..Jyeshtha
  0,1,2,3,4,5,6,7,8  // Mula..Revati
];

const NAVAMSA_START: Record<number, number> = {
  0:0, 4:0, 8:0,   // Fire (Mesha, Simha, Dhanu) -> start Mesha(0)
  1:9, 5:9, 9:9,   // Earth (Vrishabha, Kanya, Makara) -> start Makara(9)
  2:6, 6:6, 10:6,  // Air (Mithuna, Tula, Kumbha) -> start Tula(6)
  3:3, 7:3, 11:3,  // Water (Karka, Vrishchika, Meena) -> start Karka(3)
};

function julianDay(date: Date): number {
  const Y = date.getUTCFullYear();
  const M = date.getUTCMonth() + 1;
  const D = date.getUTCDate() + date.getUTCHours()/24 + date.getUTCMinutes()/1440;
  const A = Math.floor((14 - M) / 12);
  const y = Y + 4800 - A;
  const m = M + 12 * A - 3;
  return D + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
}

function getLahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + 0.0136 * T;
}

function computeNavamsaSign(signIndex: number, degInSign: number): string {
  const navPart = Math.floor(degInSign * 9 / 30);
  const startSign = NAVAMSA_START[signIndex] ?? 0;
  const navSign = (startSign + navPart) % 12;
  return ZODIAC_NAMES[navSign] ?? "N/A";
}

export function computeKundali(birthDate: Date, lat: number, lon: number): KundaliData {
  const jd = julianDay(birthDate);
  const D = jd - 2451545.0;
  const ayanamsa = getLahiriAyanamsa(jd);
  const obliquityDeg = 23.439 - 0.0000004 * D;
  const obliquity = obliquityDeg * Math.PI / 180;

  // --- Lagna (Ascendant) ---
  const GMST_deg = ((280.46061837 + 360.98564736629 * D) % 360 + 360) % 360;
  const LST_deg = ((GMST_deg + lon) % 360 + 360) % 360;
  const RAMC = LST_deg * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const y = -Math.cos(RAMC);
  const x = Math.sin(RAMC) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity);
  let ascTropical = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  const lagnaLon = ((ascTropical - ayanamsa) % 360 + 360) % 360;
  const lagnaSignIndex = Math.floor(lagnaLon / 30);

  // --- Planets ---
  const planets: PlanetKundali[] = PLANET_DATA_JYOTISH.map(p => {
    const tropLon = ((p.epochLon + p.dailyMotion * D) % 360 + 360) % 360;
    const sidLon = ((tropLon - ayanamsa) % 360 + 360) % 360;
    const signIdx = Math.floor(sidLon / 30);
    const degInSign = sidLon - signIdx * 30;
    const house = Math.floor(((sidLon - lagnaLon + 360) % 360) / 30) + 1;
    const nakshatraIdx = Math.floor(sidLon / (360/27));
    const nakshatraDeg = sidLon - nakshatraIdx * (360/27);
    const pada = Math.floor(nakshatraDeg / ((360/27)/4)) + 1;

    let isRetrograde = false;
    if (p.retroThreshold) {
      isRetrograde = Math.sin((D / p.retroThreshold.period) * 2 * Math.PI) < p.retroThreshold.threshold;
    }

    return {
      id: p.id,
      name: p.name,
      nameEn: p.nameEn,
      symbol: p.symbol,
      siderealLon: sidLon,
      signIndex: signIdx,
      sign: ZODIAC_NAMES[signIdx] ?? "N/A",
      signEn: ZODIAC_ENGLISH[signIdx] ?? "N/A",
      degInSign,
      house,
      nakshatra: NAKSHATRA_NAMES[nakshatraIdx] ?? "N/A",
      nakshatraPada: pada,
      isRetrograde,
      navamsaSign: computeNavamsaSign(signIdx, degInSign),
    };
  });

  const moon = planets.find(p => p.id === "moon")!;
  const sun  = planets.find(p => p.id === "sun")!;
  const moonNakshatraIdx = Math.floor(moon.siderealLon / (360/27));
  const moonFracInNak = (moon.siderealLon - moonNakshatraIdx * (360/27)) / (360/27);

  // --- Vimshottari Dasha ---
  const dashLordIdx = NAKSHATRA_LORD_INDEX[moonNakshatraIdx % 27];
  const balanceFraction = 1 - moonFracInNak;
  const balanceYears = balanceFraction * DASHA_ORDER[dashLordIdx].years;

  const dashas: DashaPeriod[] = [];
  let cursor = new Date(birthDate.getTime());
  // Subtract balance already elapsed (birth is mid-dasha)
  const elapsed = (1 - balanceFraction) * DASHA_ORDER[dashLordIdx].years;
  cursor = new Date(cursor.getTime() - elapsed * 365.25 * 86400000);

  for (let i = 0; i < 9; i++) {
    const dIdx = (dashLordIdx + i) % 9;
    const d = DASHA_ORDER[dIdx];
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + d.years * 365.25 * 86400000);
    dashas.push({ lord: d.name, lordEn: d.nameEn, symbol: d.symbol, years: d.years, start, end });
    cursor = end;
  }

  const now = new Date();
  const currentDashaIdx = dashas.findIndex(d => now >= d.start && now < d.end);
  const currentDasha = dashas[Math.max(0, currentDashaIdx)];

  // Antardasha (sub-periods of current Mahadasha)
  const antar: AntarDasha[] = [];
  if (currentDasha) {
    const mahaDur = currentDasha.years * 365.25 * 86400000;
    let anterCursor = new Date(currentDasha.start);
    const startDIdx = dashas.indexOf(currentDasha);
    const mahaDashLordIdx = (dashLordIdx + startDIdx) % 9;

    for (let i = 0; i < 9; i++) {
      const aIdx = (mahaDashLordIdx + i) % 9;
      const ad = DASHA_ORDER[aIdx];
      const adDur = (ad.years / 120) * mahaDur;
      const aStart = new Date(anterCursor);
      const aEnd = new Date(anterCursor.getTime() + adDur);
      antar.push({
        lord: ad.name,
        symbol: ad.symbol,
        start: aStart,
        end: aEnd,
        isCurrent: now >= aStart && now < aEnd,
      });
      anterCursor = aEnd;
    }
  }

  // Navamsa Lagna
  const navamsaLagna = computeNavamsaSign(lagnaSignIndex, lagnaLon - lagnaSignIndex * 30);

  // Houses (equal house): house cusp = lagnaLon + (n-1)*30
  const houses = Array.from({ length: 12 }, (_, i) => ((lagnaLon + i * 30) % 360));

  return {
    lagna: lagnaLon,
    lagnaSignIndex,
    lagnaSign: ZODIAC_NAMES[lagnaSignIndex] ?? "N/A",
    lagnaSignEn: ZODIAC_ENGLISH[lagnaSignIndex] ?? "N/A",
    planets,
    houses,
    currentDasha,
    dashaBalance: balanceYears,
    upcomingDashas: dashas,
    antar,
    moonNakshatra: NAKSHATRA_NAMES[moonNakshatraIdx] ?? "N/A",
    moonNakshatraPada: moon.nakshatraPada,
    moonSign: moon.sign,
    sunSign: sun.sign,
    navamsaLagna,
  };
}

export function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function dashaProgress(dasha: DashaPeriod): number {
  const now = Date.now();
  const total = dasha.end.getTime() - dasha.start.getTime();
  const elapsed = now - dasha.start.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

// Planet color for chart display
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

// Brief interpretation texts
export const LAGNA_INTERPRETATIONS: Record<string, { title: string; body: string }> = {
  Mesha:     { title: "Mesha Lagna — The Pioneer", body: "Bold, energetic, and action-first. You lead with courage and thrive on new beginnings. Mars gives you a sharp, competitive nature and strong physical vitality." },
  Vrishabha: { title: "Vrishabha Lagna — The Builder", body: "Steady, sensual, and material-minded. Venus blesses you with beauty, comfort-seeking, and a remarkable capacity to create lasting wealth and stable relationships." },
  Mithuna:   { title: "Mithuna Lagna — The Communicator", body: "Witty, curious, and adaptable. Mercury makes you a natural networker and thinker, skilled with words and ideas. You see all sides of every situation." },
  Karka:     { title: "Karka Lagna — The Nurturer", body: "Deeply empathetic, protective, and home-loving. The Moon gives you powerful intuition and emotional sensitivity, with a strong attachment to family and the past." },
  Simha:     { title: "Simha Lagna — The Sovereign", body: "Regal, generous, and charismatic. The Sun gives you natural authority and a love of being center stage. You are warm-hearted, creative, and born to lead." },
  Kanya:     { title: "Kanya Lagna — The Analyst", body: "Discerning, service-minded, and precise. Mercury gifts you analytical brilliance. You notice every detail and excel in fields requiring accuracy — medicine, writing, research." },
  Tula:      { title: "Tula Lagna — The Diplomat", body: "Balanced, charming, and relationship-oriented. Venus makes you graceful and fair-minded. You are drawn to beauty, justice, and harmonious partnerships." },
  Vrishchika:{ title: "Vrishchika Lagna — The Transformer", body: "Intense, perceptive, and psychologically deep. Mars gives penetrating insight and a magnetic personality. You are drawn to hidden truths and profound transformation." },
  Dhanu:     { title: "Dhanu Lagna — The Philosopher", body: "Optimistic, truth-seeking, and freedom-loving. Jupiter expands your horizons through philosophy, travel, and higher learning. You are the eternal student and teacher." },
  Makara:    { title: "Makara Lagna — The Achiever", body: "Disciplined, ambitious, and patient. Saturn rewards your slow, steady climb with lasting success. You build structures that endure and earn respect through sheer perseverance." },
  Kumbha:    { title: "Kumbha Lagna — The Visionary", body: "Unconventional, humanitarian, and intellectually independent. Saturn and your fixed nature make you a reformer who works for the collective good." },
  Meena:     { title: "Meena Lagna — The Dreamer", body: "Compassionate, imaginative, and spiritually inclined. Jupiter dissolves boundaries and deepens empathy. You bridge the material and spiritual worlds with grace." },
};
