import { computeSiderealPositions, getLahiriAyanamsa, mod360, computeTithiWindow } from "./astronomyCore";
// @ts-ignore — suncalc has no bundled TS types
import SunCalc from "suncalc";

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
}

/** Convert a City name to a URL slug: "New York" → "new-york" */
export function cityToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/** Find a City by its URL slug — returns null if not found */
export function slugToCity(slug: string): City | null {
  return CITIES.find(c => cityToSlug(c.name) === slug) ?? null;
}

export const CITIES: City[] = [
  // India
  { name: "Delhi", country: "India", lat: 28.6139, lon: 77.209, timezone: "Asia/Kolkata" },
  { name: "Mumbai", country: "India", lat: 19.076, lon: 72.8777, timezone: "Asia/Kolkata" },
  { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata" },
  { name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707, timezone: "Asia/Kolkata" },
  { name: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639, timezone: "Asia/Kolkata" },
  { name: "Hyderabad", country: "India", lat: 17.385, lon: 78.4867, timezone: "Asia/Kolkata" },
  { name: "Pune", country: "India", lat: 18.5204, lon: 73.8567, timezone: "Asia/Kolkata" },
  { name: "Ahmedabad", country: "India", lat: 23.0225, lon: 72.5714, timezone: "Asia/Kolkata" },
  { name: "Jaipur", country: "India", lat: 26.9124, lon: 75.7873, timezone: "Asia/Kolkata" },
  { name: "Lucknow", country: "India", lat: 26.8467, lon: 80.9462, timezone: "Asia/Kolkata" },
  { name: "Varanasi", country: "India", lat: 25.3176, lon: 82.9739, timezone: "Asia/Kolkata" },
  { name: "Surat", country: "India", lat: 21.1702, lon: 72.8311, timezone: "Asia/Kolkata" },
  { name: "Kochi", country: "India", lat: 9.9312, lon: 76.2673, timezone: "Asia/Kolkata" },
  { name: "Chandigarh", country: "India", lat: 30.7333, lon: 76.7794, timezone: "Asia/Kolkata" },
  { name: "Indore", country: "India", lat: 22.7196, lon: 75.8577, timezone: "Asia/Kolkata" },
  { name: "Nagpur", country: "India", lat: 21.1458, lon: 79.0882, timezone: "Asia/Kolkata" },
  { name: "Bhopal", country: "India", lat: 23.2599, lon: 77.4126, timezone: "Asia/Kolkata" },
  { name: "Patna", country: "India", lat: 25.5941, lon: 85.1376, timezone: "Asia/Kolkata" },
  { name: "Amritsar", country: "India", lat: 31.634, lon: 74.8723, timezone: "Asia/Kolkata" },
  { name: "Haridwar", country: "India", lat: 29.9457, lon: 78.1642, timezone: "Asia/Kolkata" },
  { name: "Rishikesh", country: "India", lat: 30.0869, lon: 78.2676, timezone: "Asia/Kolkata" },
  { name: "Mathura", country: "India", lat: 27.4924, lon: 77.6737, timezone: "Asia/Kolkata" },
  { name: "Vrindavan", country: "India", lat: 27.5794, lon: 77.6965, timezone: "Asia/Kolkata" },
  { name: "Ayodhya", country: "India", lat: 26.7922, lon: 82.1998, timezone: "Asia/Kolkata" },
  { name: "Agra", country: "India", lat: 27.1767, lon: 78.0081, timezone: "Asia/Kolkata" },
  { name: "Prayagraj", country: "India", lat: 25.4358, lon: 81.8463, timezone: "Asia/Kolkata" },
  { name: "Tirupati", country: "India", lat: 13.6288, lon: 79.4192, timezone: "Asia/Kolkata" },
  { name: "Shirdi", country: "India", lat: 19.7653, lon: 74.4776, timezone: "Asia/Kolkata" },
  { name: "Nashik", country: "India", lat: 19.9975, lon: 73.7898, timezone: "Asia/Kolkata" },
  { name: "Warangal", country: "India", lat: 17.9784, lon: 79.5941, timezone: "Asia/Kolkata" },
  { name: "Visakhapatnam", country: "India", lat: 17.6868, lon: 83.2185, timezone: "Asia/Kolkata" },
  { name: "Coimbatore", country: "India", lat: 11.0168, lon: 76.9558, timezone: "Asia/Kolkata" },
  { name: "Madurai", country: "India", lat: 9.9252, lon: 78.1198, timezone: "Asia/Kolkata" },
  { name: "Thiruvananthapuram", country: "India", lat: 8.5241, lon: 76.9366, timezone: "Asia/Kolkata" },
  { name: "Mysuru", country: "India", lat: 12.2958, lon: 76.6394, timezone: "Asia/Kolkata" },
  { name: "Ranchi", country: "India", lat: 23.3441, lon: 85.3096, timezone: "Asia/Kolkata" },
  { name: "Bhubaneswar", country: "India", lat: 20.2961, lon: 85.8246, timezone: "Asia/Kolkata" },
  { name: "Guwahati", country: "India", lat: 26.1445, lon: 91.7362, timezone: "Asia/Kolkata" },
  { name: "Dehradun", country: "India", lat: 30.3165, lon: 78.0322, timezone: "Asia/Kolkata" },
  { name: "Jodhpur", country: "India", lat: 26.2389, lon: 73.0243, timezone: "Asia/Kolkata" },
  { name: "Udaipur", country: "India", lat: 24.5854, lon: 73.7125, timezone: "Asia/Kolkata" },
  { name: "Vadodara", country: "India", lat: 22.3072, lon: 73.1812, timezone: "Asia/Kolkata" },
  { name: "Rajkot", country: "India", lat: 22.3039, lon: 70.8022, timezone: "Asia/Kolkata" },
  { name: "Raipur", country: "India", lat: 21.2514, lon: 81.6296, timezone: "Asia/Kolkata" },
  { name: "Mangaluru", country: "India", lat: 12.9141, lon: 74.856, timezone: "Asia/Kolkata" },
  // USA
  { name: "New York", country: "United States", lat: 40.7128, lon: -74.006, timezone: "America/New_York" },
  { name: "Chicago", country: "United States", lat: 41.8781, lon: -87.6298, timezone: "America/Chicago" },
  { name: "Los Angeles", country: "United States", lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles" },
  { name: "Houston", country: "United States", lat: 29.7604, lon: -95.3698, timezone: "America/Chicago" },
  { name: "San Francisco", country: "United States", lat: 37.7749, lon: -122.4194, timezone: "America/Los_Angeles" },
  { name: "San Jose", country: "United States", lat: 37.3382, lon: -121.8863, timezone: "America/Los_Angeles" },
  { name: "Dallas", country: "United States", lat: 32.7767, lon: -96.797, timezone: "America/Chicago" },
  { name: "Austin", country: "United States", lat: 30.2672, lon: -97.7431, timezone: "America/Chicago" },
  { name: "Plano", country: "United States", lat: 33.0198, lon: -96.6989, timezone: "America/Chicago" },
  { name: "Sugar Land", country: "United States", lat: 29.6197, lon: -95.6349, timezone: "America/Chicago" },
  { name: "Seattle", country: "United States", lat: 47.6062, lon: -122.3321, timezone: "America/Los_Angeles" },
  { name: "Atlanta", country: "United States", lat: 33.749, lon: -84.388, timezone: "America/New_York" },
  { name: "Boston", country: "United States", lat: 42.3601, lon: -71.0589, timezone: "America/New_York" },
  { name: "Washington DC", country: "United States", lat: 38.9072, lon: -77.0369, timezone: "America/New_York" },
  { name: "Edison", country: "United States", lat: 40.5187, lon: -74.4121, timezone: "America/New_York" },
  { name: "Jersey City", country: "United States", lat: 40.7178, lon: -74.0431, timezone: "America/New_York" },
  { name: "Philadelphia", country: "United States", lat: 39.9526, lon: -75.1652, timezone: "America/New_York" },
  { name: "Detroit", country: "United States", lat: 42.3314, lon: -83.0458, timezone: "America/Detroit" },
  { name: "Troy", country: "United States", lat: 42.6064, lon: -83.1498, timezone: "America/Detroit" },
  { name: "South Lyon", country: "United States", lat: 42.4606, lon: -83.6519, timezone: "America/Detroit" },
  { name: "Phoenix", country: "United States", lat: 33.4484, lon: -112.074, timezone: "America/Phoenix" },
  { name: "Denver", country: "United States", lat: 39.7392, lon: -104.9903, timezone: "America/Denver" },
  { name: "Las Vegas", country: "United States", lat: 36.1699, lon: -115.1398, timezone: "America/Los_Angeles" },
  { name: "Portland", country: "United States", lat: 45.5051, lon: -122.675, timezone: "America/Los_Angeles" },
  { name: "Minneapolis", country: "United States", lat: 44.9778, lon: -93.265, timezone: "America/Chicago" },
  { name: "Columbus", country: "United States", lat: 39.9612, lon: -82.9988, timezone: "America/New_York" },
  { name: "Charlotte", country: "United States", lat: 35.2271, lon: -80.8431, timezone: "America/New_York" },
  { name: "Naperville", country: "United States", lat: 41.7508, lon: -88.1535, timezone: "America/Chicago" },
  { name: "Indianapolis", country: "United States", lat: 39.7684, lon: -86.1581, timezone: "America/Indiana/Indianapolis" },
  { name: "Tampa", country: "United States", lat: 27.9506, lon: -82.4572, timezone: "America/New_York" },
  { name: "Miami", country: "United States", lat: 25.7617, lon: -80.1918, timezone: "America/New_York" },
  { name: "Raleigh", country: "United States", lat: 35.7796, lon: -78.6382, timezone: "America/New_York" },
  { name: "Fremont", country: "United States", lat: 37.5485, lon: -121.9886, timezone: "America/Los_Angeles" },
  { name: "Sunnyvale", country: "United States", lat: 37.3688, lon: -122.0363, timezone: "America/Los_Angeles" },
  { name: "Cupertino", country: "United States", lat: 37.3229, lon: -122.032, timezone: "America/Los_Angeles" },
  { name: "San Diego", country: "United States", lat: 32.7157, lon: -117.1611, timezone: "America/Los_Angeles" },
  { name: "Sacramento", country: "United States", lat: 38.5816, lon: -121.4944, timezone: "America/Los_Angeles" },
  { name: "Irvine", country: "United States", lat: 33.6846, lon: -117.8265, timezone: "America/Los_Angeles" },
  { name: "Chandler", country: "United States", lat: 33.3062, lon: -111.8413, timezone: "America/Phoenix" },
  { name: "Scottsdale", country: "United States", lat: 33.4942, lon: -111.9261, timezone: "America/Phoenix" },
  { name: "Herndon", country: "United States", lat: 38.9696, lon: -77.3861, timezone: "America/New_York" },
  { name: "Baltimore", country: "United States", lat: 39.2904, lon: -76.6122, timezone: "America/New_York" },
  { name: "Virginia Beach", country: "United States", lat: 36.8529, lon: -75.978, timezone: "America/New_York" },
  { name: "Richmond", country: "United States", lat: 37.5407, lon: -77.436, timezone: "America/New_York" },
  { name: "Pittsburgh", country: "United States", lat: 40.4406, lon: -79.9959, timezone: "America/New_York" },
  { name: "Orlando", country: "United States", lat: 28.5383, lon: -81.3792, timezone: "America/New_York" },
  { name: "Jacksonville", country: "United States", lat: 30.3322, lon: -81.6557, timezone: "America/New_York" },
  { name: "Nashville", country: "United States", lat: 36.1627, lon: -86.7816, timezone: "America/Chicago" },
  { name: "Kansas City", country: "United States", lat: 39.0997, lon: -94.5786, timezone: "America/Chicago" },
  { name: "St. Louis", country: "United States", lat: 38.627, lon: -90.1994, timezone: "America/Chicago" },
  { name: "Oklahoma City", country: "United States", lat: 35.4676, lon: -97.5164, timezone: "America/Chicago" },
  { name: "Milwaukee", country: "United States", lat: 43.0389, lon: -87.9065, timezone: "America/Chicago" },
  { name: "Schaumburg", country: "United States", lat: 42.0334, lon: -88.0834, timezone: "America/Chicago" },
  { name: "Cincinnati", country: "United States", lat: 39.1031, lon: -84.512, timezone: "America/New_York" },
  { name: "Cleveland", country: "United States", lat: 41.4993, lon: -81.6944, timezone: "America/New_York" },
  { name: "Hartford", country: "United States", lat: 41.7637, lon: -72.6851, timezone: "America/New_York" },
  { name: "New Orleans", country: "United States", lat: 29.9511, lon: -90.0715, timezone: "America/Chicago" },
  { name: "Salt Lake City", country: "United States", lat: 40.7608, lon: -111.891, timezone: "America/Denver" },
  { name: "Tucson", country: "United States", lat: 32.2226, lon: -110.9747, timezone: "America/Phoenix" },
  // Canada
  { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, timezone: "America/Toronto" },
  { name: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207, timezone: "America/Vancouver" },
  { name: "Calgary", country: "Canada", lat: 51.0447, lon: -114.0719, timezone: "America/Edmonton" },
  // UK
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, timezone: "Europe/London" },
  { name: "Birmingham", country: "United Kingdom", lat: 52.4862, lon: -1.8904, timezone: "Europe/London" },
  // Australia
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney" },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631, timezone: "Australia/Melbourne" },
  // UAE
  { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai" },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773, timezone: "Asia/Dubai" },
  // Other
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, timezone: "Asia/Singapore" },
  { name: "Kathmandu", country: "Nepal", lat: 27.7172, lon: 85.324, timezone: "Asia/Kathmandu" },
  { name: "Colombo", country: "Sri Lanka", lat: 6.9271, lon: 79.8612, timezone: "Asia/Colombo" },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lon: 101.6869, timezone: "Asia/Kuala_Lumpur" },
];

