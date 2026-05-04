import { useState, useEffect, useCallback, useRef } from "react";
import { CITIES, City, DayPanchang, computeDayPanchang, getFestivalsForDate, cityToSlug } from "@/lib/panchangData";
import { monthToSlug } from "@/lib/calendarUtils";
import { CalendarLang, LANG_LABELS, LANG_CYCLE, translateTithi, translateNakshatra } from "@/lib/i18n";
import ReferenceSection from "@/components/ReferenceSection";
import VedicClock from "@/components/VedicClock";
import TodayDeity from "@/components/TodayDeity";
import PlanetaryPositions from "@/components/PlanetaryPositions";
import UpcomingFestivals from "@/components/UpcomingFestivals";
import FestivalGuidesGrid from "@/components/FestivalGuidesGrid";
import TrendingBlogBanner from "@/components/TrendingBlogBanner";
import FindTempleCard from "@/components/FindTempleCard";
import SubscribeCard from "@/components/SubscribeCard";
import HoroscopeWidget from "@/components/HoroscopeWidget";
import KundaliSection from "@/components/KundaliSection";
import KundaliMilanSection from "@/components/KundaliMilanSection";
import BabyNamesSection from "@/components/BabyNamesSection";
import ChoghadiyaWidget from "@/components/ChoghadiyaWidget";
import ChoghadiyaSection from "@/components/ChoghadiyaSection";
import HoraSection from "@/components/HoraSection";
import { getUtcOffsetHours } from "@/lib/choghadiya";
import MuhuratCalculator from "@/components/MuhuratCalculator";
import VratCalendarSection from "@/components/VratCalendarSection";
import SeoContent from "@/components/SeoContent";
import ShareBar from "@/components/ShareBar";
import SpiritualInsights from "@/components/SpiritualInsights";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventCountdown from "@/components/EventCountdown";
import { getCanonicalUrl } from "@/lib/canonical";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Format a UTC Date as a short local time string (e.g. "8:22 AM")
function fmtLocalTime(d: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz,
    }).format(d);
  } catch { return ""; }
}

// Build a compact "start → end" label for a calendar cell.
// Adds "↑" when the end time falls on the following calendar day.
function tithiWindowLabel(p: DayPanchang, calDate: Date, tz: string): string {
  if (!p.tithiStartDate || !p.tithiEndDate) return "";
  const calMidnightUTC = Date.UTC(calDate.getFullYear(), calDate.getMonth(), calDate.getDate());
  const endIsNextDay   = p.tithiEndDate.getTime()   >= calMidnightUTC + 86_400_000;
  const startLabel = fmtLocalTime(p.tithiStartDate, tz);
  const endLabel   = fmtLocalTime(p.tithiEndDate,   tz) + (endIsNextDay ? "↑" : "");
  return `${startLabel} – ${endLabel}`;
}

interface RashiInfo {
  index: number;
  name: string;
  english: string;
  symbol: string;
  lord: string;
  element: string;
  quality: string;
  description: string;
  traits: string[];
}

const RASHI_DATA: RashiInfo[] = [
  { index: 1, name: "Mesha", english: "Aries", symbol: "♈", lord: "Mangal (Mars)", element: "Fire (Agni)", quality: "Movable (Chara)", description: "Mesha is the first rashi, symbolizing new beginnings, courage, and raw energy. Ruled by Mangal (Mars), it bestows a pioneering, fearless spirit. Those with a strong Mesha influence are natural leaders who act decisively and thrive on challenges. The ram charges forward without hesitation.", traits: ["Courageous and pioneering", "Impulsive and action-oriented", "Natural leader", "Competitive and energetic", "Can be impatient or aggressive"] },
  { index: 2, name: "Vrishabha", english: "Taurus", symbol: "♉", lord: "Shukra (Venus)", element: "Earth (Prithvi)", quality: "Fixed (Sthira)", description: "Vrishabha is ruled by Shukra (Venus), bestowing a love of beauty, comfort, and sensory pleasures. The bull is steady, patient, and immovable once rooted. Vrishabha natives excel in accumulating wealth and creating beautiful, stable environments. They are deeply loyal but can be stubborn.", traits: ["Patient and reliable", "Love of luxury and comfort", "Strong material instincts", "Stubborn but devoted", "Artistic and sensual"] },
  { index: 3, name: "Mithuna", english: "Gemini", symbol: "♊", lord: "Budha (Mercury)", element: "Air (Vayu)", quality: "Dual (Dwiswabhava)", description: "Mithuna, ruled by Budha (Mercury), represents duality, communication, and intellectual curiosity. The twins embody the ability to see multiple sides of every situation. Mithuna natives are witty, adaptable, and excellent communicators — but can be scattered or inconsistent.", traits: ["Quick-witted and communicative", "Curious and adaptable", "Sociable and charming", "Can be indecisive or superficial", "Excellent with language and writing"] },
  { index: 4, name: "Karka", english: "Cancer", symbol: "♋", lord: "Chandra (Moon)", element: "Water (Jala)", quality: "Movable (Chara)", description: "Karka is ruled by Chandra (Moon), making it the most emotionally sensitive and nurturing rashi. The crab carries its home on its back — symbolizing the deep attachment to home, family, and roots. Karka natives are intuitive, protective, and deeply empathetic.", traits: ["Deeply nurturing and protective", "Emotionally sensitive and intuitive", "Strong attachment to home and family", "Can be moody or clingy", "Excellent memory and imagination"] },
  { index: 5, name: "Simha", english: "Leo", symbol: "♌", lord: "Surya (Sun)", element: "Fire (Agni)", quality: "Fixed (Sthira)", description: "Simha is ruled by Surya (Sun), the king of the planets, bestowing natural authority, dignity, and a desire to shine. The lion is the king of the jungle — proud, generous, and commanding. Simha natives are natural performers and leaders who radiate warmth and confidence.", traits: ["Natural leader and performer", "Generous and magnanimous", "Proud and dignified", "Creative and dramatic", "Can be arrogant or attention-seeking"] },
  { index: 6, name: "Kanya", english: "Virgo", symbol: "♍", lord: "Budha (Mercury)", element: "Earth (Prithvi)", quality: "Dual (Dwiswabhava)", description: "Kanya, the maiden, is ruled by Budha (Mercury) and represents discernment, service, and attention to detail. Kanya natives have sharp analytical minds and a desire to be of practical service. They excel in fields requiring precision — medicine, science, accounting, and editing.", traits: ["Analytical and detail-oriented", "Service-minded and helpful", "Health-conscious and practical", "Can be critical or overly perfectionist", "Excellent at organization and analysis"] },
  { index: 7, name: "Tula", english: "Libra", symbol: "♎", lord: "Shukra (Venus)", element: "Air (Vayu)", quality: "Movable (Chara)", description: "Tula, the scales, is ruled by Shukra (Venus) and represents balance, justice, and harmonious relationships. Tula natives are natural diplomats who seek fairness and beauty in all things. They excel in law, art, and partnerships. The challenge is decisiveness — the scales always weigh both sides.", traits: ["Diplomatic and fair-minded", "Charming and sociable", "Love of beauty and harmony", "Can be indecisive or overly people-pleasing", "Excellent in partnerships and negotiations"] },
  { index: 8, name: "Vrishchika", english: "Scorpio", symbol: "♏", lord: "Mangal (Mars)", element: "Water (Jala)", quality: "Fixed (Sthira)", description: "Vrishchika is ruled by Mangal (Mars) and represents intensity, transformation, and penetrating insight. The scorpion strikes precisely and powerfully. Vrishchika natives are deeply perceptive, passionate, and capable of profound transformation. They are drawn to mysteries, occult knowledge, and hidden truths.", traits: ["Intense and perceptive", "Deeply passionate and loyal", "Access to occult and hidden knowledge", "Capable of profound transformation", "Can be secretive, jealous, or vengeful"] },
  { index: 9, name: "Dhanu", english: "Sagittarius", symbol: "♐", lord: "Guru (Jupiter)", element: "Fire (Agni)", quality: "Dual (Dwiswabhava)", description: "Dhanu, the archer, is ruled by Guru (Jupiter) and represents wisdom, philosophy, and the aspiration for higher truth. The archer aims for distant horizons. Dhanu natives are optimistic, truth-seeking, and love travel, philosophy, and religious study. They are the teachers and explorers of the zodiac.", traits: ["Optimistic and philosophical", "Love of travel and exploration", "Truth-seeking and ethical", "Generous and enthusiastic", "Can be blunt, restless, or overconfident"] },
  { index: 10, name: "Makara", english: "Capricorn", symbol: "♑", lord: "Shani (Saturn)", element: "Earth (Prithvi)", quality: "Movable (Chara)", description: "Makara is ruled by Shani (Saturn) and represents discipline, ambition, and the mastery achieved through sustained effort. The sea-goat climbs steadily to the mountaintop. Makara natives are patient, responsible, and achieve great success through hard work and perseverance.", traits: ["Disciplined and ambitious", "Patient and persistent", "Responsible and dutiful", "Practical and career-oriented", "Can be overly serious or controlling"] },
  { index: 11, name: "Kumbha", english: "Aquarius", symbol: "♒", lord: "Shani (Saturn)", element: "Air (Vayu)", quality: "Fixed (Sthira)", description: "Kumbha, the water-bearer, is ruled by Shani (Saturn) and represents humanitarianism, innovation, and universal ideals. The water-bearer pours wisdom upon the world. Kumbha natives are visionary, independent, and committed to social progress. They see beyond the individual to the collective.", traits: ["Visionary and humanitarian", "Intellectually independent", "Innovative and unconventional", "Friendly yet detached", "Can be rebellious or emotionally aloof"] },
  { index: 12, name: "Meena", english: "Pisces", symbol: "♓", lord: "Guru (Jupiter)", element: "Water (Jala)", quality: "Dual (Dwiswabhava)", description: "Meena, the fish, is ruled by Guru (Jupiter) and represents compassion, imagination, and spiritual dissolution. The two fish swim in opposite directions — between the material and spiritual worlds. Meena natives are deeply empathetic, artistic, and spiritually gifted, but can lose themselves in illusion or escapism.", traits: ["Deeply compassionate and empathetic", "Artistic and imaginative", "Spiritually sensitive", "Intuitive and psychic", "Can be escapist, boundary-less, or easily influenced"] },
];

