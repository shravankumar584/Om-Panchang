import { useState, useEffect, useCallback, useRef } from "react";
import { CITIES, City, DayPanchang, computeDayPanchang, getFestivalsForDate } from "@/lib/panchangData";
import ReferenceSection from "@/components/ReferenceSection";
import VedicClock from "@/components/VedicClock";
import PlanetaryPositions from "@/components/PlanetaryPositions";
import UpcomingFestivals from "@/components/UpcomingFestivals";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
      <div className="w-8 h-8 rounded-full border-3 border-indigo-100 border-t-indigo-500 animate-spin" />
      <span className="text-indigo-600 text-sm font-medium">Computing Panchang…</span>
    </div>
  );
}

function SectionHeader({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/60 border-b border-indigo-100">
      <span>{icon}</span>
      <div>
        <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">{title}</p>
        {sub && <p className="text-xs text-indigo-400">{sub}</p>}
      </div>
    </div>
  );
}

function DetailRow({
  icon, label, value, sub, highlight,
}: {
  icon: string; label: string; value: string; sub?: string; highlight?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-b-0 ${highlight ? "bg-amber-50/50" : ""}`}>
      <span className="text-base leading-none mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">until {sub}</p>}
      </div>
    </div>
  );
}

export default function PanchangPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [viewDate, setViewDate] = useState<Date>(new Date(today));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));
  const [selectedPanchang, setSelectedPanchang] = useState<DayPanchang | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const panchangCacheRef = useRef<Map<string, DayPanchang>>(new Map());

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

  useEffect(() => {
    if (!libraryLoaded) return;
    panchangCacheRef.current.clear();
    buildCalendar(viewDate.getFullYear(), viewDate.getMonth(), selectedCity, selectedDate).catch(() => {
      setIsLoadingMonth(false);
    });
  }, [libraryLoaded, viewDate.getFullYear(), viewDate.getMonth(), selectedCity]);

  useEffect(() => {
    if (!libraryLoaded) return;
    setIsLoadingSidebar(true);
    computeAndCache(selectedDate, selectedCity)
      .then(r => { setSelectedPanchang(r); setIsLoadingSidebar(false); })
      .catch(() => setIsLoadingSidebar(false));
  }, [libraryLoaded, selectedDate, selectedCity, computeAndCache]);

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setCalendarDays(prev => prev.map(d => ({ ...d, isSelected: d.date.getTime() === day.date.getTime() })));
    if (!day.isCurrentMonth) setViewDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
  };

  const filteredCities = CITIES.filter(c =>
    citySearch === "" ||
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  const selectedDateFormatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(selectedDate);

  const selectedFestivals = getFestivalsForDate(selectedDate);
  const sp = selectedPanchang;

  // Group cities by country for display
  const cityGroups = filteredCities.reduce<Record<string, City[]>>((acc, city) => {
    if (!acc[city.country]) acc[city.country] = [];
    acc[city.country].push(city);
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #e8e8f8 50%, #f5f0ff 100%)" }}>
      {/* Header */}
      <header className="panchang-gradient shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/20">
                🕉️
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Om Panchang</h1>
                <p className="text-indigo-200 text-xs">Hindu Calendar & Vedic Almanac</p>
              </div>
            </div>

            {/* City selector */}
            <div className="relative">
              <button
                onClick={() => { setShowCityDropdown(d => !d); setCitySearch(""); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white text-sm font-medium hover:bg-white/25 transition backdrop-blur-sm"
              >
                <span className="text-xs">📍</span>
                <span className="hidden sm:block">{selectedCity.name}, {selectedCity.country}</span>
                <span className="sm:hidden">{selectedCity.name}</span>
                <span className="text-xs text-indigo-200">▾</span>
              </button>

              {showCityDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-indigo-100 z-50 overflow-hidden">
                    <div className="p-2 border-b border-indigo-50">
                      <input
                        type="text"
                        placeholder="Search cities…"
                        value={citySearch}
                        onChange={e => setCitySearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {Object.entries(cityGroups).map(([country, cities]) => (
                        <div key={country}>
                          <p className="px-3 py-1.5 text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50/60 sticky top-0">
                            {country}
                          </p>
                          {cities.map(city => (
                            <button
                              key={city.name}
                              onClick={() => {
                                setSelectedCity(city);
                                panchangCacheRef.current.clear();
                                setShowCityDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition ${
                                city.name === selectedCity.name ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700"
                              }`}
                            >
                              {city.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
        {/* === LEFT SIDEBAR === */}
        <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1 space-y-4">
          {/* Daily Panchang card */}
          <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
            {/* Sidebar header */}
            <div className="panchang-gradient px-4 py-3">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">Daily Panchang</p>
              <p className="text-white font-bold text-sm mt-0.5 leading-snug">{selectedDateFormatted}</p>
            </div>

            {/* Festivals */}
            {selectedFestivals.length > 0 && (
              <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-100">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1.5">🎉 Today's Festivals</p>
                <div className="flex flex-wrap gap-1">
                  {selectedFestivals.map((f, i) => (
                    <span key={i} className="festival-badge text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isLoadingSidebar ? <Spinner /> : sp ? (
              <>
                {/* Astronomical Times */}
                <SectionHeader icon="🌞" title="Astronomical Times" />
                <div className="px-4 py-1">
                  <DetailRow icon="🌅" label="Sunrise" value={sp.sunrise} />
                  <DetailRow icon="🌇" label="Sunset" value={sp.sunset} />
                  <DetailRow icon="🌙" label="Moonrise" value={sp.moonrise} />
                  <DetailRow icon="🌑" label="Moonset" value={sp.moonset} />
                </div>

                {/* Five Elements */}
                <SectionHeader icon="📿" title="Pancha Anga" sub="Five Elements" />
                <div className="px-4 py-1">
                  <DetailRow icon="🌓" label="Tithi" value={sp.tithi} sub={sp.tithiEnd} />
                  <DetailRow icon="⭐" label="Nakshatra" value={sp.nakshatra} sub={sp.nakshatraEnd} />
                  <DetailRow icon="🔯" label="Yoga" value={sp.yoga} />
                  <DetailRow icon="☯️" label="Karana" value={sp.karana} />
                  <DetailRow icon="🌊" label="Paksha" value={sp.paksha} />
                  <DetailRow icon="📅" label="Vara (Weekday)" value={sp.weekdayName} />
                </div>

                {/* Muhurtas */}
                <SectionHeader icon="⏰" title="Muhurtas" sub="Auspicious & Inauspicious Times" />
                <div className="px-4 py-1">
                  <DetailRow icon="✨" label="Abhijit Muhurta" value={sp.abhijitMuhurta} highlight />
                  <DetailRow icon="⚠️" label="Rahu Kalam" value={sp.rahuKalam} />
                  <DetailRow icon="☠️" label="Yamaganda" value={sp.yamagandaKalam} />
                  <DetailRow icon="🌀" label="Gulika Kalam" value={sp.gulikaKalam} />
                </div>

                {/* Vedic Calendar */}
                <SectionHeader icon="📜" title="Vedic Calendar" sub="Samvat & Season" />
                <div className="px-4 py-1">
                  <DetailRow icon="🗓️" label="Vikram Samvat" value={String(sp.vikramSamvat)} />
                  <DetailRow icon="📆" label="Shaka Samvat" value={String(sp.shakaSamvat)} />
                  <DetailRow icon="🌤️" label="Ayana" value={sp.ayana} />
                  <DetailRow icon="🍃" label="Ritu (Season)" value={sp.ritu} />
                  <DetailRow icon="☀️" label="Sun Sign (Rashi)" value={sp.sunsign} />
                  <DetailRow icon="🌙" label="Moon Sign (Rashi)" value={sp.moonsign} />
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">Select a date</p>
            )}

            {/* City note */}
            <div className="px-4 py-2.5 bg-indigo-50/50 border-t border-indigo-100">
              <p className="text-xs text-indigo-500 text-center font-medium">
                📍 {selectedCity.name}, {selectedCity.country}
              </p>
            </div>
          </div>

          {/* Vedic Clock */}
          {sp && (
            <VedicClock city={selectedCity} sunriseStr={sp.sunrise} sunsetStr={sp.sunset} />
          )}
        </aside>

        {/* === MAIN AREA === */}
        <div className="flex-1 order-1 lg:order-2 space-y-4">
          {/* Calendar card */}
          <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
            {/* Calendar header */}
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
              <button
                onClick={() => {
                  const t = new Date(today);
                  setSelectedDate(t); setViewDate(t);
                  setCalendarDays(prev => prev.map(d => ({ ...d, isSelected: d.date.getTime() === t.getTime() })));
                }}
                className="px-4 py-1.5 panchang-gradient text-white text-xs font-bold rounded-full transition shadow-sm hover:opacity-90"
              >
                Today
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-indigo-50">
              {WEEKDAYS.map((day, i) => (
                <div key={day} className={`py-2 text-center text-xs font-bold uppercase tracking-wider ${
                  i === 0 ? "text-rose-500" : i === 6 ? "text-indigo-400" : "text-slate-400"
                }`}>
                  {day}
                </div>
              ))}
            </div>

            {isLoadingMonth && calendarDays.length === 0 && <div className="py-10"><Spinner /></div>}

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const festivals = getFestivalsForDate(day.date);
                const isSun = day.date.getDay() === 0;
                const isSat = day.date.getDay() === 6;

                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative border-b border-r border-indigo-50 cursor-pointer min-h-[78px] p-1.5 day-card-hover
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
                      `}>
                        {day.date.getDate()}
                      </span>
                      {festivals.length > 0 && (
                        <span className={`w-1.5 h-1.5 rounded-full ${day.isSelected ? "bg-amber-300" : "bg-rose-500"}`} />
                      )}
                    </div>

                    {day.isCurrentMonth && (
                      <div className="space-y-0.5">
                        {day.panchang ? (
                          <>
                            <p className={`text-xs font-medium leading-tight truncate ${day.isSelected ? "text-indigo-100" : "text-indigo-700"}`}>
                              {day.panchang.tithi}
                            </p>
                            <p className={`text-xs leading-tight truncate hidden sm:block ${day.isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                              {day.panchang.nakshatra}
                            </p>
                          </>
                        ) : (
                          <div className={`h-2.5 rounded animate-pulse ${day.isSelected ? "bg-indigo-400" : "bg-indigo-100"}`} />
                        )}
                        {festivals.length > 0 && (
                          <p className={`text-xs font-semibold leading-tight truncate ${day.isSelected ? "text-amber-300" : "text-rose-600"}`}>
                            🎉 {festivals[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="px-4 py-2.5 border-t border-indigo-50 bg-indigo-50/30 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Festival</span>
              </div>
              <div className="ml-auto text-indigo-500 font-medium text-xs">
                🕉️ Based on {selectedCity.name}
              </div>
            </div>
          </div>

          {/* About Panchang */}
          <div className="panchang-gradient rounded-2xl p-4 text-white shadow-md">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📿</span>
              <div>
                <p className="font-bold text-sm mb-1">What is Panchang?</p>
                <p className="text-indigo-200 text-xs leading-relaxed">
                  Panchang (Sanskrit: पञ्चाङ्ग) is the traditional Hindu almanac giving five key elements —
                  <strong className="text-white"> Tithi</strong> (lunar day),
                  <strong className="text-white"> Nakshatra</strong> (lunar mansion),
                  <strong className="text-white"> Yoga</strong> (auspiciousness),
                  <strong className="text-white"> Karana</strong> (half-tithi), and
                  <strong className="text-white"> Vara</strong> (weekday).
                  It governs auspicious timings, festivals, and all Vedic rituals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* === BOTTOM SECTIONS: Planets + Upcoming Festivals === */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <PlanetaryPositions date={selectedDate} />
          <UpcomingFestivals today={today} />
        </div>
      </div>

      {/* Reference Section */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <ReferenceSection />
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs border-t border-indigo-100 bg-white/60">
        <p className="flex items-center justify-center gap-2 font-medium text-slate-500">
          <span>🕉️</span>
          <span>Om Panchang · Hindu Calendar & Vedic Almanac</span>
          <span>🕉️</span>
        </p>
        <p className="mt-1 text-slate-400">Astronomical calculations · Location-aware · Drik Panchang methodology</p>
      </footer>
    </div>
  );
}
