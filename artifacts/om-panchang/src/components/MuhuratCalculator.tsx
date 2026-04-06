import { useState, useCallback } from "react";
import { CITIES, NAKSHATRA_NAMES, YOGA_NAMES, TITHI_NAMES } from "@/lib/panchangData";

// ─── Event type definitions (Muhurta Chintamani + Brihat Samhita) ────────────
// Nakshatra indices: 0=Ashwini, 1=Bharani, 2=Krittika, 3=Rohini, 4=Mrigashira,
//   5=Ardra, 6=Punarvasu, 7=Pushya, 8=Ashlesha, 9=Magha, 10=Uttara Phalguni,
//   11=Hasta, 12=Chitra, 13=Swati, 14=Anuradha, 15=Jyeshtha, 16=Mula,
//   17=Purva Ashadha, 18=Uttara Ashadha, 19=Shravana, 20=Dhanishtha,
//   21=Shatabhisha, 22=Purva Bhadrapada, 23=Uttara Bhadrapada, 24=Revati
// Tithi indices 0-14 (Pratipada–Purnima, mod 15)
// Vara: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

const EVENT_TYPES = [
  {
    id: "wedding",
    label: "💍 Vivah",
    labelFull: "Vivah (Wedding)",
    desc: "Marriage & engagement ceremony",
    color: "rose",
    nakshatras: [3, 4, 9, 10, 11, 13, 14, 18, 23, 24],
    tithis: [1, 2, 4, 6, 9, 10, 12, 14],
    varas: [1, 3, 4, 5],
    note: "Rohini, Hasta, Uttara Phalguni are especially auspicious. Avoid Ashlesha, Jyeshtha, Mula, Bhadra periods.",
  },
  {
    id: "griha",
    label: "🏠 Griha Pravesh",
    labelFull: "Griha Pravesh (House Warming)",
    desc: "Moving into a new home",
    color: "emerald",
    nakshatras: [3, 4, 10, 11, 18, 19, 20, 23, 24],
    tithis: [1, 2, 4, 6, 9, 10, 11, 12],
    varas: [0, 1, 3, 4, 5],
    note: "Uttarayan (Jan–Jun) preferred. Shravana and Dhanishtha are especially powerful for entering a new home.",
  },
  {
    id: "business",
    label: "💼 Vyapar",
    labelFull: "Vyapar Arambha (Business Launch)",
    desc: "Starting a business or new venture",
    color: "amber",
    nakshatras: [0, 3, 7, 11, 12, 13, 24],
    tithis: [0, 1, 4, 5, 6, 9, 10, 11, 12],
    varas: [1, 3, 4, 5],
    note: "Pushya nakshatra is the most auspicious for business beginnings (Pushya Nakshatra Muhurta).",
  },
  {
    id: "travel",
    label: "✈️ Yatra",
    labelFull: "Yatra (Auspicious Travel)",
    desc: "Long journeys, relocation, international travel",
    color: "sky",
    nakshatras: [0, 4, 7, 11, 14, 24],
    tithis: [1, 2, 4, 6, 9, 10, 12],
    varas: [1, 3, 4, 5],
    note: "Avoid Tuesdays and Saturdays for long journeys. Anuradha nakshatra is the patron nakshatra of travelers.",
  },
] as const;

type EventId = (typeof EVENT_TYPES)[number]["id"];

// Inauspicious yogas (Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, Vaidhriti)
const INAUSPICIOUS_YOGAS = new Set([0, 5, 8, 9, 12, 14, 16, 18, 26]);

// Rahu Kaal slot index (0-based, out of 8 day-segments) by weekday [Sun..Sat]
const RAHU_SLOTS = [7, 1, 6, 4, 5, 3, 2];

const VARA_SA   = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"];
const VARA_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Astronomy helpers ───────────────────────────────────────────────────────
function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

function approxSunriseSunset(date: Date, lat: number): { sunrise: number; sunset: number } {
  const doy = dayOfYear(date);
  const declRad = (23.45 * Math.sin(((360 / 365) * (doy - 81)) * Math.PI / 180)) * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const cosHA = -Math.tan(latRad) * Math.tan(declRad);
  if (cosHA < -1 || cosHA > 1) return { sunrise: 6, sunset: 18 };
  const ha = Math.acos(cosHA) * (180 / Math.PI);
  return { sunrise: 12 - ha / 15, sunset: 12 + ha / 15 };
}