function RashiModal({ info, onClose }: { info: RashiInfo; onClose: () => void }) {
  const elementColors: Record<string, string> = {
    "Fire (Agni)": "bg-orange-50 border-orange-200 text-orange-700",
    "Earth (Prithvi)": "bg-green-50 border-green-200 text-green-700",
    "Air (Vayu)": "bg-sky-50 border-sky-200 text-sky-700",
    "Water (Jala)": "bg-blue-50 border-blue-200 text-blue-700",
  };
  const elClass = elementColors[info.element] ?? "bg-indigo-50 border-indigo-200 text-indigo-700";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="panchang-gradient px-6 py-4 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-lg font-bold px-2 py-0.5 rounded-full">{info.symbol}</span>
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">Rashi {info.index}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{info.name}</h2>
              <p className="text-indigo-200 text-sm mt-0.5">{info.english} · Ruled by {info.lord}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none ml-4 mt-1">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-center">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Lord</p>
              <p className="text-sm font-bold text-stone-800">{info.lord.split(" ")[0]}</p>
            </div>
            <div className={`rounded-xl p-3 border text-center ${elClass}`}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1">Element</p>
              <p className="text-sm font-bold">{info.element.split(" ")[0]}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-center">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Quality</p>
              <p className="text-sm font-bold text-stone-800">{info.quality.split(" ")[0]}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
              <span className="text-indigo-500">📖</span> About {info.name} ({info.english})
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">{info.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
              <span className="text-indigo-500">✨</span> Key Traits
            </h3>
            <ul className="space-y-1.5">
              {info.traits.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

type ActiveTab = "home" | "panchang" | "muhurat" | "festivals" | "planets" | "guide" | "kundali" | "milan" | "muhurtacalc" | "babynames" | "hora" | "blog";

interface CalendarDay {
  date: Date;
  panchang: DayPanchang | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-8 gap-3">
      <div className="w-8 h-8 rounded-full border-[3px] border-indigo-100 border-t-indigo-500 animate-spin" />
      <span className="text-indigo-600 text-sm font-medium">Computing Panchang…</span>
    </div>
  );
}

function SectionHeader({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/70 border-b border-indigo-100">
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">{title}</p>
        {sub && <p className="text-xs text-indigo-400">{sub}</p>}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, sub, highlight, subPrefix = "until" }: {
  icon: string; label: string; value: string; sub?: string; highlight?: boolean; subPrefix?: string;
}) {
  return (
    <div className={`flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-b-0 ${highlight ? "bg-amber-50/50" : ""}`}>
      <span className="text-base leading-none mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{subPrefix ? `${subPrefix} ` : ""}{sub}</p>}
      </div>
    </div>
  );
}

// Searchable city selector with Nominatim geocoding fallback
function CitySearchSelect({ value, onChange }: { value: City; onChange: (city: City) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [extraCities, setExtraCities] = useState<City[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCities = [...CITIES, ...extraCities];
  const q = query.toLowerCase();
  const filtered = q.length > 0
    ? allCities.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    : allCities;

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); }
    }
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);

  async function searchOnline() {
    if (query.length < 2 || searching) return;
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6`;
      const data = await fetch(url, { headers: { "Accept-Language": "en" } }).then(r => r.json());
      const newCities: City[] = [];
      for (const r of data) {
        const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
        const a = r.address ?? {};
        const name = a.city ?? a.town ?? a.village ?? a.county ?? r.display_name.split(",")[0].trim();
        const country = a.country ?? "";
        let timezone = "UTC";
        try {
          const tzData = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&timezone=auto&forecast_days=0&hourly=temperature_2m`).then(r => r.json());
          timezone = tzData.timezone ?? "UTC";
        } catch { timezone = "UTC"; }
        newCities.push({ name, country, lat, lon, timezone });
      }
      if (newCities.length > 0) {
        setExtraCities(prev => {
          const names = new Set(prev.map(c => c.name));
          return [...prev, ...newCities.filter(c => !names.has(c.name))];
        });
        onChange(newCities[0]);
        setOpen(false);
        setQuery("");
      }
    } catch { /* silently fail */ }
    setSearching(false);
  }

  async function useMyLocation() {
    if (!navigator.geolocation) { setGeoError("Geolocation not supported by your browser"); return; }
    setGeolocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        let name = "My Location";
        let country = "";
        let timezone = "UTC";
        try {
          // Reverse geocode with Nominatim
          const revData = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat.toFixed(5)}&lon=${lon.toFixed(5)}&format=json`,
            { headers: { "Accept-Language": "en" } }
          ).then(r => r.json());
          const a = revData.address ?? {};
          name = a.city ?? a.town ?? a.village ?? a.county ?? a.state ?? "My Location";
          country = a.country ?? "";
        } catch { /* use fallback name */ }
        try {
          const tzData = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&timezone=auto&forecast_days=0&hourly=temperature_2m`
          ).then(r => r.json());
          timezone = tzData.timezone ?? "UTC";
        } catch { /* use UTC fallback */ }
        const city: City = { name, country, lat, lon, timezone };
        setExtraCities(prev => [...prev.filter(c => c.name !== name), city]);
        onChange(city);
        setOpen(false);
        setQuery("");
        setGeolocating(false);
      },
      (err) => {
        setGeoError(err.code === 1 ? "Location permission denied" : "Could not get location");
        setGeolocating(false);
      },
      { timeout: 10000 }
    );
  }

  const groups: Record<string, City[]> = {};
  for (const c of filtered) {
    if (!groups[c.country]) groups[c.country] = [];
    groups[c.country].push(c);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); setGeoError(""); setTimeout(() => inputRef.current?.focus(), 60); }}
        className="flex items-center gap-1.5 pl-3 pr-3 py-2 rounded-xl bg-white/15 border border-white/30 text-white text-sm font-medium
                   focus:outline-none focus:ring-2 focus:ring-white/40 hover:bg-white/25 transition backdrop-blur-sm"
      >
        <span>📍</span>
        <span className="max-w-[120px] truncate">{value.name}</span>
        <span className="text-white/60 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-indigo-100 z-50 overflow-hidden">
          {/* Use My Location button */}
          <div className="p-2 border-b border-indigo-50">
            <button
              onMouseDown={useMyLocation}
              disabled={geolocating}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition text-sm text-white font-medium"
            >
              {geolocating
                ? <><span className="animate-spin inline-block">◌</span> Detecting location…</>
                : <><span>📍</span> Use My Location</>}
            </button>
            {geoError && <p className="text-xs text-rose-500 text-center mt-1">{geoError}</p>}
          </div>

          <div className="p-2 border-b border-indigo-50">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search any city…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") searchOnline(); }}
                className="w-full px-3 py-2 pr-8 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && q.length > 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No local match — try "Search globally" below</p>
            ) : (
              Object.entries(groups).map(([country, cities]) => (
                <div key={country}>
                  <p className="px-3 py-1 text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-50/60 sticky top-0">{country}</p>
                  {cities.map(city => (
                    <button
                      key={city.name}
                      onMouseDown={() => { onChange(city); setOpen(false); setQuery(""); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition flex items-center justify-between ${city.name === value.name ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-700"}`}
                    >
                      <span>{city.name}</span>
                      {city.name === value.name && <span className="text-indigo-500 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {query.length >= 2 && (
            <div className="border-t border-indigo-50 p-2">
              <button
                onMouseDown={searchOnline}
                disabled={searching}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition text-sm text-white font-medium"
              >
                {searching ? <><span className="animate-spin inline-block">◌</span> Searching…</> : <><span>🌐</span> Search "{query}" globally</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type CalendarVariant =
  | "default" | "hindu" | "telugu"
  | "vedic-astrology" | "hindu-astrology"
  | "kundali" | "kundali-milan"
  | "marriage-muhurat" | "panchang-today"
  | "hindu-festivals" | "nakshatra-today" | "rahu-kalam-today"
  | "baby-names-nakshatra" | "choghadiya-today"
  | "ekadashi-dates" | "amavasya-dates" | "purnima-dates" | "pradosh-vrat"
  | "hora-today" | "brahma-muhurta";

const VARIANT_CONFIG: Record<CalendarVariant, {
  title: string; heading: string; sub: string; description: string; defaultTab: ActiveTab;
}> = {
  default: {
    title:      "Om Panchang – Hindu Calendar & Vedic Almanac",
    heading:    "Om Panchang",
    sub:        "Hindu Calendar & Vedic Almanac",
    description: "Free Hindu Panchang and Vedic almanac for {city}. Today's Tithi, Nakshatra, Yoga, sunrise, sunset, Rahu Kalam, festivals, Choghadiya and Muhurta — all computed for your local timezone.",
    defaultTab: "home",
  },
  hindu: {
    title:      "Hindu Calendar {year} – {city} | Om Panchang",
    heading:    "Hindu Calendar",
    sub:        "Panchang, Tithi, Nakshatra & Festivals",
    description: "Hindu Calendar {year} for {city} with daily Tithi, Nakshatra, Yoga, festivals, Ekadashi and full Vikram Samvat / Shaka Samvat dates. Free, accurate and location-aware.",
    defaultTab: "home",
  },
  telugu: {
    title:      "Telugu Calendar {year} – {city} | Om Panchang",
    heading:    "Telugu Calendar",
    sub:        "తెలుగు పంచాంగం · Panchang, Tithi & Festivals",
    description: "Telugu Calendar (Telugu Panchangam) {year} for {city}. Daily Tithi, Nakshatra, Karana and major Telugu festivals like Ugadi, Sankranti and Karthika Masam — accurate for your city.",
    defaultTab: "home",
  },
  "vedic-astrology": {
    title:      "Vedic Astrology {year} – {city} | Om Panchang",
    heading:    "Vedic Astrology",
    sub:        "Jyotish · Planets, Kundali & Panchang",
    description: "Free Vedic Astrology (Jyotish) for {city}: live Navagraha planetary positions, Kundali calculator, Nakshatra, Rashi and daily Panchang using Lahiri Ayanamsa.",
    defaultTab: "home",
  },
  "hindu-astrology": {
    title:      "Hindu Astrology {year} – {city} | Om Panchang",
    heading:    "Hindu Astrology",
    sub:        "Kundali, Nakshatra, Planets & Festivals",
    description: "Hindu Astrology {year} for {city}. Free Kundali, Nakshatra and planetary positions plus daily Tithi and festivals — built on the same Drik + Lahiri standard used by Indian almanacs.",
    defaultTab: "home",
  },
  kundali: {
    title:      "Kundali Calculator – Free Vedic Birth Chart | Om Panchang",
    heading:    "Kundali Calculator",
    sub:        "Free Vedic Birth Chart & Jyotish Analysis",
    description: "Free Kundali Calculator (Janma Kundali / Vedic birth chart). Enter your birth date, time and place — get planetary positions, Lagna, Rashi, Nakshatra and dasha periods instantly.",
    defaultTab: "kundali",
  },
  "kundali-milan": {
    title:      "Kundali Milan – Free Horoscope Matching | Om Panchang",
    heading:    "Kundali Milan",
    sub:        "Free Hindu Marriage Compatibility Matching",
    description: "Free Kundali Milan (Gun Milan / Ashtakoot horoscope matching) for marriage compatibility. Get out-of-36 compatibility score, Mangal Dosha check and Nakshatra koota analysis.",
    defaultTab: "milan",
  },
  "marriage-muhurat": {
    title:      "Marriage Muhurat {year} – Shubh Wedding Dates | Om Panchang",
    heading:    "Marriage Muhurat",
    sub:        "Auspicious Wedding Dates & Shubh Muhurat {year}",
    description: "Marriage Muhurat {year} — auspicious Hindu wedding dates and Shubh Vivaha Muhurat times for {city}. Filtered by Tithi, Nakshatra, Yoga and avoidance of Rahu Kalam and Bhadra Karana.",
    defaultTab: "muhurtacalc",
  },
  "panchang-today": {
    title:      "Panchang Today – {city} | Om Panchang",
    heading:    "Panchang Today",
    sub:        "Today's Tithi, Nakshatra, Yoga & Karana",
    description: "Today's Panchang for {city}: Tithi, Nakshatra, Yoga, Karana, Vara, sunrise, sunset, Rahu Kalam, Abhijit Muhurta and Choghadiya — accurate to your local timezone.",
    defaultTab: "panchang",
  },
  "hindu-festivals": {
    title:      "Hindu Festivals {year} – Calendar & Dates | Om Panchang",
    heading:    "Hindu Festivals {year}",
    sub:        "Complete List of Hindu Festivals & Holidays",
    description: "Complete list of Hindu festivals {year} with accurate dates — Diwali, Holi, Navratri, Janmashtami, Raksha Bandhan, Ganesh Chaturthi and more. Localised to {city}.",
    defaultTab: "festivals",
  },
  "nakshatra-today": {
    title:      "Nakshatra Today – {city} | Om Panchang",
    heading:    "Nakshatra Today",
    sub:        "Today's Lunar Mansion & Star Sign",
    description: "Today's Nakshatra (lunar mansion) for {city} with start and end times. Find which of the 27 Nakshatras the Moon transits today and what activities it favours.",
    defaultTab: "panchang",
  },
  "rahu-kalam-today": {
    title:      "Rahu Kalam Today – {city} | Om Panchang",
    heading:    "Rahu Kalam Today",
    sub:        "Today's Rahu Kalam, Yamagandam & Gulika",
    description: "Today's Rahu Kalam, Yamagandam and Gulika Kalam timings for {city}. Know the inauspicious periods to avoid for important activities — calculated from your local sunrise.",
    defaultTab: "panchang",
  },
  "baby-names-nakshatra": {
    title:      "Hindu Baby Names by Nakshatra – Find Auspicious Name | Om Panchang",
    heading:    "Baby Name Finder",
    sub:        "Hindu Names by Janma Nakshatra & Starting Syllable",
    description: "Find auspicious Hindu baby names by Janma Nakshatra and starting syllable (Naamakshar). Boy and girl names with meanings, organised by all 27 Nakshatras and 108 padas.",
    defaultTab: "babynames",
  },
  "choghadiya-today": {
    title:      "Choghadiya Today {year} – {city} | Auspicious Time | Om Panchang",
    heading:    "Choghadiya Today",
    sub:        "Auspicious & Inauspicious Time Slots for {city}",
    description: "Today's Choghadiya for {city} — day and night auspicious time slots (Amrit, Shubh, Labh, Char) and inauspicious slots (Rog, Kaal, Udveg) with live current slot indicator.",
    defaultTab: "panchang",
  },
  "ekadashi-dates": {
    title:      "Ekadashi {year} – All 24 Fasting Dates | Om Panchang",
    heading:    "Ekadashi Dates {year}",
    sub:        "Complete list of all Ekadashi fasting days",
    description: "All Ekadashi fasting dates for {year} with names, vrat start time and parana (fast-breaking) windows for {city}. Includes Mokshada, Vaikuntha, Devshayani Ekadashi and more.",
    defaultTab: "festivals",
  },
  "amavasya-dates": {
    title:      "Amavasya Dates {year} – New Moon Calendar | Om Panchang",
    heading:    "Amavasya Dates {year}",
    sub:        "All new moon days for ancestor rituals & Pitru Tarpan",
    description: "Amavasya (new moon) dates for {year} with start and end times for {city}. Used for Pitru Tarpan, Shradh and ancestor worship — includes Mahalaya and Somvati Amavasya.",
    defaultTab: "festivals",
  },
  "purnima-dates": {
    title:      "Purnima Dates {year} – Full Moon Calendar | Om Panchang",
    heading:    "Purnima Dates {year}",
    sub:        "All full moon days and their Hindu significance",
    description: "Purnima (full moon) dates for {year} for {city}. Includes Guru Purnima, Sharad Purnima, Kartik Purnima, Buddha Purnima with vrat windows and Hindu significance.",
    defaultTab: "festivals",
  },
  "pradosh-vrat": {
    title:      "Pradosh Vrat {year} – Dates & Timings | Om Panchang",
    heading:    "Pradosh Vrat {year}",
    sub:        "All Pradosh Vrat dates for Shiva worship",
    description: "Pradosh Vrat {year} dates with sunset-based puja timings for {city}. Bi-monthly Lord Shiva fast — Soma Pradosh, Bhauma Pradosh, Shani Pradosh — all listed with day-of-week.",
    defaultTab: "festivals",
  },
  "hora-today": {
    title:      "Hora Today – Planetary Hours for {city} | Om Panchang",
    heading:    "Hora Today",
    sub:        "Vedic Planetary Hours for {city}",
    description: "Today's Hora (Vedic planetary hours) for {city}. See the ruling planet of every hour — Surya, Chandra, Mangal, Budha, Guru, Shukra, Shani — and the activities each Hora favours.",
    defaultTab: "hora",
  },
  "brahma-muhurta": {
    title:      "Brahma Muhurta Today – {city} | Om Panchang",
    heading:    "Brahma Muhurta",
    sub:        "Today's Brahma Muhurta timing for {city}",
    description: "Today's Brahma Muhurta timing for {city} — the 96-minute window before sunrise that the Vedas, Ayurveda and Yoga regard as the most spiritually beneficial period of the day.",
    defaultTab: "panchang",
  },
};

function FestivalsSubTabs({ variant }: { variant: CalendarVariant }) {
  const defaultView = (
    variant === "ekadashi-dates" ? "vrat" :
    variant === "amavasya-dates" ? "vrat" :
    variant === "purnima-dates" ? "vrat" :
    variant === "pradosh-vrat" ? "vrat" :
    variant === "hindu-festivals" ? "festivals" : "festivals"
  ) as "festivals" | "vrat";

  const defaultFilter = (
    variant === "ekadashi-dates" ? "ekadashi" :
    variant === "amavasya-dates" ? "amavasya" :
    variant === "purnima-dates" ? "purnima" :
    variant === "pradosh-vrat" ? "pradosh" : "all"
  ) as "all" | "ekadashi" | "amavasya" | "purnima" | "pradosh" | "sankashti";

  const [view, setView] = useState<"festivals" | "vrat">(defaultView);

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setView("festivals")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            view === "festivals"
              ? "bg-indigo-600 text-white shadow"
              : "bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          }`}
        >
          🎉 Festivals
        </button>
        <button
          onClick={() => setView("vrat")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            view === "vrat"
              ? "bg-indigo-600 text-white shadow"
              : "bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          }`}
        >
          🌙 Vrat / Fasting Dates
        </button>
      </div>
      {view === "festivals"
        ? <div className="space-y-4">
            <FestivalGuidesGrid />
            <UpcomingFestivals today={new Date()} count={50} />
          </div>
        : <VratCalendarSection defaultFilter={defaultFilter} />
      }
    </>
  );
}

export default function PanchangPage({ variant = "default", initialCity }: { variant?: CalendarVariant; initialCity?: City }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [activeTab, setActiveTab] = useState<ActiveTab>(VARIANT_CONFIG[variant].defaultTab);
  const [selectedCity, setSelectedCity] = useState<City>(initialCity ?? CITIES[0]);
  const [selectedRashi, setSelectedRashi] = useState<RashiInfo | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date(today));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));
  const [selectedPanchang, setSelectedPanchang] = useState<DayPanchang | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [lang, setLang] = useState<CalendarLang>(
    () => (localStorage.getItem("panchang-lang") as CalendarLang) || "en"
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("panchang-dark") === "1"
  );
  const panchangCacheRef = useRef<Map<string, DayPanchang>>(new Map());

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("panchang-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const cycleLang = () => {
    const next = LANG_CYCLE[(LANG_CYCLE.indexOf(lang) + 1) % LANG_CYCLE.length];
    setLang(next);
    localStorage.setItem("panchang-lang", next);
  };

  const tTithi     = (name: string) => translateTithi(name, lang);
  const tNakshatra = (name: string) => translateNakshatra(name, lang);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Panchangam) { setLibraryLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@ishubhamx/panchangam-js@2.2.6/dist/index.min.js";
    script.async = true;
    script.onload = () => setLibraryLoaded(true);
    script.onerror = () => setLibraryLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Update browser tab title and meta description whenever city or year changes
  useEffect(() => {
    const cfg = VARIANT_CONFIG[variant];
    const year = viewDate.getFullYear();
    const title = cfg.title
      .replace("{city}", selectedCity.name)
      .replace("{year}", String(year));
    document.title = title;
    const description = cfg.description
      .replace(/\{city\}/g, selectedCity.name)
      .replace(/\{year\}/g, String(year));
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [variant, selectedCity.name, viewDate]);

  const getCacheKey = (date: Date, cityName: string) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${cityName}`;

  const computeAndCache = useCallback(async (date: Date, city: City): Promise<DayPanchang> => {
    const key = getCacheKey(date, city.name);
    if (panchangCacheRef.current.has(key)) return panchangCacheRef.current.get(key)!;
    const result = await computeDayPanchang(date, city);
    panchangCacheRef.current.set(key, result);
    return result;
  }, []);

  const buildCalendar = useCallback(async (year: number, month: number, city: City, selDate: Date) => {
    setIsLoadingMonth(true);
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - startDay.getDay());
    const endDay = new Date(lastDay);
    endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

    const days: CalendarDay[] = [];
    const cur = new Date(startDay);
    while (cur <= endDay) {
      const d = new Date(cur);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d, panchang: null,
        isCurrentMonth: d.getMonth() === month,
        isToday: d.getTime() === today.getTime(),
        isSelected: d.getTime() === selDate.getTime(),
      });
      cur.setDate(cur.getDate() + 1);
    }
    setCalendarDays([...days]);

    const currentMonthDays = days.filter(d => d.isCurrentMonth);
    const batchSize = 5;
    for (let i = 0; i < currentMonthDays.length; i += batchSize) {
      const batch = currentMonthDays.slice(i, i + batchSize);
      await Promise.all(batch.map(async (day) => {
        try { day.panchang = await computeAndCache(day.date, city); } catch { /* skip */ }
      }));
      setCalendarDays(prev => [...prev]);
    }
    setIsLoadingMonth(false);
  }, [computeAndCache, today]);

  // Use selectedCity.name (string) for safe comparison in dependencies
  useEffect(() => {
    if (!libraryLoaded) return;
    panchangCacheRef.current.clear();
    buildCalendar(viewDate.getFullYear(), viewDate.getMonth(), selectedCity, selectedDate).catch(() => {
      setIsLoadingMonth(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryLoaded, viewDate.getFullYear(), viewDate.getMonth(), selectedCity.name]);

  useEffect(() => {
    if (!libraryLoaded) return;
    setIsLoadingSidebar(true);
    computeAndCache(selectedDate, selectedCity)
      .then(r => { setSelectedPanchang(r); setIsLoadingSidebar(false); })
      .catch(() => setIsLoadingSidebar(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryLoaded, selectedDate.getTime(), selectedCity.name]);

  const handleCityChange = (city: City) => {
    panchangCacheRef.current.clear();
    setSelectedCity(city);
    // Update the URL to reflect the new city — keeps the current variant segment
    const segments = window.location.pathname.split("/").filter(Boolean);
    const variantSegment = segments.length >= 1 ? segments[0] : "panchang";
    const slug = cityToSlug(city.name);
    window.history.pushState({ city: city.name }, "", `/${variantSegment}/${slug}`);
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setCalendarDays(prev => prev.map(d => ({ ...d, isSelected: d.date.getTime() === day.date.getTime() })));
    if (!day.isCurrentMonth) setViewDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    if (activeTab === "home") setActiveTab("panchang");
  };

  const goToToday = () => {
    const t = new Date(today);
    setSelectedDate(t); setViewDate(t);
    setCalendarDays(prev => prev.map(d => ({ ...d, isSelected: d.date.getTime() === t.getTime() })));
  };

  const selectedDateFormatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(selectedDate);

  const selectedFestivals = getFestivalsForDate(selectedDate);
  const sp = selectedPanchang;

  const TABS: { id: ActiveTab | "calendar-nav"; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "panchang", label: "Panchang", icon: "📿" },
    { id: "calendar-nav", label: "Calendar", icon: "📅" },
    { id: "muhurat", label: "Muhurat", icon: "⏰" },
    { id: "festivals", label: "Festivals", icon: "🎉" },
    { id: "planets", label: "Planets", icon: "🪐" },
    { id: "guide", label: "Guide", icon: "📖" },
    { id: "kundali", label: "Kundali", icon: "🔯" },
    { id: "milan", label: "Match", icon: "💑" },
    { id: "muhurtacalc", label: "Muhurta", icon: "✨" },
    { id: "babynames", label: "Baby Names", icon: "👶" },
    { id: "hora",      label: "Hora",       icon: "⏳" },
    { id: "blog",      label: "Blog",       icon: "📚" },
  ];

  function handleTabClick(id: ActiveTab | "calendar-nav") {
    if (id === "calendar-nav") {
      const slug = monthToSlug(viewDate.getMonth(), viewDate.getFullYear());
      const citySlug = cityToSlug(selectedCity.name);
      const url = `/panchang-calendar/${slug}/${citySlug}`;
      window.history.pushState({}, "", url);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else if (id === "blog") {
      window.history.pushState({}, "", "/blog");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      setActiveTab(id);
      // On mobile the header is sticky, so when the user has scrolled down and
      // taps a different tab, the new (often shorter) content swaps in below
      // their viewport — making it look like the tap did nothing. Scroll the
      // page back to the top so the new tab's content is always visible.
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    }
  }

  // Sidebar: common across tabs
  const Sidebar = (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
      <EventCountdown />
      <TodayDeity date={selectedDate} />
      <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
        <div className="panchang-gradient px-4 py-3">
          <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">Daily Panchang</p>
          <p className="text-white font-bold text-sm mt-0.5 leading-snug">{selectedDateFormatted}</p>
          <p className="text-indigo-300 text-xs mt-1">📍 {selectedCity.name}, {selectedCity.country}</p>
        </div>

        {selectedFestivals.length > 0 && (
          <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-100">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1.5">🎉 Today's Festivals</p>
            <div className="flex flex-wrap gap-1">
              {selectedFestivals.map((f, i) => (
                <span key={i} className="festival-badge text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">{f}</span>
              ))}
            </div>
          </div>
        )}

        {isLoadingSidebar ? <Spinner /> : sp ? (
          <>
            <SectionHeader icon="🌞" title="Astronomical Times" />
            <div className="px-4 py-1">
              <DetailRow icon="🌅" label="Sunrise" value={sp.sunrise} />
              <DetailRow icon="🌇" label="Sunset" value={sp.sunset} />
              <DetailRow icon="🌙" label="Moonrise" value={sp.moonrise} />
              <DetailRow icon="🌑" label="Moonset" value={sp.moonset} />
              <p className="text-[10px] text-indigo-400/60 mt-1 mb-0.5 leading-snug">
                Astronomical timings use standard refraction correction (±3–5 min variation possible)
              </p>
            </div>
            <SectionHeader icon="📿" title="Pancha Anga" sub="Five Elements" />
            <div className="px-4 py-1">
              <DetailRow icon="🌓" label="Tithi" value={tTithi(sp.tithi)}
                sub={sp.tithiStart && sp.tithiEnd ? `${sp.tithiStart} – ${sp.tithiEnd}` : sp.tithiEnd}
                subPrefix={sp.tithiStart && sp.tithiEnd ? "" : "until"}
              />
              <DetailRow icon="⭐" label="Nakshatra" value={tNakshatra(sp.nakshatra)} sub={sp.nakshatraEnd} />
              <DetailRow icon="🔯" label="Yoga" value={sp.yoga} />
              <DetailRow icon="☯️" label="Karana" value={sp.karana} />
              <DetailRow icon="🌊" label="Paksha" value={sp.paksha} />
              <DetailRow icon="📅" label="Vara" value={sp.weekdayName} />
            </div>
            <SectionHeader icon="📜" title="Vedic Calendar" />
            <div className="px-4 py-1">
              <DetailRow icon="🗓️" label="Vikram Samvat" value={String(sp.vikramSamvat)} />
              <DetailRow icon="📆" label="Shaka Samvat" value={String(sp.shakaSamvat)} />
              <DetailRow icon="🌤️" label="Ayana" value={sp.ayana} />
              <DetailRow icon="🍃" label="Ritu" value={sp.ritu} />
              <DetailRow icon="☀️" label="Sun Sign" value={sp.sunsign} />
              <DetailRow icon="🌙" label="Moon Sign" value={sp.moonsign} />
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 py-6 text-center">Select a date</p>
        )}
      </div>

      {sp && <VedicClock city={selectedCity} sunriseStr={sp.sunrise} sunsetStr={sp.sunset} />}

      <TodayDeity date={selectedDate} />
      <HoroscopeWidget />
      <SubscribeCard variant="sidebar" />
      <FindTempleCard variant="sidebar" />
    </aside>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #e8e8f8 50%, #f5f0ff 100%)" }}>
      {/* Header */}
      <header className="panchang-gradient shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === "/") {
                  setActiveTab("home");
                  window.scrollTo({ top: 0, behavior: "auto" });
                } else {
                  window.history.pushState({}, "", "/");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }
              }}
              title="Go to homepage"
              className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-90 transition group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-white/15 rounded-full flex items-center justify-center text-base sm:text-xl border border-white/20 group-hover:bg-white/25 transition">
                🕉️
              </div>
              <div className="min-w-0 text-left">
                <h1 className="text-base sm:text-xl font-bold text-white tracking-tight leading-tight truncate">
                  {VARIANT_CONFIG[variant].heading
                    .replace("{city}", selectedCity.name)
                    .replace("{year}", String(viewDate.getFullYear()))}
                </h1>
                <p className="text-indigo-200 text-xs hidden sm:block">
                  {VARIANT_CONFIG[variant].sub
                    .replace("{city}", selectedCity.name)
                    .replace("{year}", String(viewDate.getFullYear()))}
                </p>
              </div>
            </a>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Language cycle: EN → हि → తె */}
              <button
                onClick={cycleLang}
                title="Switch language for Tithi & Nakshatra names"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center"
              >
                {LANG_LABELS[lang]}
              </button>
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(d => !d)}
                title={darkMode ? "Switch to Light mode" : "Switch to Dark mode"}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-base sm:text-lg transition flex items-center justify-center"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <CitySearchSelect value={selectedCity} onChange={handleCityChange} />
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="flex flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                  className={`basis-[14.2857%] sm:basis-[7.6923%] flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-1 sm:px-2 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition min-w-0 select-none active:bg-white/15
                    ${activeTab === tab.id
                      ? "border-amber-400 text-amber-300 bg-white/10"
                      : tab.id === "calendar-nav"
                        ? "border-transparent text-amber-200/70 hover:text-amber-200 hover:bg-white/5"
                        : "border-transparent text-indigo-200 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <span className="text-base sm:text-sm">{tab.icon}</span>
                  <span className="text-[10px] sm:text-xs leading-tight">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <Breadcrumbs items={[
        { label: selectedCity.name, href: `/panchang-${cityToSlug(selectedCity.name)}` },
        { label: VARIANT_CONFIG[variant].heading.split(' {city}')[0] || "Panchang" }
      ]} />

      {/* ===== HOME TAB ===== */}
      {activeTab === "home" && (
        <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
          {Sidebar}
          <div className="flex-1 space-y-4">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); setViewDate(d); }}
                    className="w-8 h-8 rounded-full border border-indigo-200 text-indigo-500 hover:bg-indigo-50 flex items-center justify-center text-lg font-bold transition"
                  >‹</button>
                  <h2 className="text-lg font-bold text-slate-800 min-w-[180px] text-center">
                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </h2>
                  <button
                    onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); setViewDate(d); }}
                    className="w-8 h-8 rounded-full border border-indigo-200 text-indigo-500 hover:bg-indigo-50 flex items-center justify-center text-lg font-bold transition"
                  >›</button>
                </div>
                <button onClick={goToToday} className="px-4 py-1.5 panchang-gradient text-white text-xs font-bold rounded-full shadow-sm hover:opacity-90 transition">
                  Today
                </button>
              </div>
              <div className="grid grid-cols-7 border-b border-indigo-50">
                {WEEKDAYS.map((day, i) => (
                  <div key={day} className={`py-2 text-center text-xs font-bold uppercase tracking-wider ${i === 0 ? "text-rose-500" : i === 6 ? "text-indigo-400" : "text-slate-400"}`}>
                    {day}
                  </div>
                ))}
              </div>
              {isLoadingMonth && calendarDays.length === 0 && <div className="py-10"><Spinner /></div>}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                  const festivals = getFestivalsForDate(day.date);
                  const isSun = day.date.getDay() === 0;
                  const isSat = day.date.getDay() === 6;
                  return (
                    <div key={idx} onClick={() => handleDayClick(day)}
                      className={`relative border-b border-r border-indigo-50 cursor-pointer min-h-[90px] p-1.5 day-card-hover
                        ${!day.isCurrentMonth ? "opacity-40 bg-slate-50/30" : ""}
                        ${day.isSelected ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-inset z-10" : "hover:bg-indigo-50/60"}
                        ${day.isToday && !day.isSelected ? "bg-amber-50 ring-2 ring-amber-400 ring-inset" : ""}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                          ${day.isSelected ? "bg-white text-indigo-700" : ""}
                          ${day.isToday && !day.isSelected ? "bg-amber-400 text-white" : ""}
                          ${!day.isSelected && !day.isToday ? (isSun ? "text-rose-500" : isSat ? "text-indigo-400" : "text-slate-700") : ""}
                        `}>{day.date.getDate()}</span>
                        {festivals.length > 0 && <span className={`w-1.5 h-1.5 rounded-full ${day.isSelected ? "bg-amber-300" : "bg-rose-500"}`} />}
                      </div>
                      {day.isCurrentMonth && (
                        <div className="space-y-0.5">
                          {day.panchang ? (
                            <>
                              <p className={`text-xs font-semibold leading-tight truncate ${day.isSelected ? "text-indigo-100" : "text-indigo-700"}`}>{tTithi(day.panchang.tithi)}</p>
                              {(() => {
                                const lbl = tithiWindowLabel(day.panchang, day.date, selectedCity.timezone);
                                return lbl ? (
                                  <p className={`text-[9px] leading-tight truncate ${day.isSelected ? "text-indigo-200" : "text-indigo-400"}`} title={lbl}>{lbl}</p>
                                ) : null;
                              })()}
                              <p className={`text-[10px] leading-tight truncate hidden sm:block ${day.isSelected ? "text-indigo-200" : "text-slate-400"}`}>{tNakshatra(day.panchang.nakshatra)}</p>
                              {day.panchang.sunrise && day.panchang.sunset && (
                                <p className={`text-[8px] font-medium leading-tight truncate hidden lg:block ${day.isSelected ? "text-amber-200" : "text-orange-700"}`}>
                                  🌅{day.panchang.sunrise} 🌇{day.panchang.sunset}
                                </p>
                              )}
                            </>
                          ) : (
                            <div className={`h-2.5 rounded animate-pulse ${day.isSelected ? "bg-indigo-400" : "bg-indigo-100"}`} />
                          )}
                          {festivals.length > 0 && (
                            <p className={`text-[10px] font-semibold leading-tight truncate ${day.isSelected ? "text-amber-300" : "text-rose-600"}`}>🎉 {festivals[0]}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-2.5 border-t border-indigo-50 bg-indigo-50/30 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" /><span>Today</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-indigo-600" /><span>Selected</span></div>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /><span>Festival</span></div>
                <div className="flex items-center gap-1"><span className="text-indigo-400 font-bold">↑</span><span>Tithi ends next day</span></div>
                <button
                  onClick={() => handleTabClick("calendar-nav")}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 transition flex items-center gap-1"
                >
                  📅 Full Calendar →
                </button>
                <div className="ml-auto text-indigo-500 font-medium">🕉️ Based on {selectedCity.name}</div>
              </div>
            </div>
            {/* Choghadiya widget */}
            {sp && (
              <ChoghadiyaWidget
                date={selectedDate}
                sunrise={sp.sunrise}
                sunset={sp.sunset}
                utcOffsetHours={getUtcOffsetHours(selectedCity.timezone)}
                onViewAll={() => setActiveTab("panchang")}
              />
            )}

            {sp && <SpiritualInsights panchang={sp} />}
            
            {/* Planets + Festivals preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlanetaryPositions date={selectedDate} />
              <UpcomingFestivals today={today} onViewAll={() => setActiveTab("festivals")} />
            </div>

            {/* Trending blog banner — drives discovery of long-form content */}
            <TrendingBlogBanner />

            {sp && (
              <ShareBar 
                title={`Om Panchang - Today's Auspicious Timings (${selectedCity.name})`}
                summary={`📅 ${selectedDateFormatted}\n✨ View today's Tithi, Nakshatra, and Choghadiya timings on Om Panchang.`}
                url={getCanonicalUrl(window.location.pathname)}
              />
            )}
          </div>
        </main>
      )}

      {/* ===== PANCHANG TAB ===== */}
      {activeTab === "panchang" && (
        <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
          {Sidebar}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
              <div className="panchang-gradient px-5 py-4">
                <p className="text-indigo-200 text-xs uppercase tracking-widest font-semibold">Full Panchang Details</p>
                <p className="text-white font-bold text-lg mt-0.5">{selectedDateFormatted}</p>
                <p className="text-indigo-200 text-sm">📍 {selectedCity.name}, {selectedCity.country}</p>
              </div>
              {isLoadingSidebar ? <Spinner /> : sp ? (
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "🌅", label: "Sunrise", value: sp.sunrise },
                    { icon: "🌇", label: "Sunset", value: sp.sunset },
                    { icon: "🌙", label: "Moonrise", value: sp.moonrise },
                    { icon: "🌑", label: "Moonset", value: sp.moonset },
                    { icon: "🌓", label: "Tithi", value: tTithi(sp.tithi), sub: sp.tithiStart && sp.tithiEnd ? `${sp.tithiStart} – ${sp.tithiEnd}` : (sp.tithiEnd ? `Ends: ${sp.tithiEnd}` : undefined) },
                    { icon: "⭐", label: "Nakshatra", value: tNakshatra(sp.nakshatra), sub: sp.nakshatraEnd ? `Ends: ${sp.nakshatraEnd}` : undefined },
                    { icon: "🔯", label: "Yoga", value: sp.yoga },
                    { icon: "☯️", label: "Karana", value: sp.karana },
                    { icon: "🌊", label: "Paksha", value: sp.paksha },
                    { icon: "📅", label: "Vara (Sanskrit)", value: sp.weekdayName },
                    { icon: "🗓️", label: "Vikram Samvat", value: String(sp.vikramSamvat) },
                    { icon: "📆", label: "Shaka Samvat", value: String(sp.shakaSamvat) },
                    { icon: "🌤️", label: "Ayana", value: sp.ayana },
                    { icon: "🍃", label: "Ritu (Season)", value: sp.ritu },
                    { icon: "☀️", label: "Sun Sign (Rashi)", value: sp.sunsign },
                    { icon: "🌙", label: "Moon Sign (Rashi)", value: sp.moonsign },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.value}</p>
                        {item.sub && <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>}
                      </div>
                    </div>
                    ))}
                    </div>
                    ) : <p className="text-slate-400 text-sm text-center py-10">Loading panchang data…</p>}
                    </div>

                    {sp && <SpiritualInsights panchang={sp} />}

                    {sp && (
                    <ShareBar 
                    title={`Daily Panchang for ${selectedCity.name} - ${selectedDateFormatted}`}                        summary={`🪔 Tithi: ${translateTithi(sp.tithi, "en")}\n⭐ Nakshatra: ${translateNakshatra(sp.nakshatra, "en")}\n🌅 Sunrise: ${sp.sunrise} | 🌇 Sunset: ${sp.sunset}`}
                        url={getCanonicalUrl(window.location.pathname)}
                      />
                    )}
                    {/* Choghadiya full table */}
                    {sp && (
              <ChoghadiyaSection
                date={selectedDate}
                sunrise={sp.sunrise}
                sunset={sp.sunset}
                city={selectedCity.name}
                utcOffsetHours={getUtcOffsetHours(selectedCity.timezone)}
              />
            )}
          </div>
        </main>
      )}

      {/* ===== MUHURAT TAB ===== */}
      {activeTab === "muhurat" && (
        <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
          {Sidebar}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
              <div className="panchang-gradient px-5 py-4">
                <p className="text-indigo-200 text-xs uppercase tracking-widest font-semibold">Muhurta Timings</p>
                <p className="text-white font-bold text-lg mt-0.5">{selectedDateFormatted}</p>
              </div>
              {isLoadingSidebar ? <Spinner /> : sp ? (
                <div className="p-5 space-y-3">
                  {/* Auspicious */}
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">✨ Auspicious Times</p>
                    <div className="rounded-xl overflow-hidden border border-emerald-100">
                      {[
                        { icon: "✨", label: "Abhijit Muhurta", value: sp.abhijitMuhurta, desc: "The most auspicious time of the day — excellent for all new beginnings" },
                        { icon: "🌅", label: "Brahma Muhurta", value: sp.brahmaMuhurta, desc: "The creator's time — ideal for prayer, meditation and study" },
                      ].map((item, i) => (
                        <div key={item.label} className={`flex items-start gap-4 p-4 ${i > 0 ? "border-t border-emerald-50" : ""} bg-emerald-50/40`}>
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                            <p className="text-indigo-700 font-semibold text-sm mt-0.5">{item.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Inauspicious */}
                  <div>
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">⚠️ Inauspicious Times (Avoid for New Work)</p>
                    <div className="rounded-xl overflow-hidden border border-rose-100">
                      {[
                        { icon: "⚠️", label: "Rahu Kalam", value: sp.rahuKalam, desc: "Period ruled by Rahu — avoid starting new ventures" },
                        { icon: "☠️", label: "Yamaganda Kalam", value: sp.yamagandaKalam, desc: "Inauspicious period ruled by the Lord of Death" },
                        { icon: "🌀", label: "Gulika Kalam", value: sp.gulikaKalam, desc: "Period ruled by Gulika (Mandi) — unfavorable for new beginnings" },
                      ].map((item, i) => (
                        <div key={item.label} className={`flex items-start gap-4 p-4 ${i > 0 ? "border-t border-rose-50" : ""} bg-rose-50/30`}>
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                            <p className="text-rose-700 font-semibold text-sm mt-0.5">{item.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    <p className="font-bold mb-1">📌 Note</p>
                    <p className="text-xs leading-relaxed">All timings are calculated based on the local sunrise and sunset for {selectedCity.name}. Drik (observed) method is used for computation.</p>
                  </div>
                </div>
              ) : <p className="text-slate-400 text-sm text-center py-10">Select a date to view muhurtas</p>}
            </div>
          </div>
        </main>
      )}

      {/* ===== FESTIVALS TAB ===== */}
      {activeTab === "festivals" && (
        <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
          {Sidebar}
          <div className="flex-1 space-y-4">
            <Breadcrumbs items={[{ label: "Hindu Festivals" }]} />
            {/* Sub-tab toggle */}
            <FestivalsSubTabs variant={variant} />
          </div>
        </main>
      )}

      {/* ===== PLANETS TAB ===== */}
      {activeTab === "planets" && (
        <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
          {Sidebar}
          <div className="flex-1 space-y-4">
            <Breadcrumbs items={[{ label: "Planetary Positions" }]} />
            <PlanetaryPositions date={selectedDate} />
            <div className="bg-white rounded-2xl shadow-sm card-glow border border-indigo-100 p-5">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">🔭 About Vedic Astronomy</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                In Vedic Jyotish (astrology), planetary positions are calculated in the <strong>Sidereal (Nirayana) zodiac</strong> 
                using the Lahiri Ayanamsa to correct for the precession of equinoxes. The nine grahas 
                (Navagrahas) — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu — 
                are considered the key influencing celestial bodies. Their positions in the 12 rashis 
                (zodiac signs) determine auspicious periods, dashas, and life events in Vedic astrology.
              </p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {RASHI_DATA.map((rashi) => (
                  <button
                    key={rashi.index}
                    onClick={() => setSelectedRashi(rashi)}
                    className="group flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 hover:border-orange-300 border border-transparent rounded-lg px-2 py-1.5 text-indigo-700 font-medium transition text-left"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">{rashi.symbol}</span>
                    <span>{rashi.index}. {rashi.name} ({rashi.english})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ===== GUIDE TAB ===== */}
      {activeTab === "guide" && (
        <main className="max-w-7xl mx-auto px-4 py-5">
          <Breadcrumbs items={[{ label: "Vedic Guide" }]} />
          <ReferenceSection />
        </main>
      )}

      {/* ===== KUNDALI TAB ===== */}
      {activeTab === "kundali" && (
        <main className="max-w-7xl mx-auto px-4 py-5">
          <Breadcrumbs items={[{ label: "Kundali" }]} />
          <KundaliSection />
        </main>
      )}

      {/* ===== MILAN (MATCH) TAB ===== */}
      {activeTab === "milan" && (
        <main className="max-w-4xl mx-auto px-4 py-5">
          <Breadcrumbs items={[{ label: "Kundali Milan" }]} />
          <KundaliMilanSection />
        </main>
      )}

      {/* ===== MUHURTA CALCULATOR TAB ===== */}
      {activeTab === "muhurtacalc" && (
        <main className="max-w-4xl mx-auto px-4 py-5">
          <Breadcrumbs items={[{ label: "Muhurat Calculator" }]} />
          <MuhuratCalculator />
        </main>
      )}

      {/* ===== BABY NAMES TAB ===== */}
      {activeTab === "babynames" && (
        <main className="max-w-3xl mx-auto px-4 py-5">
          <Breadcrumbs items={[{ label: "Baby Names" }]} />
          <BabyNamesSection />
        </main>
      )}

      {/* ===== HORA TAB ===== */}
      {activeTab === "hora" && (
        <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
          <div className="flex-1 min-w-0">
            <Breadcrumbs items={[{ label: "Hora Timings" }]} />
            {sp ? (
              <HoraSection
                date={selectedDate}
                sunrise={sp.sunrise}
                sunset={sp.sunset}
                city={`${selectedCity.name}, ${selectedCity.country}`}
                utcOffsetHours={getUtcOffsetHours(selectedCity.timezone)}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400">
                Loading hora timings…
              </div>
            )}
          </div>
        </main>
      )}

      {/* SEO long-form content (variant-aware) */}
      <SeoContent variant={variant} />

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs border-t border-indigo-100 bg-white/60 mt-4">
        <p className="flex items-center justify-center gap-2 font-medium text-slate-500">
          <span>🕉️</span>
          <span>
            {VARIANT_CONFIG[variant].heading} · {VARIANT_CONFIG[variant].sub
              .replace("{city}", selectedCity.name)
              .replace("{year}", String(viewDate.getFullYear()))}
          </span>
          <span>🕉️</span>
        </p>
        <p className="mt-1">Astronomical calculations · Location-aware</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 text-indigo-400">
          <a href="/blog" className="hover:text-indigo-600 transition font-semibold">📖 Blog</a>
          <span>·</span>
          <a href="/about-us" className="hover:text-indigo-600 transition">About Us</a>
          <span>·</span>
          <a href="/disclaimer" className="hover:text-indigo-600 transition">Disclaimer</a>
          <span>·</span>
          <a href="/contact-us" className="hover:text-indigo-600 transition">Contact Us</a>
          <span>·</span>
          <a href="/privacy-policy" className="hover:text-indigo-600 transition">Privacy Policy</a>
        </div>

        {/* Popular Locations - Boosts Indexing of City Pages */}
        <div className="mt-8 pt-6 border-t border-indigo-50/50 max-w-5xl mx-auto px-4">
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-3">Popular Locations</p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            {[
              "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Varanasi",
              "New York", "London", "Chicago", "San Francisco", "Sydney", "Dubai", "Singapore", "Toronto", "Kuala Lumpur"
            ].map(cityName => {
              const city = CITIES.find(c => c.name === cityName);
              if (!city) return null;
              return (
                <a 
                  key={cityName} 
                  href={`/panchang-${cityToSlug(cityName)}`}
                  className="text-[10px] text-slate-400 hover:text-indigo-500 transition"
                >
                  {cityName}
                </a>
              );
            })}
          </div>
        </div>

        {/* Knowledge Hub - Boosts Authority for AdSense */}
        <div className="mt-6 pt-6 border-t border-indigo-50/50 max-w-5xl mx-auto px-4 pb-4">
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-3">Knowledge Hub</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <a href="/blog/hanuman-chalisa-meaning" className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium transition">Hanuman Chalisa</a>
            <a href="/blog/lord-krishna" className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium transition">Lord Krishna</a>
            <a href="/blog/lord-rama" className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium transition">Lord Rama</a>
            <a href="/blog/gayatri-mantra-meaning" className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium transition">Gayatri Mantra</a>
            <a href="/blog/goddess-lakshmi" className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium transition">Goddess Lakshmi</a>
            <a href="/blog/lord-surya" className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium transition">Lord Surya</a>
          </div>
        </div>
      </footer>

      {/* Rashi Modal */}
      {selectedRashi && (
        <RashiModal info={selectedRashi} onClose={() => setSelectedRashi(null)} />
      )}
    </div>
  );
}
