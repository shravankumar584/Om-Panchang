import { useMemo } from "react";
import { getUpcomingFestivals } from "@/lib/panchangData";
import { gcalUrl } from "@/lib/i18n";

const FESTIVAL_ICONS: Record<string, string> = {
  "Makar Sankranti": "🪁", "Pongal": "🍚", "Vasant Panchami": "🌸",
  "Maha Shivaratri": "🔱", "Holika Dahan": "🔥", "Holi": "🎨",
  "Ugadi": "🌿", "Gudi Padwa": "🪔", "Ram Navami": "🏹",
  "Hanuman Jayanti": "🙏", "Tamil New Year": "🌺", "Vishu": "🌼",
  "Baisakhi": "🌾", "Akshaya Tritiya": "💛", "Vat Savitri": "🌳",
  "Guru Purnima": "📿", "Rath Yatra": "🎡", "Naga Panchami": "🐍",
  "Raksha Bandhan": "🎀", "Krishna Janmashtami": "🎶", "Ganesh Chaturthi": "🐘",
  "Onam": "🌸", "Navratri Begins": "💃", "Dussehra": "🎯",
  "Karva Chauth": "🌙", "Diwali": "🪔", "Govardhan Puja": "🌿",
  "Bhai Dooj": "❤️", "Chhath Puja": "🌅", "Dev Uthani Ekadashi": "🛐",
  "Christmas": "⭐", "Chaitra Navratri Ends": "💃",
};

function getFestivalIcon(name: string): string {
  for (const [key, icon] of Object.entries(FESTIVAL_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return "🎉";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric", weekday: "short",
  }).format(d);
}

interface Props {
  today: Date;
  count?: number;
  onViewAll?: () => void;
}

export default function UpcomingFestivals({ today, count = 10, onViewAll }: Props) {
  const festivals = useMemo(() => getUpcomingFestivals(today, count), [today, count]);

  return (
    <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
      <div className="gold-gradient px-5 py-3 flex items-center gap-2">
        <span className="text-xl">🎉</span>
        <div>
          <p className="text-slate-900 font-bold text-sm">Upcoming Festivals</p>
          <p className="text-amber-800 text-xs">Utsav & Parva Calendar</p>
        </div>
      </div>

      <div className={`divide-y divide-indigo-50 ${onViewAll ? "max-h-80 overflow-y-auto" : ""}`}>
        {festivals.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No upcoming festivals found</p>
        ) : (
          festivals.map(({ dateStr, names, daysLeft }) => (
            <div key={dateStr} className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50/40 transition">
              {/* Days countdown badge */}
              <div className={`flex-shrink-0 text-center min-w-[52px] rounded-xl py-1 px-2 ${
                daysLeft === 0
                  ? "bg-rose-100 text-rose-700"
                  : daysLeft <= 7
                  ? "bg-amber-100 text-amber-700"
                  : "bg-indigo-50 text-indigo-600"
              }`}>
                <p className="text-lg font-bold leading-tight">
                  {daysLeft === 0 ? "Today" : daysLeft}
                </p>
                {daysLeft > 0 && <p className="text-xs font-medium leading-tight">
                  {daysLeft === 1 ? "day" : "days"}
                </p>}
              </div>

              <div className="flex-1 min-w-0">
                {names.map((name, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{getFestivalIcon(name)}</span>
                    <p className={`font-semibold text-sm truncate ${i === 0 ? "text-slate-800" : "text-slate-600 text-xs"}`}>
                      {name}
                    </p>
                  </div>
                ))}
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(dateStr)}</p>
              </div>

              {/* Add to Google Calendar button */}
              <a
                href={gcalUrl(names[0], dateStr)}
                target="_blank"
                rel="noopener noreferrer"
                title="Add to Google Calendar"
                className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-2 py-1.5 transition whitespace-nowrap"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                </svg>
                + GCal
              </a>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-indigo-50 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-400">Showing {festivals.length} upcoming festivals</p>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            View All →
          </button>
        )}
      </div>
    </div>
  );
}