export interface DayPanchang {
  date: Date;
  tithi: string;
  tithiStart?: string;
  tithiEnd?: string;
  tithiStartDate?: Date;   // raw Date so callers can format with cross-day awareness
  tithiEndDate?: Date;
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
  yamagandaKalam: string;
  gulikaKalam: string;
  abhijitMuhurta: string;
  vikramSamvat: number;
  shakaSamvat: number;
  ayana: string;
  ritu: string;
  weekdayName: string;
  sunsign: string;
  moonsign: string;
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

// --- Planetary positions ---
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
  { name: "Surya", nameEn: "Sun", symbol: "☀️", epochLon: 280.460, dailyMotion: 0.9856474 },
  { name: "Chandra", nameEn: "Moon", symbol: "🌙", epochLon: 218.316, dailyMotion: 13.176396 },
  { name: "Mangal", nameEn: "Mars", symbol: "♂", epochLon: 355.433, dailyMotion: 0.5240207766 },
  { name: "Budha", nameEn: "Mercury", symbol: "☿", epochLon: 252.251, dailyMotion: 4.092317 },
  { name: "Guru", nameEn: "Jupiter", symbol: "♃", epochLon: 34.396, dailyMotion: 0.0830853 },
  { name: "Shukra", nameEn: "Venus", symbol: "♀", epochLon: 181.979, dailyMotion: 1.6021302 },
  { name: "Shani", nameEn: "Saturn", symbol: "♄", epochLon: 50.0774, dailyMotion: 0.0334442 },
  { name: "Rahu", nameEn: "N. Node", symbol: "☊", epochLon: 125.0445, dailyMotion: -0.0529539 },
];

