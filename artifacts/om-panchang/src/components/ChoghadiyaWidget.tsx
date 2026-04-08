// Compact Choghadiya widget for the Home tab
import { useMemo } from "react";
import { computeChoghadiya, ChoghadiyaSlot } from "@/lib/choghadiya";

interface Props {
  date:           Date;
  sunrise:        string;
  sunset:         string;
  utcOffsetHours: number;
  onViewAll?:     () => void;
}

const QUALITY_COLORS: Record<string, string> = {
  good:    "bg-emerald-100 text-emerald-800 border-emerald-200",
  neutral: "bg-amber-100  text-amber-800  border-amber-200",
  bad:     "bg-rose-100   text-rose-800   border-rose-200",
};

const QUALITY_DOT: Record<string, string> = {
  good:    "bg-emerald-500",
  neutral: "bg-amber-500",
  bad:     "bg-rose-500",
};

export default function ChoghadiyaWidget({ date, sunrise, sunset, utcOffsetHours, onViewAll }: Props) {
  const { day, night, currentSlot } = useMemo(
    () => computeChoghadiya(date, sunrise, sunset, utcOffsetHours),
    [date, sunrise, sunset, utcOffsetHours],
  );

  const allSlots = [...day, ...night];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-50 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">⏰</span>
          <div>
            <p className="text-sm font-bold text-slate-800">Choghadiya</p>
            <p className="text-xs text-slate-400">Auspicious time slots today</p>
          </div>
        </div>
        {onViewAll && (
          <button onClick={onViewAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition">
            Full table →
          </button>
        )}
      </div>

      {/* Current slot highlight */}
      {currentSlot && (
        <div className={`mx-4 mt-3 px-4 py-2.5 rounded-xl border flex items-center gap-3 ${QUALITY_COLORS[currentSlot.quality]}`}>
          <span className="text-xl">{currentSlot.icon}</span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide opacity-70">Current Choghadiya</p>
            <p className="font-bold text-sm">{currentSlot.name} &nbsp;·&nbsp; {currentSlot.start} – {currentSlot.end}</p>
            <p className="text-xs opacity-80 mt-0.5">{currentSlot.meaning}</p>
          </div>
        </div>
      )}

      {/* Day slots compact row */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">🌅 Day Choghadiya</p>
        <div className="grid grid-cols-4 gap-1.5">
          {day.map((slot, i) => (
            <div key={i}
              className={`rounded-lg px-2 py-1.5 text-center border text-xs font-medium transition
                ${slot.isCurrent ? "ring-2 ring-indigo-400 shadow-sm" : ""}
                ${QUALITY_COLORS[slot.quality]}`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${QUALITY_DOT[slot.quality]}`} />
                <span className="font-bold">{slot.name}</span>
              </div>
              <div className="opacity-70 text-[10px] leading-tight">{slot.start}</div>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-3 mb-2">🌙 Night Choghadiya</p>
        <div className="grid grid-cols-4 gap-1.5">
          {night.map((slot, i) => (
            <div key={i}
              className={`rounded-lg px-2 py-1.5 text-center border text-xs font-medium transition
                ${slot.isCurrent ? "ring-2 ring-indigo-400 shadow-sm" : ""}
                ${QUALITY_COLORS[slot.quality]}`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${QUALITY_DOT[slot.quality]}`} />
                <span className="font-bold">{slot.name}</span>
              </div>
              <div className="opacity-70 text-[10px] leading-tight">{slot.start}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-3 mt-2.5 text-[10px] text-slate-400">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Good</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500  inline-block" />Neutral</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500   inline-block" />Avoid</div>
        </div>
      </div>
    </div>
  );
}
