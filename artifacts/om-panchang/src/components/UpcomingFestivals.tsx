import { useMemo } from "react";
import { getUpcomingFestivals } from "@/lib/panchangData";
import { gcalUrl } from "@/lib/i18n";
import { FESTIVALS } from "@/lib/festivalsData";

// Map of festival-name keywords → dedicated landing page slug
const FESTIVAL_SLUG_MAP: { match: string; slug: string }[] = [
  { match: "Diwali", slug: "diwali" },
  { match: "Dhanteras", slug: "dhanteras" },
  { match: "Bhai Dooj", slug: "bhai-dooj" },
  { match: "Bhai Phonta", slug: "bhai-dooj" },
  { match: "Raksha Bandhan", slug: "raksha-bandhan" },
  { match: "Rakhi", slug: "raksha-bandhan" },
  { match: "Janmashtami", slug: "janmashtami" },
  { match: "Krishna Jayanti", slug: "janmashtami" },
  { match: "Ganesh Chaturthi", slug: "ganesh-chaturthi" },
  { match: "Vinayaka Chaturthi", slug: "ganesh-chaturthi" },
  { match: "Navratri", slug: "navratri" },
  { match: "Dussehra", slug: "dussehra" },
  { match: "Vijayadashami", slug: "dussehra" },
  { match: "Karva Chauth", slug: "karwa-chauth" },
  { match: "Karwa Chauth", slug: "karwa-chauth" },
  { match: "Chhath", slug: "chhath-puja" },
  { match: "Guru Purnima", slug: "guru-purnima" },
  { match: "Buddha Purnima", slug: "buddha-purnima" },
  { match: "Vesak", slug: "buddha-purnima" },
  { match: "Akshaya Tritiya", slug: "akshaya-tritiya" },
  { match: "Holi", slug: "holi" },
  { match: "Holika", slug: "holi" },
  { match: "Maha Shivratri", slug: "maha-shivratri" },
  { match: "Maha Shivaratri", slug: "maha-shivratri" },
  { match: "Ram Navami", slug: "ram-navami" },
  { match: "Hanuman Jayanti", slug: "hanuman-jayanti" },
  { match: "Ugadi", slug: "ugadi" },
  { match: "Gudi Padwa", slug: "ugadi" },
];

const VALID_SLUGS = new Set(FESTIVALS.map(f => f.slug));

function getFestivalSlug(name: string): string | null {
  for (const { match, slug } of FESTIVAL_SLUG_MAP) {
    if (name.includes(match) && VALID_SLUGS.has(slug)) return slug;
  }
  return null;
}

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
                {names.map((name, i) => {
                  const slug = getFestivalSlug(name);
                  const inner = (
                    <>
                      <span className="text-base leading-none">{getFestivalIcon(name)}</span>
                      <p className={`font-semibold text-sm truncate ${i === 0 ? "text-slate-800" : "text-slate-600 text-xs"} ${slug ? "group-hover:text-indigo-700 group-hover:underline" : ""}`}>
                        {name}
                      </p>
                    </>
                  );
                  return slug ? (
                    <a key={i} href={`/${slug}`} className="group flex items-center gap-1.5" title={`Read about ${name}`}>
                      {inner}
                    </a>
                  ) : (
                    <div key={i} className="flex items-center gap-1.5">{inner}</div>
                  );
                })}
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