export function getPlanetaryPositions(date: Date): PlanetPosition[] {
  const d = (date.getTime() - new Date("2000-01-01T12:00:00Z").getTime()) / 86400000;
  const ayanamsa = 23.85; // Lahiri ayanamsa ~2026

  return PLANET_DATA.map((planet) => {
    const tropicalLon = ((planet.epochLon + planet.dailyMotion * d) % 360 + 360) % 360;
    const siderealLon = ((tropicalLon - ayanamsa) % 360 + 360) % 360;
    const signIndex = Math.floor(siderealLon / 30);
    const degInSign = siderealLon - signIndex * 30;
    // Simple retrograde approximation: outer planets slow down & reverse based on synodic period
    let isRetrograde = false;
    if (planet.name === "Shani") isRetrograde = (Math.sin((d / 378) * 2 * Math.PI) < -0.7);
    if (planet.name === "Guru") isRetrograde = (Math.sin((d / 398) * 2 * Math.PI) < -0.7);
    if (planet.name === "Mangal") isRetrograde = (Math.sin((d / 780) * 2 * Math.PI) < -0.85);

    return {
      name: planet.name,
      nameEn: planet.nameEn,
      symbol: planet.symbol,
      longitude: siderealLon,
      zodiacSign: ZODIAC_NAMES[signIndex] ?? "N/A",
      zodiacEn: ZODIAC_ENGLISH[signIndex] ?? "N/A",
      degInSign,
      isRetrograde,
    };
  });
}

