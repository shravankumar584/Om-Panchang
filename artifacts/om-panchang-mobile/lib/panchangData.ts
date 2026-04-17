import { computeSiderealPositions, getLahiriAyanamsa, mod360, computeTithiWindow } from "./astronomyCore";
import SunCalc from "suncalc";

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const CITIES: City[] = [
  { name: "Delhi", country: "India", lat: 28.6139, lon: 77.209, timezone: "Asia/Kolkata" },
  { name: "Mumbai", country: "India", lat: 19.076, lon: 72.8777, timezone: "Asia/Kolkata" },
  { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata" },
  { name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707, timezone: "Asia/Kolkata" },
  { name: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639, timezone: "Asia/Kolkata" },
  { name: "Hyderabad", country: "India", lat: 17.385, lon: 78.4867, timezone: "Asia/Kolkata" },
  { name: "Pune", country: "India", lat: 18.5204, lon: 73.8567, timezone: "Asia/Kolkata" },
  { name: "Ahmedabad", country: "India", lat: 23.0225, lon: 72.5714, timezone: "Asia/Kolkata" },
  { name: "Jaipur", country: "India", lat: 26.9124, lon: 75.7873, timezone: "Asia/Kolkata" },
  { name: "Varanasi", country: "India", lat: 25.3176, lon: 82.9739, timezone: "Asia/Kolkata" },
  { name: "Haridwar", country: "India", lat: 29.9457, lon: 78.1642, timezone: "Asia/Kolkata" },
  { name: "Mathura", country: "India", lat: 27.4924, lon: 77.6737, timezone: "Asia/Kolkata" },
  { name: "Ayodhya", country: "India", lat: 26.7922, lon: 82.1998, timezone: "Asia/Kolkata" },
  { name: "Tirupati", country: "India", lat: 13.6288, lon: 79.4192, timezone: "Asia/Kolkata" },
  { name: "Amritsar", country: "India", lat: 31.634, lon: 74.8723, timezone: "Asia/Kolkata" },
  { name: "New York", country: "United States", lat: 40.7128, lon: -74.006, timezone: "America/New_York" },
  { name: "Chicago", country: "United States", lat: 41.8781, lon: -87.6298, timezone: "America/Chicago" },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles" },
  { name: "Houston", country: "United States", lat: 29.7604, lon: -95.3698, timezone: "America/Chicago" },
  { name: "San Francisco", country: "United States", lat: 37.7749, lon: -122.4194, timezone: "America/Los_Angeles" },
  { name: "San Jose", country: "United States", lat: 37.3382, lon: -121.8863, timezone: "America/Los_Angeles" },
  { name: "Dallas", country: "United States", lat: 32.7767, lon: -96.797, timezone: "America/Chicago" },
  { name: "Austin", country: "United States", lat: 30.2672, lon: -97.7431, timezone: "America/Chicago" },
  { name: "Seattle", country: "United States", lat: 47.6062, lon: -122.3321, timezone: "America/Los_Angeles" },
  { name: "Atlanta", country: "United States", lat: 33.749, lon: -84.388, timezone: "America/New_York" },
  { name: "Boston", country: "United States", lat: 42.3601, lon: -71.0589, timezone: "America/New_York" },
  { name: "Washington DC", country: "United States", lat: 38.9072, lon: -77.0369, timezone: "America/New_York" },
  { name: "Edison", country: "United States", lat: 40.5187, lon: -74.4121, timezone: "America/New_York" },
  { name: "Philadelphia", country: "United States", lat: 39.9526, lon: -75.1652, timezone: "America/New_York" },
  { name: "Phoenix", country: "United States", lat: 33.4484, lon: -112.074, timezone: "America/Phoenix" },
  { name: "Denver", country: "United States", lat: 39.7392, lon: -104.9903, timezone: "America/Denver" },
  { name: "Detroit", country: "United States", lat: 42.3314, lon: -83.0458, timezone: "America/Detroit" },
  { name: "Miami", country: "United States", lat: 25.7617, lon: -80.1918, timezone: "America/New_York" },
  { name: "Fremont", country: "United States", lat: 37.5485, lon: -121.9886, timezone: "America/Los_Angeles" },
  { name: "Sunnyvale", country: "United States", lat: 37.3688, lon: -122.0363, timezone: "America/Los_Angeles" },
  { name: "San Diego", country: "United States", lat: 32.7157, lon: -117.1611, timezone: "America/Los_Angeles" },
  { name: "Irvine", country: "United States", lat: 33.6846, lon: -117.8265, timezone: "America/Los_Angeles" },
  { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, timezone: "America/Toronto" },
  { name: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207, timezone: "America/Vancouver" },
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, timezone: "Europe/London" },
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney" },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631, timezone: "Australia/Melbourne" },
  { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai" },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, timezone: "Asia/Singapore" },
  { name: "Kathmandu", country: "Nepal", lat: 27.7172, lon: 85.324, timezone: "Asia/Kathmandu" },
];

export interface DayPanchang {
  date: Date;
  tithi: string;
  tithiStart?: string;
  tithiEnd?: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  paksha: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKalam: string;
  yamagandaKalam: string;
  gulikaKalam: string;
  abhijitMuhurta: string;
  brahmaMuhurta: string;
  vikramSamvat: number;
  shakaSamvat: number;
  ayana: string;
  ritu: string;
  weekdayName: string;
  sunsign: string;
  moonsign: string;
  festivals: string[];
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

export const ZODIAC_NAMES = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
];

export const ZODIAC_ENGLISH = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const SANSKRIT_WEEKDAYS = [
  "Ravivara", "Somavara", "Mangalavara", "Budhavara",
  "Guruvara", "Shukravara", "Shanivara"
];

export const FESTIVALS_BY_DATE: Record<string, string[]> = {
  "2025-01-14": ["Makar Sankranti", "Pongal"],
  "2025-01-29": ["Vasant Panchami"],
  "2025-02-26": ["Maha Shivaratri"],
  "2025-03-13": ["Holika Dahan"],
  "2025-03-14": ["Holi"],
  "2025-03-30": ["Ugadi", "Gudi Padwa"],
  "2025-04-06": ["Ram Navami"],
  "2025-04-10": ["Hanuman Jayanti"],
  "2025-04-14": ["Tamil New Year", "Vishu"],
  "2025-07-06": ["Guru Purnima"],
  "2025-08-09": ["Naga Panchami"],
  "2025-08-16": ["Raksha Bandhan"],
  "2025-08-20": ["Krishna Janmashtami"],
  "2025-08-27": ["Ganesh Chaturthi"],
  "2025-10-02": ["Navratri Begins"],
  "2025-10-12": ["Dussehra (Vijaya Dashami)"],
  "2025-10-20": ["Diwali (Lakshmi Puja)"],
  "2025-10-22": ["Govardhan Puja"],
  "2025-10-23": ["Bhai Dooj"],
  "2025-11-05": ["Chhath Puja"],
  "2026-01-13": ["Makar Sankranti", "Pongal", "Lohri"],
  "2026-01-29": ["Vasant Panchami"],
  "2026-02-17": ["Maha Shivaratri"],
  "2026-03-03": ["Holika Dahan"],
  "2026-03-04": ["Holi"],
  "2026-03-20": ["Chaitra Navratri", "Ugadi", "Gudi Padwa"],
  "2026-03-29": ["Ram Navami"],
  "2026-04-02": ["Hanuman Jayanti"],
  "2026-04-13": ["Tamil New Year", "Vishu", "Baisakhi"],
  "2026-04-18": ["Akshaya Tritiya"],
  "2026-07-16": ["Rath Yatra"],
  "2026-07-29": ["Guru Purnima"],
  "2026-08-17": ["Naga Panchami"],
  "2026-08-28": ["Raksha Bandhan"],
  "2026-09-04": ["Krishna Janmashtami"],
  "2026-09-14": ["Ganesh Chaturthi"],
  "2026-10-11": ["Navratri Begins"],
  "2026-10-21": ["Dussehra (Vijaya Dashami)"],
  "2026-10-29": ["Karva Chauth"],
  "2026-11-07": ["Dhanteras"],
  "2026-11-08": ["Diwali (Lakshmi Puja)"],
  "2026-11-09": ["Govardhan Puja"],
  "2026-11-10": ["Bhai Dooj"],
  "2026-11-13": ["Chhath Puja"],
  "2027-01-14": ["Makar Sankranti", "Pongal"],
  "2027-02-01": ["Vasant Panchami"],
  "2027-02-26": ["Maha Shivaratri"],
  "2027-03-22": ["Holika Dahan"],
  "2027-03-23": ["Holi"],
  "2027-04-10": ["Ram Navami"],
  "2027-04-20": ["Hanuman Jayanti"],
  "2027-06-20": ["Vat Savitri"],
  "2027-07-25": ["Guru Purnima"],
  "2027-08-27": ["Raksha Bandhan"],
  "2027-09-25": ["Krishna Janmashtami"],
  "2027-10-05": ["Ganesh Chaturthi"],
  "2027-11-27": ["Diwali (Lakshmi Puja)"],
};

export function getFestivalsForDate(date: Date): string[] {
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return FESTIVALS_BY_DATE[key] || [];
}

export function getUpcomingFestivals(from: Date, count = 10): { dateStr: string; names: string[]; daysLeft: number }[] {
  const fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const result: { dateStr: string; names: string[]; daysLeft: number }[] = [];
  for (const [dateStr, names] of Object.entries(FESTIVALS_BY_DATE)) {
    const festDate = new Date(dateStr + "T00:00:00");
    const daysLeft = Math.round((festDate.getTime() - fromTime) / 86400000);
    if (daysLeft >= 0) result.push({ dateStr, names, daysLeft });
  }
  result.sort((a, b) => a.daysLeft - b.daysLeft);
  return result.slice(0, count);
}

function getTimezoneOffsetMinutes(date: Date, timezone: string): number {
  try {
    // Use Intl.DateTimeFormat.formatToParts — works reliably on Hermes (React Native).
    // Avoids new Date(date.toLocaleString(...)) which returns NaN on Hermes because
    // it cannot parse locale-formatted strings.
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour12: false,
      year: "numeric", month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric", second: "numeric",
    });
    const parts = dtf.formatToParts(date);
    const map: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = parseInt(p.value, 10);
    }
    if (
      isNaN(map.year)  || isNaN(map.month) || isNaN(map.day) ||
      isNaN(map.hour)  || isNaN(map.minute)
    ) return 0;
    // Some locales emit hour "24" for midnight — normalize to 0.
    const hour = map.hour === 24 ? 0 : map.hour;
    const second = isNaN(map.second) ? 0 : map.second;
    const tzAsUtcMs = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, second);
    return Math.round((tzAsUtcMs - date.getTime()) / 60000);
  } catch {
    return 0;
  }
}

