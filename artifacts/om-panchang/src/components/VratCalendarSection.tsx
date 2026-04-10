import { useState, useMemo } from "react";
import { VRAT_DATA, VRAT_TYPE_LABELS, type VratEntry } from "../lib/vratData";

const FILTERS: { key: VratEntry["type"] | "all"; label: string; icon: string }[] = [
  { key: "all",       label: "All Vrats",   icon: "🙏" },
  { key: "ekadashi",  label: "Ekadashi",    icon: "🌙" },
  { key: "purnima",   label: "Purnima",     icon: "🌕" },
  { key: "amavasya",  label: "Amavasya",    icon: "🌑" },
  { key: "pradosh",   label: "Pradosh",     icon: "🕉️" },
  { key: "sankashti", label: "Sankashti",   icon: "🐘" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", weekday: "short" });
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

interface Props {
  initialYear?: number;
  defaultFilter?: VratEntry["type"] | "all";
}

export default function VratCalendarSection({ initialYear, defaultFilter = "all" }: Props) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(initialYear ?? currentYear);
  const [filter, setFilter] = useState<VratEntry["type"] | "all">(defaultFilter);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);

  const todayStr = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    return VRAT_DATA
      .filter(v => {
        const matchYear = v.date.startsWith(String(year));
        const matchType = filter === "all" || v.type === filter;
        const matchUpcoming = !showUpcomingOnly || v.date >= todayStr;
        return matchYear && matchType && matchUpcoming;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [year, filter, showUpcomingOnly, todayStr]);

  const groupedByMonth = useMemo(() => {
    const map = new Map<string, VratEntry[]>();
    for (const v of filtered) {
      const month = v.date.slice(0, 7);
      if (!map.has(month)) map.set(month, []);
      map.get(month)!.push(v);
    }
    return map;
  }, [filtered]);

  const monthLabel = (ym: string) => {
    const [y, m] = ym.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl px-5 py-4 text-white">
        <p className="text-indigo-300 text-xs uppercase tracking-widest font-semibold">Hindu Fasting Calendar</p>
        <h2 className="text-xl font-bold mt-0.5">Vrat & Festival Dates {year}</h2>
        <p className="text-indigo-200 text-xs mt-1">Ekadashi · Purnima · Amavasya · Pradosh · Sankashti Chaturthi</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-4 space-y-3">
        {/* Year picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</span>
          {[2025, 2026].map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                year === y
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              {y}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showUpcomingOnly}
              onChange={e => setShowUpcomingOnly(e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            Upcoming only
          </label>
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === f.key
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-indigo-100 p-10 text-center text-slate-400 text-sm">
          No upcoming vrats found for the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(groupedByMonth.entries()).map(([ym, vrats]) => (
            <div key={ym} className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
              {/* Month header */}
              <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-2.5">
                <p className="font-bold text-indigo-800 text-sm">{monthLabel(ym)}</p>
              </div>

              {/* Vrat rows */}
              <div className="divide-y divide-slate-50">
                {vrats.map(v => {
                  const meta = VRAT_TYPE_LABELS[v.type];
                  const daysUntil = getDaysUntil(v.date);
                  const isToday = daysUntil === 0;
                  const isPast = daysUntil < 0;
                  const dayOfWeek = WEEKDAYS[new Date(v.date + "T12:00:00").getDay()];

                  return (
                    <div
                      key={v.date + v.name}
                      className={`flex items-start gap-4 px-5 py-3.5 ${
                        isToday ? "bg-amber-50" : isPast ? "opacity-50" : ""
                      }`}
                    >
                      {/* Date badge */}
                      <div className="flex-shrink-0 w-14 text-center">
                        <p className="text-2xl font-black text-indigo-800 leading-none">
                          {v.date.slice(8)}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{dayOfWeek}</p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color}`}>
                            {meta.icon} {meta.label}
                          </span>
                          {v.special && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-rose-50 border-rose-200 text-rose-700">
                              ⭐ Important
                            </span>
                          )}
                          {isToday && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-900">
                              TODAY
                            </span>
                          )}
                          {!isPast && !isToday && daysUntil <= 7 && (
                            <span className="text-xs text-indigo-600 font-semibold">
                              in {daysUntil} day{daysUntil !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                        {v.month && (
                          <p className="text-xs text-indigo-600 font-medium">
                            {v.month} {v.paksha ? `· ${v.paksha === "shukla" ? "Shukla Paksha" : "Krishna Paksha"}` : ""}
                          </p>
                        )}
                        {v.significance && (
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{v.significance}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-slate-400 pb-2">
        * Dates may vary by ±1 day based on location and local sunrise. Consult your local panchang for precise timings.
      </p>
    </div>
  );
}