function formatHour(h: number): string {
  const hour = Math.floor(h);
  const min  = Math.round((h - hour) * 60);
  const ampm = hour >= 12 ? "PM" : "AM";
  const dh   = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${dh}:${String(min).padStart(2, "0")} ${ampm}`;
}

// ─── Day result type ─────────────────────────────────────────────────────────
interface DayResult {
  date: Date;
  dateLabel: string;
  score: number;
  nakIdx: number;
  nakshatra: string;
  tithiIdx: number;
  tithi: string;
  paksha: string;
  yogaIdx: number;
  yoga: string;
  vara: number;
  inauspiciousYoga: boolean;
  sunrise: number;
  rahuStart: number;
  rahuEnd: number;
  bestWindow: string;
}

function computeDay(date: Date, lat: number): DayResult {
  const MS_PER_DAY = 86400000;
  const J2000 = new Date("2000-01-01T12:00:00Z").getTime();
  const d = (date.getTime() - J2000) / MS_PER_DAY;

  const AYANAMSA = 23.85;
  const sunTrop  = ((280.460 + 0.9856474   * d) % 360 + 360) % 360;
  const moonTrop = ((218.316 + 13.176396   * d) % 360 + 360) % 360;
  const sunSid   = ((sunTrop  - AYANAMSA)  % 360 + 360) % 360;
  const moonSid  = ((moonTrop - AYANAMSA)  % 360 + 360) % 360;

  const nakIdx   = Math.floor(moonSid / (360 / 27)) % 27;
  const elongation = ((moonSid - sunSid) + 360) % 360;
  const tithiRaw = Math.floor(elongation / 12); // 0-29
  const yogaLon  = (moonSid + sunSid) % 360;
  const yogaIdx  = Math.floor(yogaLon / (360 / 27)) % 27;

  const nakshatra = NAKSHATRA_NAMES[nakIdx] ?? "?";
  const tithi     = TITHI_NAMES[tithiRaw % 15] ?? "?";
  const paksha    = tithiRaw < 15 ? "Shukla" : "Krishna";
  const yoga      = YOGA_NAMES[yogaIdx] ?? "?";
  const vara      = date.getDay();
  const inauspiciousYoga = INAUSPICIOUS_YOGAS.has(yogaIdx);

  const { sunrise, sunset } = approxSunriseSunset(date, lat);
  const segLen   = (sunset - sunrise) / 8;
  const rahuSlot = RAHU_SLOTS[vara];
  const rahuStart = sunrise + rahuSlot * segLen;
  const rahuEnd   = rahuStart + segLen;

  // Best morning window: 30 min after sunrise, ending before noon (skip Rahu Kaal)
  let winStart = sunrise + 0.5;
  let winEnd   = Math.min(12.0, winStart + 3);
  if (rahuStart < winEnd && rahuEnd > winStart) {
    winStart = rahuEnd + 0.25;
    winEnd   = Math.min(13.5, winStart + 2);
  }

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return {
    date, dateLabel, score: 0,
    nakIdx, nakshatra,
    tithiIdx: tithiRaw % 15, tithi, paksha,
    yogaIdx, yoga, vara, inauspiciousYoga,
    sunrise, rahuStart, rahuEnd,
    bestWindow: `${formatHour(winStart)} – ${formatHour(winEnd)}`,
  };
}

function scoreDay(day: DayResult, event: (typeof EVENT_TYPES)[number]): number {
  let s = 0;
  if ((event.nakshatras as readonly number[]).includes(day.nakIdx)) s += 3;
  if ((event.tithis    as readonly number[]).includes(day.tithiIdx)) s += 2;
  if ((event.varas     as readonly number[]).includes(day.vara))     s += 1;
  if (!day.inauspiciousYoga) s += 1;
  return s;
}

function getVerdict(score: number) {
  if (score >= 6) return { label: "Excellent", bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800", stars: "⭐⭐⭐" };
  if (score >= 4) return { label: "Good",      bg: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-700",    badge: "bg-blue-100 text-blue-800",    stars: "⭐⭐"  };
  return            { label: "Acceptable",     bg: "bg-amber-50",   border: "border-amber-300",   text: "text-amber-700",   badge: "bg-amber-100 text-amber-800",  stars: "⭐"   };
}

const EVENT_COLORS: Record<string, { bg: string; border: string; text: string; activeBg: string; activeBorder: string }> = {
  rose:    { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    activeBg: "bg-rose-50",    activeBorder: "border-rose-500"    },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", activeBg: "bg-emerald-50", activeBorder: "border-emerald-500" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   activeBg: "bg-amber-50",   activeBorder: "border-amber-500"   },
  sky:     { bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     activeBg: "bg-sky-50",     activeBorder: "border-sky-500"     },
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function MuhuratCalculator() {
  const today  = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const in45   = new Date(today.getTime() + 45 * 86400000).toISOString().slice(0, 10);

  const [eventId,   setEventId]   = useState<EventId>("wedding");
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate,   setEndDate]   = useState(in45);
  const [cityName,  setCityName]  = useState("New Delhi, India");
  const [results,   setResults]   = useState<DayResult[] | null>(null);
  const [computing, setComputing] = useState(false);
  const [error,     setError]     = useState("");

  const city  = CITIES.find(c => c.name === cityName) ?? CITIES[0];
  const event = EVENT_TYPES.find(e => e.id === eventId)!;
  const ec    = EVENT_COLORS[event.color];

  const calculate = useCallback(() => {
    setError(""); setResults(null); setComputing(true);
    setTimeout(() => {
      try {
        const start = new Date(startDate + "T00:00:00");
        const end   = new Date(endDate   + "T00:00:00");
        if (isNaN(start.getTime()) || isNaN(end.getTime())) { setError("Invalid dates."); return; }
        const days = Math.round((end.getTime() - start.getTime()) / 86400000);
        if (days < 0) { setError("End date must be after start date."); return; }
        if (days > 120) { setError("Please limit the range to 120 days."); return; }

        const out: DayResult[] = [];
        for (let i = 0; i <= days; i++) {
          const d = new Date(start.getTime() + i * 86400000);
          const day = computeDay(d, city.lat);
          day.score = scoreDay(day, event);
          if (day.score >= 3) out.push(day);
        }
        out.sort((a, b) => b.score - a.score);
        setResults(out);
      } catch (e) {
        setError("Calculation error. Please try again.");
        console.error(e);
      } finally {
        setComputing(false);
      }
    }, 20);
  }, [startDate, endDate, city, event]);

  const totalDays = (() => {
    const s = new Date(startDate + "T00:00:00");
    const e = new Date(endDate   + "T00:00:00");
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    return Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="panchang-gradient rounded-2xl px-6 py-5 text-white">
        <div className="flex items-center gap-4">
          <span className="text-5xl">✨</span>
          <div>
            <h1 className="text-2xl font-black leading-tight">Muhurta Calculator</h1>
            <p className="text-indigo-200 text-sm mt-1">
              Find Vedic-auspicious dates for your important events across any date range
            </p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-sm card-glow border border-indigo-100 p-5 space-y-5">

        {/* Event type selector */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">① Select Event Type</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EVENT_TYPES.map(e => {
              const c = EVENT_COLORS[e.color];
              const active = e.id === eventId;
              return (
                <button
                  key={e.id}
                  onClick={() => { setEventId(e.id); setResults(null); }}
                  className={`rounded-xl p-3 border-2 text-left transition-all ${
                    active
                      ? `${c.activeBg} ${c.activeBorder} ${c.text} shadow-sm`
                      : "border-slate-100 hover:border-indigo-200 text-slate-600 bg-white"
                  }`}
                >
                  <p className="font-bold text-sm">{e.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{e.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* City + date range */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">② City / Location</label>
            <select
              value={cityName}
              onChange={e => { setCityName(e.target.value); setResults(null); }}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-slate-700"
            >
              {CITIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">③ From Date</label>
            <input
              type="date" value={startDate}
              onChange={e => { setStartDate(e.target.value); setResults(null); }}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">To Date <span className="text-slate-400 font-normal normal-case">(max 120 days)</span></label>
            <input
              type="date" value={endDate}
              onChange={e => { setEndDate(e.target.value); setResults(null); }}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Tradition note */}
        <div className={`${ec.bg} ${ec.border} border rounded-xl px-4 py-2.5 text-xs ${ec.text} leading-relaxed`}>
          <strong>📜 {event.labelFull}:</strong> {event.note}
        </div>

        {error && (
          <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
        )}

        <button
          onClick={calculate}
          disabled={computing || totalDays <= 0}
          className="w-full panchang-gradient text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition text-base shadow-md disabled:opacity-60"
        >
          {computing ? "⏳ Computing…" : `✨ Find Auspicious Dates (${totalDays} days)`}
        </button>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="space-y-4">

          {/* Summary bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-800">
                {results.length > 0
                  ? `${results.length} Auspicious ${results.length === 1 ? "Date" : "Dates"} Found`
                  : "No Strongly Auspicious Dates"}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{event.labelFull} · {city.name}</p>
            </div>
            {results.length > 0 && (
              <div className="flex gap-2 text-xs">
                <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">⭐⭐⭐ Excellent: {results.filter(r => r.score >= 6).length}</span>
                <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">⭐⭐ Good: {results.filter(r => r.score >= 4 && r.score < 6).length}</span>
                <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-full">⭐ Acceptable: {results.filter(r => r.score < 4).length}</span>
              </div>
            )}
          </div>

          {/* Empty state */}
          {results.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">🙏</p>
              <p className="font-bold text-amber-800 text-lg">No strongly auspicious dates in this range</p>
              <p className="text-sm text-amber-600 mt-1">Try extending your date range or selecting a different event type</p>
            </div>
          )}

          {/* Day cards */}
          {results.map((day, i) => {
            const v = getVerdict(day.score);
            return (
              <div key={i} className={`bg-white rounded-2xl shadow-sm border ${v.border} overflow-hidden transition hover:shadow-md`}>
                {/* Top accent strip */}
                <div className={`h-1 w-full ${day.score >= 6 ? "bg-emerald-400" : day.score >= 4 ? "bg-blue-400" : "bg-amber-400"}`} />

                <div className="p-4 flex flex-col sm:flex-row gap-4">

                  {/* Score circle */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${v.bg} border ${v.border} self-start`}>
                    <span className={`text-2xl font-black leading-none ${v.text}`}>{day.score}</span>
                    <span className={`text-xs ${v.text} opacity-70`}>/7</span>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-black text-slate-800 text-base leading-tight">{day.dateLabel}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${v.badge}`}>{v.stars} {v.label}</span>
                    </div>

                    {/* Panchang details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-indigo-50 rounded-lg px-2.5 py-2">
                        <p className="text-indigo-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">Nakshatra</p>
                        <p className="font-bold text-indigo-800">{day.nakshatra}</p>
                      </div>
                      <div className="bg-violet-50 rounded-lg px-2.5 py-2">
                        <p className="text-violet-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">Tithi</p>
                        <p className="font-bold text-violet-800">{day.paksha[0]}. {day.tithi}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                        <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">Vara</p>
                        <p className="font-bold text-slate-700">{VARA_SA[day.vara]}</p>
                        <p className="text-slate-400 text-[10px]">({VARA_SHORT[day.vara]})</p>
                      </div>
                      <div className={`rounded-lg px-2.5 py-2 ${day.inauspiciousYoga ? "bg-red-50" : "bg-emerald-50"}`}>
                        <p className={`font-semibold uppercase tracking-wider text-[10px] mb-0.5 ${day.inauspiciousYoga ? "text-red-400" : "text-emerald-400"}`}>Yoga</p>
                        <p className={`font-bold text-xs ${day.inauspiciousYoga ? "text-red-700" : "text-emerald-700"}`}>
                          {day.yoga}
                          <span className="ml-1">{day.inauspiciousYoga ? "⚠️" : "✓"}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timing panel */}
                  <div className="flex-shrink-0 flex flex-col gap-2 sm:min-w-[140px]">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">✅ Best Window</p>
                      <p className="text-sm font-black text-emerald-800 mt-0.5">{day.bestWindow}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">🚫 Avoid (Rahu)</p>
                      <p className="text-sm font-black text-red-700 mt-0.5">{formatHour(day.rahuStart)}–{formatHour(day.rahuEnd)}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-center">
                      <p className="text-[10px] text-slate-400 font-semibold">🌅 Sunrise</p>
                      <p className="text-xs font-bold text-slate-600">{formatHour(day.sunrise)}</p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

          {/* Scoring disclaimer */}
          {results.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 mb-1">📜 Scoring System (Muhurta Chintamani + Brihat Samhita)</p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0.5">
                <p>🌙 Auspicious Nakshatra: <strong>+3 pts</strong></p>
                <p>🌗 Auspicious Tithi: <strong>+2 pts</strong></p>
                <p>📅 Favorable Weekday (Vara): <strong>+1 pt</strong></p>
                <p>🔮 No Inauspicious Yoga: <strong>+1 pt</strong></p>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Timings are approximate (local mean time). For exact Muhurta vidhi including Lagna, Navamsa, and planetary aspects, consult a learned Jyotishi.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
