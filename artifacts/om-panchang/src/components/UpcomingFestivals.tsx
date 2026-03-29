import { useMemo } from "react";
import { getUpcomingFestivals } from "@/lib/panchangData";

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
}

export default function UpcomingFestivals({ today }: Props) {
  const festivals = useMemo(() => getUpcomingFestivals(today, 10), [today]);

  return (
    <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
      <div className="gold-gradient px-5 py-3 flex items-center gap-2">
        <span className="text-xl">🎉</span>
        <div>
          <p className="text-slate-900 font-bold text-sm">Upcoming Festivals</p>
          <p className="text-amber-800 text-xs">Utsav & Parva Calendar</p>
        </div>
      </div>

      <div className="divide-y divide-indigo-50">
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
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-indigo-50">
        <p className="text-xs text-slate-400 text-center">Showing next 10 festivals & observances</p>
      </div>
    </div>
  );
}