function formatTimeWithOffset(date: Date | null | undefined, utcOffsetMin: number): string {
  if (!date) return "N/A";
  try {
    const shifted = new Date(date.getTime() + utcOffsetMin * 60000);
    const h = shifted.getUTCHours();
    const m = shifted.getUTCMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  } catch {
    return "N/A";
  }
}

function formatTime(date: Date | null | undefined, timezone: string): string {
  if (!date) return "N/A";
  try {
    const offsetMin = getTimezoneOffsetMinutes(date, timezone);
    return formatTimeWithOffset(date, offsetMin);
  } catch {
    return "N/A";
  }
}

function getMuhurtaTime(date: Date, sunrise: Date | null, sunset: Date | null, slots: number[], timezone: string): string {
  if (!sunrise || !sunset) return "N/A";
  const dayOfWeek = date.getDay();
  const slot = slots[dayOfWeek];
  const totalMs = sunset.getTime() - sunrise.getTime();
  const segMs = totalMs / 8;
  const start = new Date(sunrise.getTime() + (slot - 1) * segMs);
  const end = new Date(start.getTime() + segMs);
  const offsetMin = getTimezoneOffsetMinutes(date, timezone);
  return `${formatTimeWithOffset(start, offsetMin)} – ${formatTimeWithOffset(end, offsetMin)}`;
}

