import { useState, useEffect, useCallback, useRef } from "react";
import { CITIES, City, DayPanchang, computeDayPanchang, getFestivalsForDate } from "@/lib/panchangData";

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

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-lg">🕉️</div>
      </div>
      <span className="ml-3 text-orange-700 font-medium">Computing Panchang...</span>
    </div>
  );
}

function DetailRow({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-orange-100 last:border-b-0">
      <span className="text-lg leading-none mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-stone-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-stone-500 mt-0.5">ends {sub}</p>}
      </div>
    </div>
  );
}

export default function PanchangPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [viewDate, setViewDate] = useState<Date>(new Date(today));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));
  const [selectedPanchang, setSelectedPanchang] = useState<DayPanchang | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const panchangCacheRef = useRef<Map<string, DayPanchang>>(new Map());

  // Load panchangam library
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Panchangam) {
      setLibraryLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@ishubhamx/panchangam-js@2.2.6/dist/index.min.js";
    script.async = true;
    script.onload = () => setLibraryLoaded(true);
    script.onerror = () => setLibraryLoaded(true); // still proceed with fallback
    document.head.appendChild(script);
  }, []);

  const getCacheKey = (date: Date, cityName: string) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${cityName}`;

  const computeAndCache = useCallback(async (date: Date, city: City): Promise<DayPanchang> => {
    const key = getCacheKey(date, city.name);
    if (panchangCacheRef.current.has(key)) {
      return panchangCacheRef.current.get(key)!;
    }
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
        date: d,
        panchang: null,
        isCurrentMonth: d.getMonth() === month,
        isToday: d.getTime() === today.getTime(),
        isSelected: d.getTime() === selDate.getTime(),
      });
      cur.setDate(cur.getDate() + 1);
    }

    setCalendarDays([...days]);

    // Load panchang for current month days in batches
    const currentMonthDays = days.filter(d => d.isCurrentMonth);
    const batchSize = 5;
    for (let i = 0; i < currentMonthDays.length; i += batchSize) {
      const batch = currentMonthDays.slice(i, i + batchSize);
      await Promise.all(batch.map(async (day) => {
        const panchang = await computeAndCache(day.date, city);
        day.panchang = panchang;
      }));
      setCalendarDays(prev => [...prev]);
    }

    setIsLoadingMonth(false);
  }, [computeAndCache, today]);

  useEffect(() => {
    if (!libraryLoaded) return;
    panchangCacheRef.current.clear();
    buildCalendar(viewDate.getFullYear(), viewDate.getMonth(), selectedCity, selectedDate);
  }, [libraryLoaded, viewDate.getFullYear(), viewDate.getMonth(), selectedCity]);

  useEffect(() => {
    if (!libraryLoaded) return;
    setIsLoadingSidebar(true);
    computeAndCache(selectedDate, selectedCity).then((result) => {
      setSelectedPanchang(result);
      setIsLoadingSidebar(false);
    });
  }, [libraryLoaded, selectedDate, selectedCity, computeAndCache]);

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setCalendarDays(prev =>
      prev.map(d => ({ ...d, isSelected: d.date.getTime() === day.date.getTime() }))
    );
    if (!day.isCurrentMonth) {
      setViewDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }
  };

  const goToPrevMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  };

  const goToNextMonth = () => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  };

  const goToToday = () => {
    const t = new Date(today);
    setSelectedDate(t);
    setViewDate(t);
    setCalendarDays(prev =>
      prev.map(d => ({ ...d, isSelected: d.date.getTime() === t.getTime() }))
    );
  };

  const formatSelectedDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const selectedDateFormatted = formatSelectedDate(selectedDate);
  const selectedFestivals = getFestivalsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <header className="om-gradient shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner">
                🕉️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Om Panchang</h1>
                <p className="text-orange-100 text-xs font-medium">Accurate Regional Hindu Calendar & Panchangam</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm">📍</span>
                <select
                  value={selectedCity.name}
                  onChange={e => {
                    const city = CITIES.find(c => c.name === e.target.value)!;
                    setSelectedCity(city);
                    panchangCacheRef.current.clear();
                  }}
                  className="pl-8 pr-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 text-sm font-medium backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[160px] appearance-none cursor-pointer hover:bg-white/30 transition"
                >
                  {CITIES.map(c => (
                    <option key={c.name} value={c.name} className="text-stone-800 bg-white">
                      {c.name}, {c.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-2xl shadow-md card-glow overflow-hidden sticky top-[72px]">
            {/* Sidebar header */}
            <div className="om-gradient px-5 py-4">
              <p className="text-orange-100 text-xs font-semibold uppercase tracking-widest mb-1">Daily Panchang</p>
              <p className="text-white font-bold text-base leading-snug">{selectedDateFormatted}</p>
            </div>

            {/* Festivals */}
            {selectedFestivals.length > 0 && (
              <div className="px-5 py-3 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
                <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-2">🎉 Festivals & Events</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFestivals.map((f, i) => (
                    <span key={i} className="festival-badge text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="px-5 py-3">
              {isLoadingSidebar ? (
                <LoadingSpinner />
              ) : selectedPanchang ? (
                <>
                  <DetailRow icon="🌅" label="Sunrise" value={selectedPanchang.sunrise} />
                  <DetailRow icon="🌇" label="Sunset" value={selectedPanchang.sunset} />
                  <DetailRow icon="🌙" label="Moonrise" value={selectedPanchang.moonrise} />
                  <DetailRow icon="🌑" label="Moonset" value={selectedPanchang.moonset} />
                  <DetailRow icon="📅" label="Tithi" value={selectedPanchang.tithi} sub={selectedPanchang.tithiEnd} />
                  <DetailRow icon="⭐" label="Nakshatra" value={selectedPanchang.nakshatra} sub={selectedPanchang.nakshatraEnd} />
                  <DetailRow icon="🔯" label="Yoga" value={selectedPanchang.yoga} />
                  <DetailRow icon="☯️" label="Karana" value={selectedPanchang.karana} />
                  <DetailRow icon="🌓" label="Paksha" value={selectedPanchang.paksha} />
                  <DetailRow icon="⚠️" label="Rahu Kalam" value={selectedPanchang.rahuKalam} />
                </>
              ) : (
                <p className="text-sm text-stone-500 py-4 text-center">Select a date to view details</p>
              )}
            </div>

            {/* Footer note */}
            <div className="px-5 py-3 bg-orange-50 border-t border-orange-100">
              <p className="text-xs text-orange-600 text-center">
                📍 {selectedCity.name}, {selectedCity.country}
              </p>
            </div>
          </div>
        </aside>

        {/* Calendar */}
        <div className="flex-1 order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-md card-glow overflow-hidden">
            {/* Calendar header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevMonth}
                  className="w-9 h-9 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center justify-center text-lg font-bold transition"
                >
                  ‹
                </button>
                <h2 className="text-xl font-bold text-stone-800 min-w-[200px] text-center">
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="w-9 h-9 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center justify-center text-lg font-bold transition"
                >
                  ›
                </button>
              </div>
              <button
                onClick={goToToday}
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition shadow-sm"
              >
                Today
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-orange-100">
              {WEEKDAYS.map((day, i) => (
                <div
                  key={day}
                  className={`py-2 text-center text-xs font-bold uppercase tracking-wide ${
                    i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-stone-500"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Loading overlay */}
            {isLoadingMonth && calendarDays.length === 0 && (
              <div className="py-12">
                <LoadingSpinner />
              </div>
            )}

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const festivals = getFestivalsForDate(day.date);
                const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
                const isSun = day.date.getDay() === 0;

                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative border-b border-r border-orange-50 cursor-pointer min-h-[80px] sm:min-h-[90px] p-1.5 sm:p-2 day-card-hover
                      ${!day.isCurrentMonth ? "bg-stone-50/50 opacity-50" : ""}
                      ${day.isSelected ? "bg-orange-500 text-white ring-2 ring-orange-400 ring-inset z-10" : "hover:bg-orange-50"}
                      ${day.isToday && !day.isSelected ? "bg-amber-50 ring-2 ring-amber-400 ring-inset" : ""}
                    `}
                  >
                    {/* Date number */}
                    <div className={`
                      flex items-center justify-between mb-1
                    `}>
                      <span className={`
                        w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                        ${day.isSelected ? "bg-white text-orange-600" : ""}
                        ${day.isToday && !day.isSelected ? "bg-amber-400 text-white" : ""}
                        ${!day.isSelected && !day.isToday ? (isSun ? "text-red-500" : isWeekend ? "text-blue-500" : "text-stone-700") : ""}
                      `}>
                        {day.date.getDate()}
                      </span>
                      {festivals.length > 0 && (
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${day.isSelected ? "bg-white" : "bg-red-500"}`} />
                      )}
                    </div>

                    {/* Panchang mini details */}
                    {day.isCurrentMonth && (
                      <div className="space-y-0.5">
                        {day.panchang ? (
                          <>
                            <p className={`text-xs font-medium leading-tight truncate ${day.isSelected ? "text-orange-100" : "text-orange-700"}`}>
                              {day.panchang.tithi}
                            </p>
                            <p className={`text-xs leading-tight truncate hidden sm:block ${day.isSelected ? "text-orange-200" : "text-stone-500"}`}>
                              {day.panchang.nakshatra}
                            </p>
                          </>
                        ) : (
                          <div className={`h-3 rounded animate-pulse ${day.isSelected ? "bg-orange-400" : "bg-orange-100"}`} />
                        )}
                        {festivals.length > 0 && (
                          <p className={`text-xs font-semibold leading-tight truncate ${day.isSelected ? "text-white" : "text-red-600"}`}>
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
            <div className="px-5 py-3 border-t border-orange-100 bg-orange-50 flex flex-wrap items-center gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Festival</span>
              </div>
              <div className="ml-auto flex items-center gap-1 text-orange-600 font-medium">
                <span>🕉️</span>
                <span>Panchang data based on {selectedCity.name}</span>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 shadow-md text-white">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📿</span>
              <div>
                <p className="font-bold text-sm">About Panchang</p>
                <p className="text-orange-100 text-xs mt-1 leading-relaxed">
                  Panchang (Sanskrit: पञ्चाङ्ग) is the Hindu almanac giving five key elements of each day: 
                  <strong className="text-white"> Tithi</strong> (lunar day), 
                  <strong className="text-white"> Nakshatra</strong> (lunar mansion), 
                  <strong className="text-white"> Yoga</strong> (auspiciousness), 
                  <strong className="text-white"> Karana</strong> (half-tithi), and 
                  <strong className="text-white"> Vara</strong> (weekday).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-stone-500 text-xs mt-4">
        <p className="flex items-center justify-center gap-2">
          <span>🕉️</span>
          <span>Om Panchang · Accurate Hindu Calendar & Panchangam</span>
          <span>🕉️</span>
        </p>
        <p className="mt-1 text-stone-400">Calculations based on Drik Panchang methodology</p>
      </footer>
    </div>
  );
}
