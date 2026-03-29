export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const CITIES: City[] = [
  { name: "Detroit", country: "United States", lat: 42.3314, lon: -83.0458, timezone: "America/Detroit" },
  { name: "New York", country: "United States", lat: 40.7128, lon: -74.006, timezone: "America/New_York" },
  { name: "Chicago", country: "United States", lat: 41.8781, lon: -87.6298, timezone: "America/Chicago" },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles" },
  { name: "Houston", country: "United States", lat: 29.7604, lon: -95.3698, timezone: "America/Chicago" },
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, timezone: "Europe/London" },
  { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata" },
  { name: "Mumbai", country: "India", lat: 19.076, lon: 72.8777, timezone: "Asia/Kolkata" },
  { name: "Delhi", country: "India", lat: 28.6139, lon: 77.209, timezone: "Asia/Kolkata" },
  { name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707, timezone: "Asia/Kolkata" },
];

export interface DayPanchang {
  date: Date;
  tithi: string;
  tithiEnd?: string;
  nakshatra: string;
  nakshatraEnd?: string;
  yoga: string;
  karana: string;
  paksha: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKalam: string;
  festivals: string[];
  loading: boolean;
  error?: string;
}

export const TITHI_NAMES = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dvadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya"
];

export const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti"
];

export const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garija",
  "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

function formatTime(date: Date | null | undefined, timezone: string): string {
  if (!date) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }
}