function getRahuKalam(date: Date, sunrise: Date | null, sunset: Date | null, timezone: string): string {
  const rahuSlots = [8, 2, 7, 5, 6, 4, 3];
  return getMuhurtaTime(date, sunrise, sunset, rahuSlots, timezone);
}

function getYamaganda(date: Date, sunrise: Date | null, sunset: Date | null, timezone: string): string {
  const yamaSlots = [5, 4, 3, 2, 7, 6, 1];
  return getMuhurtaTime(date, sunrise, sunset, yamaSlots, timezone);
}

function getGulika(date: Date, sunrise: Date | null, sunset: Date | null, timezone: string): string {
  const gulikaSlots = [7, 6, 5, 4, 3, 2, 1];
  return getMuhurtaTime(date, sunrise, sunset, gulikaSlots, timezone);
}

function getAbhijitMuhurta(sunrise: Date | null, sunset: Date | null, timezone: string): string {
  if (!sunrise || !sunset) return "N/A";
  const noonMs = (sunrise.getTime() + sunset.getTime()) / 2;
  const start = new Date(noonMs - 24 * 60 * 1000);
  const end = new Date(noonMs + 24 * 60 * 1000);
  const offsetMin = getTimezoneOffsetMinutes(sunrise, timezone);
  return `${formatTimeWithOffset(start, offsetMin)} – ${formatTimeWithOffset(end, offsetMin)}`;
}

