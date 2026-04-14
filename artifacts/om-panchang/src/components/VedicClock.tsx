import { useState, useEffect } from "react";
import { City } from "@/lib/panchangData";

interface VedicClockProps {
  city: City;
  sunriseStr: string;
  sunsetStr: string;
}

/**
 * Parse a formatted time string ("06:55 AM") into a UTC-based Date object
 * anchored to today's date IN THE CITY'S timezone — not the browser's timezone.
 *
 * This is critical for users who have selected a city in a different timezone
 * than their browser (e.g., browser in PST, city set to EDT).
 */
function parseCityTime(timeStr: string, cityTz: string): Date | null {
  if (!timeStr || timeStr === "N/A") return null;
  try {
    const clean = timeStr.replace(/\u202f/g, " ").trim();
    const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/i);
    if (!match) return null;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const meridiem = match[3].toUpperCase();
    if (meridiem === "PM" && h !== 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;

    const now = new Date();

    // Get today's date in the CITY's timezone (YYYY-MM-DD)
    const cityDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: cityTz,
      year: "numeric", month: "2-digit", day: "2-digit",
    }).format(now);
    const [yr, mo, da] = cityDateStr.split("-").map(Number);

    // Get the city's current UTC offset in minutes (handles DST automatically)
    const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate  = new Date(now.toLocaleString("en-US", { timeZone: cityTz }));
    const offsetMin = (tzDate.getTime() - utcDate.getTime()) / 60000;

    // Build UTC timestamp: city midnight + hm offset - city UTC offset
    const utcMidnight = Date.UTC(yr, mo - 1, da);
    return new Date(utcMidnight + h * 3600000 + m * 60000 - offsetMin * 60000);
  } catch {
    return null;
  }
}

export default function VedicClock({ city, sunriseStr, sunsetStr }: VedicClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Current time displayed in city's timezone
  const cityTimeStr = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true, timeZone: city.timezone,
  }).format(now);

  const sunrise = parseCityTime(sunriseStr, city.timezone);
  const sunset  = parseCityTime(sunsetStr,  city.timezone);

  let ghati = "—", pal = "—", vipal = "—";
  let percentDay = 0;

  if (sunrise && sunset) {
    const dayMs     = sunset.getTime() - sunrise.getTime();
    const elapsedMs = now.getTime() - sunrise.getTime();

    // Progress bar: fraction of daytime elapsed (clamped 0–1)
    const elapsedMsClamped = Math.max(0, Math.min(dayMs, elapsedMs));
    percentDay = elapsedMsClamped / dayMs;

    /**
     * Vedic time (Ishtakal): 1 day = 60 Ghati, counted from SUNRISE.
     *  1 sidereal day = 24h = 60 Ghati → 1 Ghati = 24 min
     *  Elapsed Ghati = elapsed_from_sunrise / (24h) × 60
     *  In vipal: totalVipal = elapsedMs / (24h_ms) × (60 × 60 × 60)
     *  Simplifies to:  elapsedMs / 400  (because 86400000 / 216000 = 400)
     */
    const DAY_MS = 24 * 60 * 60 * 1000;
    const totalVipal = Math.max(0, Math.round((elapsedMs / DAY_MS) * 60 * 60 * 60));
    const g = Math.floor(totalVipal / 3600);
    const p = Math.floor((totalVipal % 3600) / 60);
    const v = totalVipal % 60;
    ghati = String(g).padStart(2, "0");
    pal   = String(p).padStart(2, "0");
    vipal = String(v).padStart(2, "0");
  }

  const isDaytime = sunrise && sunset && now >= sunrise && now <= sunset;

  return (
    <div className="rounded-xl overflow-hidden border border-indigo-100 bg-white">
      <div className="panchang-gradient px-4 py-2.5 flex items-center gap-2">
        <span className="text-base">⏱️</span>
        <p className="text-white text-xs font-bold uppercase tracking-widest">Vedic Time</p>
      </div>
      <div className="px-4 py-3 space-y-3">
        {/* Clock */}
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-900 tracking-wider font-mono">{cityTimeStr}</p>
          <p className="text-xs text-slate-500 mt-0.5">{city.name} Local Time</p>
        </div>

        {/* Ghati display */}
        <div className="bg-indigo-50 rounded-lg px-3 py-2 flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-xl font-bold text-indigo-700 font-mono">{ghati}</p>
            <p className="text-xs text-indigo-400 font-medium">Ghati</p>
          </div>
          <div className="text-indigo-300 font-bold text-lg">:</div>
          <div className="text-center flex-1">
            <p className="text-xl font-bold text-indigo-700 font-mono">{pal}</p>
            <p className="text-xs text-indigo-400 font-medium">Pal</p>
          </div>
          <div className="text-indigo-300 font-bold text-lg">:</div>
          <div className="text-center flex-1">
            <p className="text-xl font-bold text-indigo-700 font-mono">{vipal}</p>
            <p className="text-xs text-indigo-400 font-medium">Vipal</p>
          </div>
        </div>

        {/* Day progress bar */}
        {sunrise && sunset && (
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>🌅 {sunriseStr}</span>
              <span className="font-medium text-indigo-600">
                {isDaytime ? "Daytime" : "Nighttime"}
              </span>
              <span>🌇 {sunsetStr}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, percentDay * 100).toFixed(1)}%`,
                  background: isDaytime
                    ? "linear-gradient(90deg, #f59e0b, #f97316)"
                    : "linear-gradient(90deg, #6366f1, #818cf8)",
                }}
              />
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 text-center leading-tight">
          1 Day = 60 Ghati · 1 Ghati = 60 Pal · 1 Pal = 60 Vipal
        </p>
      </div>
    </div>
  );
}
