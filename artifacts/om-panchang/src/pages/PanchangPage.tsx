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

type ActiveTab = "home" | "panchang" | "muhurat" | "festivals" | "planets" | "guide";

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

function DetailRow({ icon, label, value, sub, highlight }: {
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

// Grouped select for cities
function CitySelect({ value, onChange }: { value: City; onChange: (city: City) => void }) {
  const countryGroups = CITIES.reduce<Record<string, City[]>>((acc, city) => {
    if (!acc[city.country]) acc[city.country] = [];
    acc[city.country].push(city);
    return acc;
  }, {});

  return (
    <select
      value={value.name}
      onChange={e => {
        const city = CITIES.find(c => c.name === e.target.value);
        if (city) onChange(city);
      }}
      className="pl-3 pr-8 py-2 rounded-xl bg-white/15 border border-white/30 text-white text-sm font-medium
                 focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer
                 hover:bg-white/25 transition backdrop-blur-sm"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "calc(100% - 10px) center" }}
    >
      {Object.entries(countryGroups).map(([country, cities]) => (
        <optgroup key={country} label={`— ${country} —`} style={{ color: "#333", background: "white" }}>
          {cities.map(city => (
            <option key={city.name} value={city.name} style={{ color: "#1e1b4b", background: "white" }}>
              {city.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export default function PanchangPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
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
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setCalendarDays(prev => prev.map(d => ({ ...d, isSelected: d.date.getTime() === day.date.getTime() })));
    if (!day.isCurrentMonth) setViewDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
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

  const TABS: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "panchang", label: "Panchang", icon: "📿" },
    { id: "muhurat", label: "Muhurat", icon: "⏰" },
    { id: "festivals", label: "Festivals", icon: "🎉" },
    { id: "planets", label: "Planets", icon: "🪐" },
    { id: "guide", label: "Guide", icon: "📖" },
  ];

  // Sidebar: common across tabs
  const Sidebar = (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
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
            </div>
            <SectionHeader icon="📿" title="Pancha Anga" sub="Five Elements" />
            <div className="px-4 py-1">
              <DetailRow icon="🌓" label="Tithi" value={sp.tithi} sub={sp.tithiEnd} />
              <DetailRow icon="⭐" label="Nakshatra" value={sp.nakshatra} sub={sp.nakshatraEnd} />
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
    </aside>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #e8e8f8 50%, #f5f0ff 100%)" }}>
      {/* Header */}
      <header className="panchang-gradient shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center text-xl border border-white/20">
                🕉️
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Om Panchang</h1>
                <p className="text-indigo-200 text-xs">Hindu Calendar & Vedic Almanac</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm hidden sm:block">📍</span>
              <CitySelect value={selectedCity} onChange={handleCityChange} />
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition
                    ${activeTab === tab.id
                      ? "border-amber-400 text-amber-300 bg-white/10"
                      : "border-transparent text-indigo-200 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

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
                      className={`relative border-b border-r border-indigo-50 cursor-pointer min-h-[78px] p-1.5 day-card-hover
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
                              <p className={`text-xs font-medium leading-tight truncate ${day.isSelected ? "text-indigo-100" : "text-indigo-700"}`}>{day.panchang.tithi}</p>
                              <p className={`text-xs leading-tight truncate hidden sm:block ${day.isSelected ? "text-indigo-200" : "text-slate-400"}`}>{day.panchang.nakshatra}</p>
                            </>
                          ) : (
                            <div className={`h-2.5 rounded animate-pulse ${day.isSelected ? "bg-indigo-400" : "bg-indigo-100"}`} />
                          )}
                          {festivals.length > 0 && (
                            <p className={`text-xs font-semibold leading-tight truncate ${day.isSelected ? "text-amber-300" : "text-rose-600"}`}>🎉 {festivals[0]}</p>
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
                <div className="ml-auto text-indigo-500 font-medium">🕉️ Based on {selectedCity.name}</div>
              </div>
            </div>
            {/* Planets + Festivals preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlanetaryPositions date={selectedDate} />
              <UpcomingFestivals today={today} />
            </div>
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
                    { icon: "🌓", label: "Tithi", value: sp.tithi, sub: sp.tithiEnd ? `Ends: ${sp.tithiEnd}` : undefined },
                    { icon: "⭐", label: "Nakshatra", value: sp.nakshatra, sub: sp.nakshatraEnd ? `Ends: ${sp.nakshatraEnd}` : undefined },
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
                        { icon: "🌅", label: "Brahma Muhurta", value: "~96 min before sunrise", desc: "The creator's time — ideal for prayer, meditation and study" },
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
          <div className="flex-1">
            <UpcomingFestivals today={today} />
          </div>
        </main>
      )}

      {/* ===== PLANETS TAB ===== */}
      {activeTab === "planets" && (
        <main className="max-w-7xl mx-auto px-4 py-5 flex flex-col lg:flex-row gap-5">
          {Sidebar}
          <div className="flex-1 space-y-4">
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
                {["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"].map((sign, i) => (
                  <div key={sign} className="bg-indigo-50 rounded-lg px-2 py-1.5 text-indigo-700 font-medium">
                    {i + 1}. {sign}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ===== GUIDE TAB ===== */}
      {activeTab === "guide" && (
        <main className="max-w-7xl mx-auto px-4 py-5">
          <ReferenceSection />
        </main>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs border-t border-indigo-100 bg-white/60 mt-4">
        <p className="flex items-center justify-center gap-2 font-medium text-slate-500">
          <span>🕉️</span>
          <span>Om Panchang · Hindu Calendar & Vedic Almanac</span>
          <span>🕉️</span>
        </p>
        <p className="mt-1">Astronomical calculations · Location-aware · Drik Panchang methodology</p>
      </footer>
    </div>
  );
}