function getBrahmaMuhurta(sunrise: Date | null, timezone: string): string {
  if (!sunrise) return "N/A";
  const start = new Date(sunrise.getTime() - 96 * 60 * 1000);
  const end   = new Date(sunrise.getTime() - 48 * 60 * 1000);
  const offsetMin = getTimezoneOffsetMinutes(sunrise, timezone);
  return `${formatTimeWithOffset(start, offsetMin)} – ${formatTimeWithOffset(end, offsetMin)}`;
}

function getVikramSamvat(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month > 4 || (month === 4 && day > 15) || (month === 3 && day >= 20)) return year + 57;
  return year + 56;
}

function getShakaSamvat(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month > 3 || (month === 3 && day >= 22)) return year - 78;
  return year - 79;
}

function getAyana(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 1 && day >= 14) || (month >= 2 && month <= 6) || (month === 7 && day <= 16)) return "Uttarayana";
  return "Dakshinayana";
}

function getRitu(date: Date): string {
  const month = date.getMonth() + 1;
  if (month === 3 || month === 4) return "Vasanta (Spring)";
  if (month === 5 || month === 6) return "Grishma (Summer)";
  if (month === 7 || month === 8) return "Varsha (Monsoon)";
  if (month === 9 || month === 10) return "Sharad (Autumn)";
  if (month === 11 || month === 12) return "Hemanta (Pre-winter)";
  return "Shishira (Winter)";
}

function getSiderealZodiac(tropicalLon: number, ayanamsa: number): { sign: string; signEn: string } {
  const sidereal = ((tropicalLon - ayanamsa) % 360 + 360) % 360;
  const idx = Math.floor(sidereal / 30);
  return { sign: ZODIAC_NAMES[idx] ?? "N/A", signEn: ZODIAC_ENGLISH[idx] ?? "N/A" };
}

function getSuncalcTimes(date: Date, lat: number, lon: number): {
  sunriseDate: Date | null; sunsetDate: Date | null;
  moonriseDate: Date | null; moonsetDate: Date | null;
} {
  try {
    const noon = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
    const sunTimes  = SunCalc.getTimes(noon, lat, lon) as unknown as { sunrise?: Date; sunset?: Date };
    const moonTimes = SunCalc.getMoonTimes(noon, lat, lon) as { rise?: Date; set?: Date };
    const isValid = (d: unknown): d is Date => d instanceof Date && isFinite(d.getTime());
    return {
      sunriseDate:  isValid(sunTimes.sunrise)  ? sunTimes.sunrise  : null,
      sunsetDate:   isValid(sunTimes.sunset)   ? sunTimes.sunset   : null,
      moonriseDate: isValid(moonTimes.rise)    ? moonTimes.rise    : null,
      moonsetDate:  isValid(moonTimes.set)     ? moonTimes.set     : null,
    };
  } catch {
    return { sunriseDate: null, sunsetDate: null, moonriseDate: null, moonsetDate: null };
  }
}

