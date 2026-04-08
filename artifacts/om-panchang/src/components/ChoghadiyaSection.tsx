// Full Choghadiya table for the Panchang tab
import { useMemo } from "react";
import { computeChoghadiya, ChoghadiyaSlot, ChoghadiyaType } from "@/lib/choghadiya";

interface Props {
  date:           Date;
  sunrise:        string;
  sunset:         string;
  city:           string;
  utcOffsetHours: number;
}

const ROW_COLORS: Record<string, string> = {
  good:    "bg-emerald-50 border-emerald-100",
  neutral: "bg-amber-50  border-amber-100",
  bad:     "bg-rose-50   border-rose-100",
};
const NAME_COLORS: Record<string, string> = {
  good:    "text-emerald-700",
  neutral: "text-amber-700",
  bad:     "text-rose-700",
};
const BADGE_COLORS: Record<string, string> = {
  good:    "bg-emerald-100 text-emerald-800",
  neutral: "bg-amber-100  text-amber-800",
  bad:     "bg-rose-100   text-rose-800",
};

function SlotRow({ slot, index }: { slot: ChoghadiyaSlot; index: number }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b last:border-0 transition
      ${ROW_COLORS[slot.quality]}
      ${slot.isCurrent ? "ring-2 ring-inset ring-indigo-400" : ""}
    `}>
      <span className="text-slate-400 text-xs w-5 text-right font-mono">{index + 1}</span>
      <span className="text-xl w-7 text-center">{slot.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-bold text-sm ${NAME_COLORS[slot.quality]}`}>{slot.name}</span>
          {slot.isCurrent && (
            <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full animate-pulse">
              NOW
            </span>
          )}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${BADGE_COLORS[slot.quality]}`}>
            {slot.quality === "good" ? "Auspicious" : slot.quality === "neutral" ? "Neutral" : "Avoid"}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{slot.meaning}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-700">{slot.start}</p>
        <p className="text-xs text-slate-400">{slot.end}</p>
      </div>
    </div>
  );
}

export default function ChoghadiyaSection({ date, sunrise, sunset, city, utcOffsetHours }: Props) {
  const { day, night, currentSlot } = useMemo(
    () => computeChoghadiya(date, sunrise, sunset, utcOffsetHours),
    [date, sunrise, sunset, utcOffsetHours],
  );

  const dayLabel = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-5 py-4 text-white">
        <p className="text-indigo-200 text-xs uppercase tracking-widest font-semibold">Choghadiya</p>
        <h2 className="text-lg font-bold mt-0.5">Auspicious Time Slots</h2>
        <p className="text-indigo-200 text-sm">{dayLabel} · 📍 {city}</p>
        <p className="text-indigo-300 text-xs mt-1">Sunrise {sunrise} · Sunset {sunset}</p>
      </div>

      {/* Current slot callout */}
      {currentSlot ? (
        <div className={`rounded-xl px-4 py-3 border-2 flex items-center gap-3
          ${currentSlot.quality === "good"    ? "bg-emerald-50 border-emerald-300" :
            currentSlot.quality === "neutral" ? "bg-amber-50  border-amber-300"  :
                                                "bg-rose-50   border-rose-300"}`}>
          <span className="text-3xl">{currentSlot.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current Choghadiya</p>
            <p className={`font-bold text-lg ${NAME_COLORS[currentSlot.quality]}`}>
              {currentSlot.name} &nbsp;·&nbsp; {currentSlot.start} – {currentSlot.end}
            </p>
            <p className="text-sm text-slate-600 mt-0.5">{currentSlot.meaning}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 text-sm text-slate-500 text-center">
          Select today's date to see the current Choghadiya
        </div>
      )}

      {/* Quick reference legend */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { label: "Auspicious",  desc: "Amrit · Shubh · Labh", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
          { label: "Neutral",     desc: "Char",                  color: "bg-amber-100  text-amber-800  border-amber-200"  },
          { label: "Avoid",       desc: "Udveg · Rog · Kaal",    color: "bg-rose-100   text-rose-800   border-rose-200"   },
        ].map(row => (
          <div key={row.label} className={`rounded-lg px-3 py-2 border text-center ${row.color}`}>
            <p className="font-bold">{row.label}</p>
            <p className="opacity-70 text-[10px] mt-0.5">{row.desc}</p>
          </div>
        ))}
      </div>

      {/* Day slots */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border-b border-indigo-100">
          <span className="text-base">🌅</span>
          <div>
            <p className="text-sm font-bold text-indigo-700">Day Choghadiya</p>
            <p className="text-xs text-slate-400">Sunrise ({sunrise}) to Sunset ({sunset})</p>
          </div>
        </div>
        {day.map((slot, i) => <SlotRow key={i} slot={slot} index={i} />)}
      </div>

      {/* Night slots */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-indigo-950/5 border-b border-indigo-100">
          <span className="text-base">🌙</span>
          <div>
            <p className="text-sm font-bold text-indigo-700">Night Choghadiya</p>
            <p className="text-xs text-slate-400">Sunset ({sunset}) to next Sunrise</p>
          </div>
        </div>
        {night.map((slot, i) => <SlotRow key={i} slot={slot} index={i} />)}
      </div>

      {/* Info note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
        <strong>🕉️ About Choghadiya:</strong> A traditional Vedic system that divides the day and
        night into 8 equal time slots, each governed by a planetary quality. Used by Hindus across
        India and the diaspora to choose the right time for travel, business, ceremonies, and daily tasks.
      </div>
    </div>
  );
}