// --- Upcoming festivals ---
export function getUpcomingFestivals(from: Date, count = 8): { dateStr: string; names: string[]; daysLeft: number }[] {
  const fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const result: { dateStr: string; names: string[]; daysLeft: number }[] = [];

  for (const [dateStr, names] of Object.entries(FESTIVALS_BY_DATE)) {
    const festDate = new Date(dateStr + "T00:00:00");
    const daysLeft = Math.round((festDate.getTime() - fromTime) / 86400000);
    if (daysLeft >= 0) {
      result.push({ dateStr, names, daysLeft });
    }
  }
  result.sort((a, b) => a.daysLeft - b.daysLeft);
  return result.slice(0, count);
}

// --- Helper time functions ---

// Reliable time formatter: manually applies UTC offset so it works in any browser
// timezone and sandboxed iframe environment (no Intl timezone support required).
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

// Fallback that still tries Intl, used when we have a timezone string but no offset
function formatTime(date: Date | null | undefined, timezone: string): string {
  if (!date) return "N/A";
  // First attempt: manual offset (always works regardless of browser environment)
  try {
    const offsetMin = getTimezoneOffsetMinutes(date, timezone);
    return formatTimeWithOffset(date, offsetMin);
  } catch { /* fall through */ }
  // Last resort: Intl (may ignore timezone in some sandboxed environments)
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timezone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    }).format(date);
  }
}