function getRahuKalam(date: Date, sunrise: Date | null, sunset: Date | null): string {
  if (!sunrise || !sunset) return "N/A";
  
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ...
  const rahuSlots = [8, 2, 7, 5, 6, 4, 3]; // index by day of week -> portion of day (1-8)
  const slot = rahuSlots[dayOfWeek];
  
  const totalMs = sunset.getTime() - sunrise.getTime();
  const segmentMs = totalMs / 8;
  const startMs = sunrise.getTime() + (slot - 1) * segmentMs;
  const endMs = startMs + segmentMs;
  
  const start = new Date(startMs);
  const end = new Date(endMs);
  
  const fmt = (d: Date) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getTithiName(tithiNum: number | undefined): string {
  if (tithiNum === undefined || tithiNum === null) return "N/A";
  const idx = Math.floor(tithiNum) % 30;
  if (idx === 0 || idx === 30) return "Amavasya";
  if (idx === 15) return "Purnima";
  if (idx <= 15) return TITHI_NAMES[(idx - 1) % 15] || "N/A";
  return TITHI_NAMES[(idx - 16) % 15] || "N/A";
}

function getPaksha(tithiNum: number | undefined): string {
  if (tithiNum === undefined || tithiNum === null) return "N/A";
  const idx = Math.floor(tithiNum) % 30;
  if (idx === 0) return "Amavasya";
  if (idx === 15) return "Purnima";
  return idx < 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";
}

function getNakshatraName(nakshatraNum: number | undefined): string {
  if (nakshatraNum === undefined || nakshatraNum === null) return "N/A";
  const idx = Math.floor(nakshatraNum) % 27;
  return NAKSHATRA_NAMES[idx] || "N/A";
}

function getYogaName(yogaNum: number | undefined): string {
  if (yogaNum === undefined || yogaNum === null) return "N/A";
  const idx = Math.floor(yogaNum) % 27;
  return YOGA_NAMES[idx] || "N/A";
}

function getKaranaName(karanaNum: number | undefined): string {
  if (karanaNum === undefined || karanaNum === null) return "N/A";
  const idx = Math.floor(karanaNum) % 11;
  return KARANA_NAMES[idx] || "N/A";
}

// Curated festival data - key Hindu festivals for 2025-2026
export const FESTIVALS_BY_DATE: Record<string, string[]> = {
  // 2025
  "2025-01-14": ["Makar Sankranti", "Pongal"],
  "2025-01-29": ["Vasant Panchami"],
  "2025-02-26": ["Maha Shivaratri"],
  "2025-03-14": ["Holi"],
  "2025-03-13": ["Holika Dahan"],
  "2025-03-30": ["Ugadi", "Gudi Padwa"],
  "2025-04-06": ["Ram Navami"],
  "2025-04-10": ["Hanuman Jayanti"],
  "2025-04-14": ["Tamil New Year", "Vishu"],
  "2025-07-06": ["Guru Purnima"],
  "2025-08-09": ["Naga Panchami"],
  "2025-08-16": ["Raksha Bandhan"],
  "2025-08-20": ["Krishna Janmashtami"],
  "2025-08-27": ["Ganesh Chaturthi"],
  "2025-09-02": ["Onam"],
  "2025-10-02": ["Navratri Begins", "Dussehra (Vijaya Dashami)"],
  "2025-10-20": ["Diwali (Lakshmi Puja)"],
  "2025-10-23": ["Bhai Dooj"],
  "2025-11-05": ["Chhath Puja"],
  "2025-11-15": ["Dev Uthani Ekadashi"],
  "2025-12-25": ["Christmas"],
  // 2026
  "2026-01-14": ["Makar Sankranti", "Pongal"],
  "2026-02-17": ["Maha Shivaratri"],
  "2026-03-03": ["Holika Dahan"],
  "2026-03-04": ["Holi"],
  "2026-03-19": ["Ugadi", "Gudi Padwa"],
  "2026-03-22": ["Ram Navami"],
  "2026-03-27": ["Hanuman Jayanti"],
  "2026-04-13": ["Tamil New Year", "Vishu"],
  "2026-07-26": ["Guru Purnima"],
  "2026-08-05": ["Naga Panchami"],
  "2026-09-05": ["Krishna Janmashtami"],
  "2026-09-17": ["Ganesh Chaturthi"],
  "2026-10-11": ["Navratri Begins"],
  "2026-10-20": ["Dussehra (Vijaya Dashami)"],
  "2026-11-08": ["Diwali (Lakshmi Puja)"],
  "2026-11-12": ["Bhai Dooj"],
  "2026-12-25": ["Christmas"],
};

export function getFestivalsForDate(date: Date): string[] {
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return FESTIVALS_BY_DATE[key] || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function computeDayPanchang(date: Date, city: City): Promise<DayPanchang> {
  const festivals = getFestivalsForDate(date);
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Panchangam = (window as any).Panchangam;
    if (!Panchangam) {
      throw new Error("Panchangam library not loaded");
    }

    const { Observer, getPanchangam } = Panchangam;
    const observer = new Observer(city.lat, city.lon, 0);
    const result = await getPanchangam(date, observer);

    const tithi = getTithiName(result?.tithi?.index ?? result?.tithi);
    const nakshatra = getNakshatraName(result?.nakshatra?.index ?? result?.nakshatra);
    const yoga = getYogaName(result?.yoga?.index ?? result?.yoga);
    const karana = getKaranaName(result?.karana?.index ?? result?.karana);
    const paksha = getPaksha(result?.tithi?.index ?? result?.tithi);

    const sunriseDate = result?.sunrise ? new Date(result.sunrise) : null;
    const sunsetDate = result?.sunset ? new Date(result.sunset) : null;
    const moonriseDate = result?.moonrise ? new Date(result.moonrise) : null;
    const moonsetDate = result?.moonset ? new Date(result.moonset) : null;

    const sunrise = formatTime(sunriseDate, city.timezone);
    const sunset = formatTime(sunsetDate, city.timezone);
    const moonrise = formatTime(moonriseDate, city.timezone);
    const moonset = formatTime(moonsetDate, city.timezone);

    let tithiEnd = undefined;
    if (result?.tithi?.end) {
      tithiEnd = formatTime(new Date(result.tithi.end), city.timezone);
    }
    let nakshatraEnd = undefined;
    if (result?.nakshatra?.end) {
      nakshatraEnd = formatTime(new Date(result.nakshatra.end), city.timezone);
    }

    const rahuKalam = getRahuKalam(date, sunriseDate, sunsetDate);

    return {
      date,
      tithi,
      tithiEnd,
      nakshatra,
      nakshatraEnd,
      yoga,
      karana,
      paksha,
      sunrise,
      sunset,
      moonrise,
      moonset,
      rahuKalam,
      festivals,
      loading: false,
    };
  } catch (err) {
    // Fallback: compute approximate values using simple astronomical formulas
    return computeFallbackPanchang(date, city, festivals);
  }
}

function computeFallbackPanchang(date: Date, city: City, festivals: string[]): DayPanchang {
  // Simple approximation using Julian Day Number
  const jd = dateToJD(date);
  
  // Moon's mean longitude approximation
  const T = (jd - 2451545.0) / 36525;
  const moonLon = (218.316 + 13.176396 * (jd - 2451545.0)) % 360;
  const sunLon = (280.460 + 0.9856474 * (jd - 2451545.0)) % 360;
  
  // Tithi: based on elongation
  let elongation = (moonLon - sunLon + 360) % 360;
  const tithiNum = Math.floor(elongation / 12);
  
  // Nakshatra: moon's position in 27 nakshatras
  const nakshatraNum = Math.floor((moonLon % 360) / (360 / 27));
  
  // Yoga
  const yogaLon = (moonLon + sunLon) % 360;
  const yogaNum = Math.floor(yogaLon / (360 / 27));
  
  // Karana (half-tithi)
  const karanaNum = Math.floor(elongation / 6) % 11;
  
  // Paksha
  const paksha = tithiNum < 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";
  
  // Approximate sunrise/sunset
  const { sunrise, sunset } = approximateSunriseSunset(date, city.lat, city.lon, city.timezone);
  
  return {
    date,
    tithi: TITHI_NAMES[tithiNum % 15] || "Pratipada",
    nakshatra: NAKSHATRA_NAMES[nakshatraNum % 27] || "Ashwini",
    yoga: YOGA_NAMES[yogaNum % 27] || "Vishkambha",
    karana: KARANA_NAMES[karanaNum % 11] || "Bava",
    paksha,
    sunrise,
    sunset,
    moonrise: "N/A",
    moonset: "N/A",
    rahuKalam: "N/A",
    festivals,
    loading: false,
  };
}

function dateToJD(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const A = Math.floor((14 - m) / 12);
  const Y = y + 4800 - A;
  const M = m + 12 * A - 3;
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
}

function approximateSunriseSunset(date: Date, lat: number, lon: number, timezone: string): { sunrise: string; sunset: string } {
  try {
    // Get the UTC offset for the timezone on this date
    const utcOffsetMin = getTimezoneOffsetMinutes(date, timezone);
    const utcOffsetHours = utcOffsetMin / 60;

    const doy = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const B = (360 / 365) * (doy - 81) * (Math.PI / 180);
    const ET = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const declination = 23.45 * Math.sin(B) * (Math.PI / 180);
    const latRad = lat * (Math.PI / 180);
    const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(declination)) * (180 / Math.PI);

    // Solar noon in local standard time of the timezone (using UTC offset)
    const solarNoon = 12 + utcOffsetHours - lon / 15 - ET / 60;
    const sunriseHour = solarNoon - hourAngle / 15;
    const sunsetHour = solarNoon + hourAngle / 15;

    const formatHour = (h: number) => {
      let totalMin = Math.round(h * 60);
      // wrap around 24 hours
      totalMin = ((totalMin % 1440) + 1440) % 1440;
      const hr = Math.floor(totalMin / 60);
      const min = totalMin % 60;
      const ampm = hr >= 12 ? "PM" : "AM";
      const displayHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
      return `${displayHr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} ${ampm}`;
    };

    return {
      sunrise: formatHour(sunriseHour),
      sunset: formatHour(sunsetHour),
    };
  } catch {
    return { sunrise: "06:15 AM", sunset: "06:45 PM" };
  }
}

function getTimezoneOffsetMinutes(date: Date, timezone: string): number {
  try {
    // Get a formatted string with the UTC offset indicator
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / 60000;
  } catch {
    return 0;
  }
}
