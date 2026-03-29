import { useState, useEffect } from "react";
import { City } from "@/lib/panchangData";

interface VedicClockProps {
  city: City;
  sunriseStr: string;
  sunsetStr: string;
}

function parseTime12(timeStr: string, referenceDate: Date): Date | null {
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
    const d = new Date(referenceDate);
    d.setHours(h, m, 0, 0);
    return d;
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

  // Format current time in city's timezone
  const cityTimeStr = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: true, timeZone: city.timezone,
  }).format(now);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sunrise = parseTime12(sunriseStr, today);
  const sunset = parseTime12(sunsetStr, today);

  let ghati = "—", pal = "—", vipal = "—";
  let percentDay = 0;

  if (sunrise && sunset) {
    const dayMs = sunset.getTime() - sunrise.getTime();
    const elapsedMs = now.getTime() - sunrise.getTime();
    const elapsedMsClamped = Math.max(0, Math.min(dayMs, elapsedMs));
    percentDay = elapsedMsClamped / dayMs;

    // 1 day = 60 ghati, 1 ghati = 60 pal, 1 pal = 60 vipal
    const totalVipal = Math.round((elapsedMsClamped / dayMs) * 60 * 60 * 60);
    const g = Math.floor(totalVipal / 3600);
    const p = Math.floor((totalVipal % 3600) / 60);
    const v = totalVipal % 60;
    ghati = String(g).padStart(2, "0");
    pal = String(p).padStart(2, "0");
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
