import { useMemo } from "react";
import { FESTIVALS } from "@/lib/festivalsData";

function getNextOccurrence(slug: string): { date: string; year: number } | null {
  const f = FESTIVALS.find(x => x.slug === slug);
  if (!f) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = f.occurrences
    .map(o => ({ ...o, d: new Date(o.date + "T00:00:00") }))
    .filter(o => o.d >= today)
    .sort((a, b) => a.d.getTime() - b.d.getTime())[0];
  if (!upcoming) return null;
  return { date: upcoming.date, year: upcoming.year };
}

function formatShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).format(d);
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export default function FestivalGuidesGrid() {
  const cards = useMemo(() => {
    return FESTIVALS.map(f => {
      const next = getNextOccurrence(f.slug);
      return {
        slug: f.slug,
        name: f.name,
        sanskrit: f.sanskrit,
        deity: f.deity,
        deityImage: f.deityImage,
        nextDate: next?.date,
        sortKey: next ? new Date(next.date + "T00:00:00").getTime() : Number.MAX_SAFE_INTEGER,
      };
    }).sort((a, b) => a.sortKey - b.sortKey);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm card-glow border border-indigo-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-5 py-4">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <span>📖</span> Festival Guides
        </h2>
        <p className="text-indigo-200 text-xs mt-0.5">
          In-depth guides with muhurat timings, rituals, mantras & stories — for {cards.length} major Hindu festivals
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        {cards.map(card => {
          const days = card.nextDate ? daysUntil(card.nextDate) : null;
          return (
            <a
              key={card.slug}
              href={`/${card.slug}`}
              className="group relative bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl border border-amber-200 hover:border-indigo-400 hover:shadow-md transition overflow-hidden flex flex-col"
            >
              {card.deityImage && (
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={card.deityImage}
                    alt={card.deity}
                    loading="lazy"
                    className="no-invert h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-3 flex-1 flex flex-col">
                <p className="font-bold text-sm text-slate-800 leading-tight group-hover:text-indigo-700">
                  {card.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{card.sanskrit}</p>
                {card.nextDate && (
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <p className="text-[11px] text-slate-600 font-medium">
                      {formatShort(card.nextDate)}
                    </p>
                    {days !== null && days >= 0 && days <= 60 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        days <= 7 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {days === 0 ? "Today" : `${days}d`}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-[11px] font-semibold text-indigo-600 group-hover:text-indigo-800 group-hover:underline">
                  Read guide →
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
