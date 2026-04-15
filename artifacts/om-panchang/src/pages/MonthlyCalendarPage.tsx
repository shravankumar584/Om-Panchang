import { useState, useEffect, useCallback, useRef } from "react";
import {
  CITIES, City, DayPanchang, computeDayPanchang,
  getFestivalsForDate, cityToSlug, slugToCity,
} from "@/lib/panchangData";
import { monthToSlug, slugToMonthYear } from "@/lib/calendarUtils";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

interface CalendarDay {
  date: Date;
  panchang: DayPanchang | null;
  isCurrentMonth: boolean;
  isToday: boolean;
}

function fmtLocalTime(d: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz,
    }).format(d);
  } catch { return ""; }
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

function CityDropdown({ value, onChange }: { value: City; onChange: (c: City) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const q = query.toLowerCase();
  const filtered = q
    ? CITIES.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    : CITIES;

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); }
    }
    document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition max-w-[180px] sm:max-w-none"
      >
        <span>📍</span>
        <span className="truncate">{value.name}</span>
        <span className="text-white/60 text-xs ml-1">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-indigo-100 z-50 overflow-hidden">
          <div className="p-2 border-b border-indigo-50">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search city…"
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-indigo-100 focus:outline-none focus:border-indigo-300"
            />
          </div>
          <div className="overflow-y-auto max-h-60">
            {filtered.slice(0, 60).map(c => (
              <button
                key={c.name}
                onClick={() => { onChange(c); setOpen(false); setQuery(""); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition ${c.name === value.name ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700"}`}
              >
                {c.name} <span className="text-slate-400 text-xs">{c.country}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  initialMonth: number;
  initialYear: number;
  initialCity: City;
}

export default function MonthlyCalendarPage({ initialMonth, initialYear, initialCity }: Props) {
  // Stable reference — must not be recreated on re-render or buildCalendar deps loop
  const todayRef = useRef<Date>((() => { const d = new Date(); d.setHours(0,0,0,0); return d; })());
  const today = todayRef.current;

  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [city, setCity] = useState<City>(initialCity);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [libraryLoaded, setLibraryLoaded] = useState(() => !!(window as any).Panchangam);
  const cacheRef = useRef<Map<string, DayPanchang>>(new Map());
  // Ref mirror of calendarDays — always current even before React commits the state update.
  // Needed because fill() may resolve before React commits Effect 1's setCalendarDays call.
  const daysRef = useRef<CalendarDay[]>([]);

  // Load panchangam CDN library
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Panchangam) { setLibraryLoaded(true); return; }
    const existing = document.querySelector('script[src*="panchangam-js"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setLibraryLoaded(true));
      existing.addEventListener("error", () => setLibraryLoaded(true));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@ishubhamx/panchangam-js@2.2.6/dist/index.min.js";
    s.async = true;
    s.onload = () => setLibraryLoaded(true);
    s.onerror = () => setLibraryLoaded(true);
    document.head.appendChild(s);
  }, []);

  // Handle browser Back / Forward buttons within the calendar
  useEffect(() => {
    const onPopState = () => {
      const segments = window.location.pathname.split("/").filter(Boolean);
      // Only act if the URL is still a panchang-calendar route
      if (segments[0] !== "panchang-calendar") return;
      const monthYear = slugToMonthYear(segments[1] ?? "");
      if (!monthYear) return;
      const newCity = slugToCity(segments[2] ?? "") ?? CITIES[0];
      // Update component state in-place (avoids a full remount)
      setMonth(monthYear.month);
      setYear(monthYear.year);
      setCity(newCity);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Update meta title for SEO
  useEffect(() => {
    document.title = `Hindu Panchang Calendar ${MONTHS[month]} ${year} – ${city.name} | Om Panchang`;
  }, [month, year, city.name]);

  // ── Single combined effect: build skeleton then fill panchang data ──────────
  // Merged into ONE effect so the skeleton is always constructed synchronously
  // before any async fill starts — eliminating any race between two separate effects.
  useEffect(() => {
    cacheRef.current.clear();
    let cancelled = false;
    const m = month; const y = year;

    // 1. Build skeleton synchronously and commit to ref + state
    const firstDay = new Date(y, m, 1);
    const lastDay  = new Date(y, m + 1, 0);
    const start    = new Date(firstDay); start.setDate(start.getDate() - start.getDay());
    const end      = new Date(lastDay);  end.setDate(end.getDate() + (6 - end.getDay()));
    const skeleton: CalendarDay[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      const d = new Date(cur); d.setHours(0,0,0,0);
      skeleton.push({ date: d, panchang: null,
        isCurrentMonth: d.getMonth() === m,
        isToday: d.getTime() === today.getTime() });
      cur.setDate(cur.getDate() + 1);
    }
    daysRef.current = skeleton;          // synchronous — always ready before fill runs
    setCalendarDays([...skeleton]);

    // 2. If library not loaded yet, wait for it (libraryLoaded dep will re-trigger)
    if (!libraryLoaded) { setLoading(false); return; }

    // 3. Fill panchang data asynchronously.
    //    - Only process current-month dates (not gray padding cells).
    //    - daysRef gives us the stable index (not affected by concurrent state updates).
    //    - Functional setCalendarDays(prev=>) is serialized by React, so concurrent
    //      Promise.all resolutions can't overwrite each other.
    //    - computeDayPanchang starts with a setTimeout yield, so React will have
    //      committed setCalendarDays([...skeleton]) before any result comes back,
    //      meaning prev is always the skeleton (never the initial empty []).
    setLoading(true);
    const fill = async () => {
      // Only fill current-month cells — padding cells stay blank
      const monthDates = skeleton.filter(d => d.isCurrentMonth).map(d => d.date);

      for (let i = 0; i < monthDates.length; i += 5) {
        if (cancelled) return;
        await Promise.all(monthDates.slice(i, i + 5).map(async date => {
          if (cancelled) return;
          const k = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${city.name}`;
          try {
            let p = cacheRef.current.get(k);
            if (!p) { p = await computeDayPanchang(date, city); cacheRef.current.set(k, p); }
            if (cancelled) return;
            // Use daysRef for a stable index (avoids date comparison across
            // different Date instances) then apply via functional update so
            // concurrent resolutions within the same batch don't overwrite each other.
            const targetTime = date.getTime();
            const idx = daysRef.current.findIndex(d => d.date.getTime() === targetTime);
            if (idx !== -1) {
              setCalendarDays(prev => {
                if (!prev[idx]) return prev;     // skeleton not yet committed — skip
                const next = [...prev];
                next[idx] = { ...next[idx], panchang: p! };
                return next;
              });
            }
          } catch (err) {
            console.error("panchang compute failed", date, err);
          }
        }));
      }
      if (!cancelled) setLoading(false);
    };

    fill().catch(err => { if (!cancelled) { console.error("fill failed", err); setLoading(false); } });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryLoaded, month, year, city.name]);

  function navigate(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    // Reset immediately so React knows old data is dead
    setCalendarDays([]); setLoading(true);
    setMonth(m); setYear(y);
    window.history.pushState({}, "", `/panchang-calendar/${monthToSlug(m, y)}/${cityToSlug(city.name)}`);
  }

  function handleCityChange(c: City) {
    cacheRef.current.clear();
    setCalendarDays([]); setLoading(true);
    setCity(c);
    window.history.pushState({}, "", `/panchang-calendar/${monthToSlug(month, year)}/${cityToSlug(c.name)}`);
  }

  function navHome() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  const isThisMonth = month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #e8e8f8 50%, #f5f0ff 100%)" }}>
      {/* Header */}
      <header className="panchang-gradient shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <button onClick={navHome} className="flex items-center gap-2 sm:gap-3 min-w-0 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-white/15 rounded-full flex items-center justify-center text-base sm:text-xl border border-white/20 group-hover:bg-white/25 transition">
                🕉️
              </div>
              <div className="min-w-0 text-left">
                <h1 className="text-base sm:text-xl font-bold text-white tracking-tight leading-tight">Om Panchang</h1>
                <p className="text-indigo-200 text-xs hidden sm:block">Hindu Panchang Calendar</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <CityDropdown value={city} onChange={handleCityChange} />
            </div>
          </div>
        </div>
        {/* Month nav sub-bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-lg font-bold transition">‹</button>
              <h2 className="text-white font-bold text-base sm:text-lg min-w-[160px] text-center">
                {MONTHS[month]} {year}
              </h2>
              <button onClick={() => navigate(1)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-lg font-bold transition">›</button>
            </div>
            {!isThisMonth && (
              <button
                onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); window.history.pushState({}, "", `/panchang-calendar/${monthToSlug(today.getMonth(), today.getFullYear())}/${cityToSlug(city.name)}`); }}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-indigo-900 text-xs font-bold rounded-full transition">
                Today
              </button>
            )}
            <a href="/" onClick={e => { e.preventDefault(); navHome(); }}
              className="text-indigo-200 hover:text-white text-xs sm:text-sm transition flex items-center gap-1">
              ← Full Panchang
            </a>
          </div>
        </div>
      </header>

      {/* SEO intro text */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-1">
        <p className="text-slate-500 text-xs sm:text-sm">
          Complete Hindu Panchang for <strong>{MONTHS[month]} {year}</strong> in <strong>{city.name}, {city.country}</strong> —
          Tithi, Nakshatra, Yoga, Rahu Kalam, and all festivals. Calculated using Drik method & Lahiri Ayanamsa.
        </p>
      </div>

      {/* Calendar */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-3 pb-10">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-indigo-100">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-indigo-100">
            {WEEKDAYS.map((day, i) => (
              <div key={day} className={`py-2.5 text-center text-xs font-bold uppercase tracking-wider
                ${i === 0 ? "text-rose-500" : i === 6 ? "text-indigo-400" : "text-slate-400"}`}>
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0,1)}</span>
              </div>
            ))}
          </div>

          {loading && calendarDays.length === 0 ? <Spinner /> : (
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const festivals = getFestivalsForDate(day.date);
                const isSun = day.date.getDay() === 0;
                const isSat = day.date.getDay() === 6;
                const p = day.panchang;

                let tithiWindow = "";
                if (p?.tithiEndDate) {
                  const end = fmtLocalTime(p.tithiEndDate, city.timezone);
                  const calMid = Date.UTC(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
                  const nextDay = p.tithiEndDate.getTime() >= calMid + 86_400_000;
                  tithiWindow = `until ${end}${nextDay ? "↑" : ""}`;
                }

                return (
                  <div key={idx}
                    className={`border-b border-r border-indigo-50 min-h-[100px] sm:min-h-[130px] p-1 sm:p-2 transition
                      ${!day.isCurrentMonth ? "opacity-30 bg-slate-50/40" : "hover:bg-indigo-50/50"}
                      ${day.isToday ? "bg-amber-50 ring-2 ring-amber-400 ring-inset z-10" : ""}
                    `}
                  >
                    {/* Date number */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                        ${day.isToday ? "bg-amber-400 text-white" : isSun ? "text-rose-500" : isSat ? "text-indigo-400" : "text-slate-700"}
                      `}>{day.date.getDate()}</span>
                      {festivals.length > 0 && day.isCurrentMonth && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" title={festivals[0]} />
                      )}
                    </div>

                    {day.isCurrentMonth && (
                      <div className="space-y-0.5">
                        {p ? (
                          <>
                            {/* Tithi */}
                            <p className="text-[10px] sm:text-xs font-semibold text-indigo-700 leading-tight truncate">{p.tithi}</p>
                            {tithiWindow && (
                              <p className="text-[8px] sm:text-[9px] text-indigo-400 leading-tight truncate">{tithiWindow}</p>
                            )}
                            {/* Nakshatra */}
                            <p className="text-[9px] sm:text-[10px] text-slate-500 leading-tight truncate hidden sm:block">{p.nakshatra}</p>
                            {/* Yoga */}
                            <p className="text-[8px] sm:text-[9px] text-slate-400 leading-tight truncate hidden sm:block">{p.yoga}</p>
                            {/* Sunrise / Sunset – desktop only */}
                            {p.sunrise && p.sunset && (
                              <p className="text-[8px] text-amber-500 leading-tight hidden lg:block">
                                🌅{p.sunrise} 🌇{p.sunset}
                              </p>
                            )}
                            {/* Festival */}
                            {festivals.length > 0 && (
                              <p className="text-[9px] sm:text-[10px] font-semibold text-rose-600 leading-tight truncate">
                                🎉 {festivals[0]}
                              </p>
                            )}
                            {/* Rahu Kalam */}
                            {p.rahuKalam && (
                              <p className="text-[8px] text-slate-400 leading-tight hidden lg:block">☠️ Rahu: {p.rahuKalam}</p>
                            )}
                          </>
                        ) : (
                          <div className="space-y-1 pt-1">
                            <div className="h-2 bg-indigo-100 rounded animate-pulse" />
                            <div className="h-2 bg-indigo-50 rounded animate-pulse w-4/5" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="px-4 py-3 border-t border-indigo-50 bg-indigo-50/40 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" /><span>Today</span></div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /><span>Festival</span></div>
            <div className="flex items-center gap-1"><span className="text-indigo-400 font-bold">↑</span><span>Tithi ends next day</span></div>
            <div className="ml-auto text-indigo-500 font-medium">🕉️ Based on {city.name}</div>
          </div>
        </div>

        {/* Month quick-jump grid */}
        <div className="mt-6 bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
          <div className="panchang-gradient px-4 py-3">
            <h3 className="text-white font-bold text-sm">Explore Other Months – {city.name}</h3>
            <p className="text-indigo-200 text-xs mt-0.5">Jump to any month's Hindu Panchang calendar</p>
          </div>
          <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {[2026, 2027].flatMap(y =>
              MONTHS.map((mn, mi) => {
                const isActive = mi === month && y === year;
                const slug = cityToSlug(city.name);
                return (
                  <a
                    key={`${y}-${mi}`}
                    href={`/panchang-calendar/${mn.toLowerCase()}-${y}/${slug}`}
                    onClick={e => {
                      e.preventDefault();
                      setMonth(mi); setYear(y);
                      window.history.pushState({}, "", `/panchang-calendar/${mn.toLowerCase()}-${y}/${slug}`);
                    }}
                    className={`text-center py-2 px-1 rounded-xl text-xs font-medium transition border
                      ${isActive
                        ? "panchang-gradient text-white border-transparent shadow-sm"
                        : "border-indigo-100 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200"
                      }`}
                  >
                    <div className="font-semibold">{mn.slice(0,3)}</div>
                    <div className={`text-[10px] ${isActive ? "text-indigo-200" : "text-slate-400"}`}>{y}</div>
                  </a>
                );
              })
            )}
          </div>
        </div>

        {/* SEO content block */}
        <div className="mt-6 bg-white rounded-2xl border border-indigo-100 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            Hindu Panchang Calendar – {MONTHS[month]} {year}, {city.name}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            This page shows the complete Hindu Panchang (Panchangam) for every day of {MONTHS[month]} {year}{" "}
            calculated for <strong>{city.name}, {city.country}</strong>. Each day includes the
            <strong> Tithi</strong> (lunar day), <strong>Nakshatra</strong> (lunar mansion),
            <strong> Yoga</strong>, Karana, sunrise/sunset times, Rahu Kalam, and
            any Hindu festivals or auspicious occasions.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            All calculations use the <strong>Drik Panchang</strong> method with <strong>Lahiri Ayanamsa</strong>
            (the standard used in India since 1955). Timings are local to {city.name} — switch the city
            selector above to view the Panchang for your city.
          </p>
        </div>
      </main>
    </div>
  );
}
