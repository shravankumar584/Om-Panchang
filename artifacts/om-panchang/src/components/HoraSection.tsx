import { useMemo } from "react";
import { computeHoraTimings, HoraSlot, Planet } from "@/lib/horaTimings";

interface Props {
  date:           Date;
  sunrise:        string;
  sunset:         string;
  city:           string;
  utcOffsetHours: number;
}

const PLANET_NAME_COLOR: Record<Planet, string> = {
  Sun:     "text-amber-700",
  Moon:    "text-slate-600",
  Mars:    "text-rose-700",
  Mercury: "text-emerald-700",
  Jupiter: "text-yellow-700",
  Venus:   "text-pink-700",
  Saturn:  "text-indigo-700",
};

function SlotRow({ slot, index }: { slot: HoraSlot; index: number }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 border-b last:border-0 transition
      ${slot.bgColor}
      ${slot.isCurrent ? "ring-2 ring-inset ring-indigo-400" : ""}
    `}>
      <span className="text-slate-400 text-xs w-5 text-right font-mono shrink-0">{index + 1}</span>
      <span className="text-lg w-7 text-center shrink-0">{slot.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`font-bold text-sm ${PLANET_NAME_COLOR[slot.planet]}`}>{slot.planet}</span>
          {slot.isCurrent && (
            <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full animate-pulse">
              NOW
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{slot.domains}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-700">{slot.start}</p>
        <p className="text-xs text-slate-400">{slot.end}</p>
      </div>
    </div>
  );
}

export default function HoraSection({ date, sunrise, sunset, city, utcOffsetHours }: Props) {
  const { day, night, currentSlot } = useMemo(
    () => computeHoraTimings(date, sunrise, sunset, utcOffsetHours),
    [date, sunrise, sunset, utcOffsetHours],
  );

  const dayLabel = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl px-5 py-4 text-white">
        <p className="text-violet-200 text-xs uppercase tracking-widest font-semibold">Vedic Planetary Hours</p>
        <h2 className="text-lg font-bold mt-0.5">Hora Timings</h2>
        <p className="text-violet-200 text-sm">{dayLabel} · 📍 {city}</p>
        <p className="text-violet-300 text-xs mt-1">Sunrise {sunrise} · Sunset {sunset}</p>
      </div>

      {/* Current hora callout */}
      {currentSlot ? (
        <div className={`rounded-xl px-4 py-3 border-2 flex items-center gap-3 ${currentSlot.bgColor}`}>
          <span className="text-3xl">{currentSlot.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current Hora</p>
            <p className={`font-bold text-lg ${PLANET_NAME_COLOR[currentSlot.planet]}`}>
              {currentSlot.planet} Hora &nbsp;·&nbsp; {currentSlot.start} – {currentSlot.end}
            </p>
            <p className="text-sm text-slate-600 mt-0.5">{currentSlot.domains}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl px-4 py-3 bg-slate-50 border border-slate-200 text-sm text-slate-500 text-center">
          Select today's date to see the current Hora
        </div>
      )}

      {/* Planet quick legend */}
      <div className="grid grid-cols-4 gap-1.5 text-xs">
        {(["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"] as Planet[]).map(p => (
          <div key={p} className={`rounded-lg px-2 py-1.5 border text-center ${
            { Sun:"bg-amber-50 border-amber-200 text-amber-700", Moon:"bg-slate-50 border-slate-200 text-slate-600",
              Mars:"bg-rose-50 border-rose-200 text-rose-700", Mercury:"bg-emerald-50 border-emerald-200 text-emerald-700",
              Jupiter:"bg-yellow-50 border-yellow-200 text-yellow-700", Venus:"bg-pink-50 border-pink-200 text-pink-700",
              Saturn:"bg-indigo-50 border-indigo-200 text-indigo-700" }[p]
          }`}>
            <p className="font-bold text-[10px]">{p}</p>
          </div>
        ))}
        <div className="rounded-lg px-2 py-1.5 border border-slate-100 bg-slate-50 text-slate-400 text-center col-span-1">
          <p className="text-[10px]">7 planets</p>
        </div>
      </div>

      {/* Day horas */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border-b border-amber-100">
          <span className="text-base">🌅</span>
          <div>
            <p className="text-sm font-bold text-amber-700">Day Horas (12 slots)</p>
            <p className="text-xs text-slate-400">Sunrise ({sunrise}) to Sunset ({sunset})</p>
          </div>
        </div>
        {day.map((slot, i) => <SlotRow key={i} slot={slot} index={i} />)}
      </div>

      {/* Night horas */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-indigo-950/5 border-b border-indigo-100">
          <span className="text-base">🌙</span>
          <div>
            <p className="text-sm font-bold text-indigo-700">Night Horas (12 slots)</p>
            <p className="text-xs text-slate-400">Sunset ({sunset}) to next Sunrise</p>
          </div>
        </div>
        {night.map((slot, i) => <SlotRow key={i} slot={slot} index={i} />)}
      </div>

      {/* Info note */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 text-xs text-violet-800">
        <strong>🕉️ About Hora:</strong> Each day is divided into 24 planetary hours (Horas) starting
        at sunrise. The first hora is ruled by the weekday's planet lord, and subsequent horas follow
        the Chaldean order: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon. Each planet's
        hora is considered favourable for activities aligned with that planet's domain.
      </div>
    </div>
  );
}