function getMuhurtaTime(
  date: Date, sunrise: Date | null, sunset: Date | null,
  slots: number[], timezone: string
): string {
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

function getRahuKalam(date: Date, sunrise: Date | null, sunset: Date | null, timezone?: string): string {
  // Slot 1-8, indexed by day: Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3
  const rahuSlots = [8, 2, 7, 5, 6, 4, 3];
  return getMuhurtaTime(date, sunrise, sunset, rahuSlots, timezone ?? "UTC");
}

function getYamaganda(date: Date, sunrise: Date | null, sunset: Date | null, timezone: string): string {
  // Sun=5, Mon=4, Tue=3, Wed=2, Thu=7, Fri=6, Sat=1
  const yamaSlots = [5, 4, 3, 2, 7, 6, 1];
  return getMuhurtaTime(date, sunrise, sunset, yamaSlots, timezone);
}

function getGulika(date: Date, sunrise: Date | null, sunset: Date | null, timezone: string): string {
  // Sun=7, Mon=6, Tue=5, Wed=4, Thu=3, Fri=2, Sat=1
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

// --- Vedic calendar helpers ---
function getVikramSamvat(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // VS new year around Chaitra Shukla Pratipada (~March 20-April 10)
  if (month > 4 || (month === 4 && day > 15) || (month === 3 && day >= 20)) {
    return year + 57;
  }
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
  if ((month === 1 && day >= 14) || (month >= 2 && month <= 6) || (month === 7 && day <= 16)) {
    return "Uttarayana";
  }
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

// --- Name helpers ---
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
  return NAKSHATRA_NAMES[Math.floor(nakshatraNum) % 27] || "N/A";
}

function getYogaName(yogaNum: number | undefined): string {
  if (yogaNum === undefined || yogaNum === null) return "N/A";
  return YOGA_NAMES[Math.floor(yogaNum) % 27] || "N/A";
}

function getKaranaName(karanaNum: number | undefined): string {
  if (karanaNum === undefined || karanaNum === null) return "N/A";
  return KARANA_NAMES[Math.floor(karanaNum) % 11] || "N/A";
}

// --- Festival data ---
export const FESTIVALS_BY_DATE: Record<string, string[]> = {
  // 2025
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
  "2025-09-02": ["Onam"],
  "2025-10-02": ["Navratri Begins"],
  "2025-10-12": ["Dussehra (Vijaya Dashami)"],
  "2025-10-20": ["Diwali (Lakshmi Puja)"],
  "2025-10-22": ["Govardhan Puja"],
  "2025-10-23": ["Bhai Dooj"],
  "2025-11-05": ["Chhath Puja"],
  "2025-11-15": ["Dev Uthani Ekadashi"],
  "2025-12-25": ["Christmas"],
  // 2026 — verified via Drik Panchang (Adhika Maas: May 17–Jun 15 shifts all later festivals ~20 days)
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
  "2026-09-17": ["Onam"],
  "2026-10-11": ["Navratri Begins"],
  "2026-10-21": ["Dussehra (Vijaya Dashami)"],
  "2026-10-29": ["Karva Chauth"],
  "2026-11-07": ["Dhanteras"],
  "2026-11-08": ["Diwali (Lakshmi Puja)"],
  "2026-11-09": ["Govardhan Puja"],
  "2026-11-10": ["Bhai Dooj"],
  "2026-11-13": ["Chhath Puja"],
  "2026-11-22": ["Dev Uthani Ekadashi"],
  "2026-12-25": ["Christmas"],
  // 2027
  "2027-01-14": ["Makar Sankranti", "Pongal"],
  "2027-02-01": ["Vasant Panchami"],
  "2027-02-26": ["Maha Shivaratri"],
  "2027-03-22": ["Holika Dahan"],
  "2027-03-23": ["Holi"],
  "2027-04-08": ["Ugadi", "Gudi Padwa"],
  "2027-04-10": ["Ram Navami"],
  "2027-04-15": ["Tamil New Year", "Vishu", "Baisakhi"],
  "2027-04-20": ["Hanuman Jayanti"],
  "2027-04-28": ["Akshaya Tritiya"],
  "2027-06-20": ["Vat Savitri"],
  "2027-07-25": ["Guru Purnima"],
  "2027-07-07": ["Rath Yatra"],
  "2027-08-24": ["Naga Panchami"],
  "2027-08-27": ["Raksha Bandhan"],
  "2027-09-25": ["Krishna Janmashtami"],
  "2027-10-05": ["Ganesh Chaturthi"],
  "2027-10-07": ["Onam"],
  "2027-10-30": ["Navratri Begins"],
  "2027-11-08": ["Dussehra (Vijaya Dashami)"],
  "2027-11-16": ["Karva Chauth"],
  "2027-11-27": ["Diwali (Lakshmi Puja)"],
  "2027-11-28": ["Govardhan Puja"],
  "2027-11-29": ["Bhai Dooj"],
  "2027-12-13": ["Chhath Puja"],
  "2027-12-25": ["Christmas"],
};

export function getFestivalsForDate(date: Date): string[] {
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return FESTIVALS_BY_DATE[key] || [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractValue(obj: any, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const val = obj?.[key];
    if (val !== undefined && val !== null) {
      if (typeof val === "number") return val;
      if (typeof val === "object" && typeof val.index === "number") return val.index;
    }
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDate(obj: any, ...keys: string[]): Date | null {
  for (const key of keys) {
    const val = obj?.[key];
    if (val) {
      try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d;
      } catch { /* ignore */ }
    }
  }
  return null;
}

function buildExtraFields(
  date: Date, city: City,
  sunriseDate: Date | null, sunsetDate: Date | null,
  sunLon: number, moonLon: number,
  ayanamsa: number
) {
  const vikramSamvat = getVikramSamvat(date);
  const shakaSamvat = getShakaSamvat(date);
  const ayana = getAyana(date);
  const ritu = getRitu(date);
  const weekdayName = SANSKRIT_WEEKDAYS[date.getDay()];
  const sunsignData = getSiderealZodiac(sunLon, ayanamsa);
  const moonsignData = getSiderealZodiac(moonLon, ayanamsa);
  const abhijitMuhurta = getAbhijitMuhurta(sunriseDate, sunsetDate, city.timezone);
  const yamagandaKalam = getYamaganda(date, sunriseDate, sunsetDate, city.timezone);
  const gulikaKalam = getGulika(date, sunriseDate, sunsetDate, city.timezone);

  return {
    vikramSamvat,
    shakaSamvat,
    ayana,
    ritu,
    weekdayName,
    sunsign: `${sunsignData.sign} (${sunsignData.signEn})`,
    moonsign: `${moonsignData.sign} (${moonsignData.signEn})`,
    abhijitMuhurta,
    yamagandaKalam,
    gulikaKalam,
  };
}

// --- Main computation ---
export async function computeDayPanchang(date: Date, city: City): Promise<DayPanchang> {
  const festivals = getFestivalsForDate(date);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Panchangam = (window as any).Panchangam;
    if (!Panchangam) throw new Error("Library not loaded");

    const { Observer, getPanchangam } = Panchangam;
    if (!Observer || !getPanchangam) throw new Error("API not found");

    const observer = new Observer(city.lat, city.lon, 0);
    const result = await getPanchangam(date, observer);
    if (!result) throw new Error("No result");

    const tithiNum = extractValue(result, "tithi", "Tithi");
    const nakshatraNum = extractValue(result, "nakshatra", "Nakshatra");
    const yogaNum = extractValue(result, "yoga", "Yoga");
    const karanaNum = extractValue(result, "karana", "Karana");

    const tithi = getTithiName(tithiNum);
    const nakshatra = getNakshatraName(nakshatraNum);
    const yoga = getYogaName(yogaNum);
    const karana = getKaranaName(karanaNum);
    const paksha = getPaksha(tithiNum);

    const sunriseDate = extractDate(result, "sunrise", "Sunrise");
    const sunsetDate = extractDate(result, "sunset", "Sunset");
    const moonriseDate = extractDate(result, "moonrise", "Moonrise");
    const moonsetDate = extractDate(result, "moonset", "Moonset");

    // Use suncalc for accurate sun fallback + moon times when library doesn't provide them
    const sc = getSuncalcTimes(date, city.lat, city.lon, city.timezone);
    const usedSunrise = sunriseDate ?? sc.sunriseDate;
    const usedSunset  = sunsetDate  ?? sc.sunsetDate;
    const usedMoonrise = moonriseDate ?? sc.moonriseDate;
    const usedMoonset  = moonsetDate  ?? sc.moonsetDate;

    const d = (date.getTime() - new Date("2000-01-01T12:00:00Z").getTime()) / 86400000;
    const sunLon = ((280.460 + 0.9856474 * d) % 360 + 360) % 360;
    const moonLon = ((218.316 + 13.176396 * d) % 360 + 360) % 360;
    const primaryAyanamsa = getLahiriAyanamsa(2451545.0 + d);

    const extra = buildExtraFields(date, city, usedSunrise, usedSunset, sunLon, moonLon, primaryAyanamsa);

    let tithiEnd: string | undefined;
    const tithiEndDate = extractDate(result?.tithi, "end", "endTime") ?? extractDate(result, "tithiEnd");
    if (tithiEndDate) tithiEnd = formatTime(tithiEndDate, city.timezone);

    let nakshatraEnd: string | undefined;
    const nakshatraEndDate = extractDate(result?.nakshatra, "end", "endTime") ?? extractDate(result, "nakshatraEnd");
    if (nakshatraEndDate) nakshatraEnd = formatTime(nakshatraEndDate, city.timezone);

    return {
      date, tithi, tithiEnd, nakshatra, nakshatraEnd, yoga, karana, paksha,
      sunrise:  formatTime(usedSunrise,  city.timezone),
      sunset:   formatTime(usedSunset,   city.timezone),
      moonrise: formatTime(usedMoonrise, city.timezone),
      moonset:  formatTime(usedMoonset,  city.timezone),
      rahuKalam: getRahuKalam(date, usedSunrise, usedSunset, city.timezone),
      ...extra, festivals, loading: false,
    };
  } catch {
    return computeFallbackPanchang(date, city, festivals);
  }
}

function computeFallbackPanchang(date: Date, city: City, festivals: string[]): DayPanchang {
  // Resolve UTC offset so we evaluate positions at ~6 AM local time (near sunrise),
  // matching the Vedic convention that the day's tithi is the one prevailing at sunrise.
  const utcOffsetMin  = getTimezoneOffsetMinutes(date, city.timezone);
  const utcOffsetHours = utcOffsetMin / 60;

  // Accurate sidereal positions using Meeus Ch. 47 (Moon) & Ch. 25 (Sun)
  const { moonSid, sunSid, jd } = computeSiderealPositions(date, utcOffsetHours);
  const ayanamsa = getLahiriAyanamsa(jd);

  // Restore tropical longitudes for buildExtraFields (which calls getSiderealZodiac internally)
  const moonTrop = mod360(moonSid + ayanamsa);
  const sunTrop  = mod360(sunSid  + ayanamsa);

  // ── Panchang elements (all computed from sidereal frame) ──
  const elongation   = mod360(moonSid - sunSid);
  const tithiNum     = Math.floor(elongation / 12);         // 0-29
  const nakshatraNum = Math.floor(moonSid / (360 / 27));    // 0-26
  const yogaLon      = mod360(moonSid + sunSid);
  const yogaNum      = Math.floor(yogaLon / (360 / 27));    // 0-26
  const _karanaIdx = Math.floor(elongation / 6);            // 0-59
  const karanaName = (() => {
    if (_karanaIdx === 0) return "Kimstughna";
    if (_karanaIdx >= 57) return ["Shakuni", "Chatushpada", "Naga"][_karanaIdx - 57];
    const rep = ["Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti"];
    return rep[(_karanaIdx - 1) % 7];
  })();
  const paksha       = tithiNum < 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";

  const { sunriseDate, sunsetDate, moonriseDate, moonsetDate } = getSuncalcTimes(date, city.lat, city.lon, city.timezone);
  const extra = buildExtraFields(date, city, sunriseDate, sunsetDate, sunTrop, moonTrop, ayanamsa);

  // Compute exact tithi start/end times via binary search
  const { tithiStart: tithiStartDate, tithiEnd: tithiEndDate } = computeTithiWindow(date, utcOffsetHours);

  return {
    date,
    tithi:         TITHI_NAMES[tithiNum % 15]         || "Pratipada",
    tithiStart:    formatTime(tithiStartDate, city.timezone),
    tithiEnd:      formatTime(tithiEndDate,   city.timezone),
    tithiStartDate,
    tithiEndDate,
    nakshatra: NAKSHATRA_NAMES[nakshatraNum % 27] || "Ashwini",
    yoga:     YOGA_NAMES[yogaNum % 27]            || "Vishkambha",
    karana:   karanaName,
    paksha,
    sunrise:  formatTime(sunriseDate,   city.timezone),
    sunset:   formatTime(sunsetDate,    city.timezone),
    moonrise: formatTime(moonriseDate,  city.timezone),
    moonset:  formatTime(moonsetDate,   city.timezone),
    rahuKalam: getRahuKalam(date, sunriseDate, sunsetDate, city.timezone),
    ...extra, festivals, loading: false,
  };
}

// --- Astronomical helpers ---

/**
 * Uses SunCalc (accurate to ±1 min) for sunrise/sunset/moonrise/moonset.
 * Falls back to the refraction-corrected formula if SunCalc throws.
 * SunCalc internally uses VSOP87-grade algorithms and standard 90°50' zenith.
 */
function getSuncalcTimes(date: Date, lat: number, lon: number, timezone: string): {
  sunriseDate: Date | null; sunsetDate: Date | null;
  moonriseDate: Date | null; moonsetDate: Date | null;
} {
  try {
    // Use noon UTC on the given date so SunCalc picks the right calendar day
    const noon = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));
    const sunTimes  = SunCalc.getTimes(noon, lat, lon) as Record<string, Date>;
    const moonTimes = SunCalc.getMoonTimes(noon, lat, lon) as { rise?: Date; set?: Date };
    const isValid = (d: unknown): d is Date => d instanceof Date && isFinite(d.getTime());
    return {
      sunriseDate:  isValid(sunTimes.sunrise)  ? sunTimes.sunrise  : null,
      sunsetDate:   isValid(sunTimes.sunset)   ? sunTimes.sunset   : null,
      moonriseDate: isValid(moonTimes.rise)    ? moonTimes.rise    : null,
      moonsetDate:  isValid(moonTimes.set)     ? moonTimes.set     : null,
    };
  } catch {
    // Fallback: our refraction-corrected formula (zenith 90°50'), no moon times
    return { ...approximateSunriseSunsetDates(date, lat, lon, timezone), moonriseDate: null, moonsetDate: null };
  }
}

/** Fallback when SunCalc is unavailable — refraction-corrected solar formula (±2 min) */
function approximateSunriseSunsetDates(date: Date, lat: number, lon: number, timezone: string): { sunriseDate: Date | null; sunsetDate: Date | null } {
  try {
    const utcOffsetMin = getTimezoneOffsetMinutes(date, timezone);
    const utcOffsetHours = utcOffsetMin / 60;
    const doy = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const B = (360 / 365) * (doy - 81) * (Math.PI / 180);
    const ET = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const declination = 23.45 * Math.sin(B) * (Math.PI / 180);
    const latRad = lat * (Math.PI / 180);
    // Zenith = 90°50' — standard astronomical sunrise (refraction + solar disc)
    const ZENITH_RAD = 90.8333 * (Math.PI / 180);
    const cosHA = (Math.cos(ZENITH_RAD) - Math.sin(latRad) * Math.sin(declination))
                / (Math.cos(latRad) * Math.cos(declination));
    if (cosHA < -1 || cosHA > 1) return { sunriseDate: null, sunsetDate: null };
    const hourAngle = Math.acos(cosHA) * (180 / Math.PI);
    const solarNoon = 12 + utcOffsetHours - lon / 15 - ET / 60;
    const sunriseHour = solarNoon - hourAngle / 15;
    const sunsetHour  = solarNoon + hourAngle / 15;
    const baseMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const utcOffsetMs = utcOffsetMin * 60000;
    return {
      sunriseDate: new Date(baseMs + sunriseHour * 3600000 - utcOffsetMs),
      sunsetDate:  new Date(baseMs + sunsetHour  * 3600000 - utcOffsetMs),
    };
  } catch {
    return { sunriseDate: null, sunsetDate: null };
  }
}

function getTimezoneOffsetMinutes(date: Date, timezone: string): number {
  try {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / 60000;
  } catch {
    console.warn(`[Om Panchang] Invalid timezone string: "${timezone}" — falling back to UTC. Check CITIES list for typos.`);
    return 0;
  }
}
