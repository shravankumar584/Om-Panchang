import { useState } from "react";
import { ZODIAC_SIGNS } from "@/lib/horoscopeData";

export default function HoroscopeWidget() {
  const [sel, setSel] = useState("aries");
  const sign = ZODIAC_SIGNS.find((s) => s.slug === sel)!;
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm" data-testid="horoscope-widget">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">✨</span>
        <h3 className="font-bold text-stone-800">Today's Horoscope</h3>
      </div>
      <p className="text-xs text-stone-600 mb-3">Pick your rashi to read today's free Vedic prediction.</p>
      <select
        value={sel}
        onChange={(e) => setSel(e.target.value)}
        className="w-full border border-stone-300 rounded-lg px-3 py-2 mb-3 text-sm bg-white focus:outline-none focus:border-indigo-400"
        data-testid="horoscope-widget-select"
      >
        {ZODIAC_SIGNS.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.symbol}  {s.english} ({s.sanskrit})
          </option>
        ))}
      </select>
      <a
        href={`/horoscope/${sign.slug}`}
        className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg py-2 transition"
        data-testid="horoscope-widget-link"
      >
        Read {sign.english} Horoscope →
      </a>
      <a
        href="/horoscope"
        className="block text-center text-xs text-indigo-600 hover:underline mt-2"
      >
        See all 12 zodiac signs
      </a>
    </div>
  );
}