export function computeDayPanchang(date: Date, city: City): DayPanchang {
  const festivals = getFestivalsForDate(date);
  const utcOffsetMin = getTimezoneOffsetMinutes(date, city.timezone);
  const utcOffsetHours = utcOffsetMin / 60;

  const { moonSid, sunSid, jd } = computeSiderealPositions(date, utcOffsetHours);
  const ayanamsa = getLahiriAyanamsa(jd);

  const moonTrop = mod360(moonSid + ayanamsa);
  const sunTrop  = mod360(sunSid  + ayanamsa);

  const elongation   = mod360(moonSid - sunSid);
  const tithiNum     = Math.floor(elongation / 12);
  const nakshatraNum = Math.floor(moonSid / (360 / 27));
  const yogaLon      = mod360(moonSid + sunSid);
  const yogaNum      = Math.floor(yogaLon / (360 / 27));
  const _karanaIdx   = Math.floor(elongation / 6);
  const karanaName   = (() => {
    if (_karanaIdx === 0) return "Kimstughna";
    if (_karanaIdx >= 57) return ["Shakuni", "Chatushpada", "Naga"][_karanaIdx - 57] ?? "Shakuni";
    const rep = ["Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti"];
    return rep[(_karanaIdx - 1) % 7] ?? "Bava";
  })();
  const paksha = tithiNum < 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";

  const { sunriseDate, sunsetDate, moonriseDate, moonsetDate } = getSuncalcTimes(date, city.lat, city.lon);

  const vikramSamvat = getVikramSamvat(date);
  const shakaSamvat  = getShakaSamvat(date);
  const ayana        = getAyana(date);
  const ritu         = getRitu(date);
  const weekdayName  = SANSKRIT_WEEKDAYS[date.getDay()] ?? "Ravivara";
  const sunsignData  = getSiderealZodiac(sunTrop, ayanamsa);
  const moonsignData = getSiderealZodiac(moonTrop, ayanamsa);

  const { tithiStart: tithiStartDate, tithiEnd: tithiEndDate } = computeTithiWindow(date, utcOffsetHours);

  return {
    date,
    tithi:        TITHI_NAMES[tithiNum % 15] ?? "Pratipada",
    tithiStart:   formatTime(tithiStartDate, city.timezone),
    tithiEnd:     formatTime(tithiEndDate,   city.timezone),
    nakshatra:    NAKSHATRA_NAMES[nakshatraNum % 27] ?? "Ashwini",
    yoga:         YOGA_NAMES[yogaNum % 27] ?? "Vishkambha",
    karana:       karanaName,
    paksha,
    sunrise:      formatTime(sunriseDate,  city.timezone),
    sunset:       formatTime(sunsetDate,   city.timezone),
    moonrise:     formatTime(moonriseDate, city.timezone),
    moonset:      formatTime(moonsetDate,  city.timezone),
    rahuKalam:    getRahuKalam(date, sunriseDate, sunsetDate, city.timezone),
    yamagandaKalam: getYamaganda(date, sunriseDate, sunsetDate, city.timezone),
    gulikaKalam:  getGulika(date, sunriseDate, sunsetDate, city.timezone),
    abhijitMuhurta: getAbhijitMuhurta(sunriseDate, sunsetDate, city.timezone),
    brahmaMuhurta:  getBrahmaMuhurta(sunriseDate, city.timezone),
    vikramSamvat,
    shakaSamvat,
    ayana,
    ritu,
    weekdayName,
    sunsign:  `${sunsignData.sign} (${sunsignData.signEn})`,
    moonsign: `${moonsignData.sign} (${moonsignData.signEn})`,
    festivals,
  };
}

export interface PlanetPosition {
  name: string;
  nameEn: string;
  symbol: string;
  longitude: number;
  zodiacSign: string;
  zodiacEn: string;
  degInSign: number;
  isRetrograde: boolean;
}

const PLANET_DATA = [
  { name: "Surya", nameEn: "Sun", symbol: "☉", epochLon: 280.460, dailyMotion: 0.9856474 },
  { name: "Chandra", nameEn: "Moon", symbol: "☽", epochLon: 218.316, dailyMotion: 13.176396 },
  { name: "Mangal", nameEn: "Mars", symbol: "♂", epochLon: 355.433, dailyMotion: 0.5240207766 },
  { name: "Budha", nameEn: "Mercury", symbol: "☿", epochLon: 252.251, dailyMotion: 4.092317 },
  { name: "Guru", nameEn: "Jupiter", symbol: "♃", epochLon: 34.396, dailyMotion: 0.0830853 },
  { name: "Shukra", nameEn: "Venus", symbol: "♀", epochLon: 181.979, dailyMotion: 1.6021302 },
  { name: "Shani", nameEn: "Saturn", symbol: "♄", epochLon: 50.0774, dailyMotion: 0.0334442 },
  { name: "Rahu", nameEn: "N. Node", symbol: "☊", epochLon: 125.0445, dailyMotion: -0.0529539 },
];

export function getPlanetaryPositions(date: Date): PlanetPosition[] {
  const d = (date.getTime() - new Date("2000-01-01T12:00:00Z").getTime()) / 86400000;
  const ayanamsa = 23.85;
  return PLANET_DATA.map((planet) => {
    const tropicalLon = ((planet.epochLon + planet.dailyMotion * d) % 360 + 360) % 360;
    const siderealLon = ((tropicalLon - ayanamsa) % 360 + 360) % 360;
    const signIndex = Math.floor(siderealLon / 30);
    const degInSign = siderealLon - signIndex * 30;
    let isRetrograde = false;
    if (planet.name === "Shani") isRetrograde = (Math.sin((d / 378) * 2 * Math.PI) < -0.7);
    if (planet.name === "Guru")  isRetrograde = (Math.sin((d / 398) * 2 * Math.PI) < -0.7);
    if (planet.name === "Mangal") isRetrograde = (Math.sin((d / 780) * 2 * Math.PI) < -0.85);
    return {
      name: planet.name, nameEn: planet.nameEn, symbol: planet.symbol,
      longitude: siderealLon,
      zodiacSign: ZODIAC_NAMES[signIndex] ?? "N/A",
      zodiacEn:   ZODIAC_ENGLISH[signIndex] ?? "N/A",
      degInSign, isRetrograde,
    };
  });
}
