import { useMemo } from "react";
import { getPlanetaryPositions } from "@/lib/panchangData";

interface Props {
  date: Date;
}

export default function PlanetaryPositions({ date }: Props) {
  const planets = useMemo(() => getPlanetaryPositions(date), [date]);

  return (
    <div className="bg-white rounded-2xl shadow-sm card-glow overflow-hidden border border-indigo-100">
      <div className="panchang-gradient px-5 py-3 flex items-center gap-2">
        <span className="text-xl">🪐</span>
        <div>
          <p className="text-white font-bold text-sm">Planetary Positions</p>
          <p className="text-indigo-200 text-xs">Graha Sthiti (Sidereal / Nirayana)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-50 text-indigo-700 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-2 font-semibold">Graha</th>
              <th className="text-left px-4 py-2 font-semibold hidden sm:table-cell">Planet</th>
              <th className="text-left px-4 py-2 font-semibold">Rashi</th>
              <th className="text-left px-4 py-2 font-semibold hidden md:table-cell">Degrees</th>
              <th className="text-left px-4 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p, i) => (
              <tr key={p.name} className={`border-t border-indigo-50 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.symbol}</span>
                    <span className="font-semibold text-slate-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-500 text-xs hidden sm:table-cell">{p.nameEn}</td>
                <td className="px-4 py-2.5">
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {p.zodiacSign}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-slate-600 font-mono text-xs hidden md:table-cell">
                  {p.degInSign.toFixed(2)}°
                </td>
                <td className="px-4 py-2.5">
                  {p.isRetrograde ? (
                    <span className="inline-flex items-center gap-1 text-amber-700 text-xs font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                      ↺ Vakri
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                      → Margi
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-indigo-50">
        <p className="text-xs text-slate-400 text-center">
          Positions computed using mean orbital elements · Vakri = Retrograde · Margi = Direct
        </p>
      </div>
    </div>
  );
}
