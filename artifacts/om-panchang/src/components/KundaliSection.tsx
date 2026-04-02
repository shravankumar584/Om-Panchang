import { useState, useRef, useEffect } from "react";
import { CITIES, City } from "@/lib/panchangData";
import {
  computeKundali, formatDegree, formatDate, dashaProgress,
  KundaliData, PLANET_COLORS, LAGNA_INTERPRETATIONS,
} from "@/lib/jyotishData";

// ─── Searchable city combobox (geocoding via Nominatim + timezone via Open-Meteo) ─
interface LocationValue {
  name: string;
  lat: number;
  lon: number;
  utcOffset: number;
  timezone?: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: { city?: string; town?: string; village?: string; county?: string; state?: string; country?: string };
}

function friendlyName(r: NominatimResult): string {
  const a = r.address ?? {};
  const city = a.city ?? a.town ?? a.village ?? a.county ?? "";
  const state = a.state ?? "";
  const country = a.country ?? "";
  return [city, state, country].filter(Boolean).join(", ");
}

function CitySearch({ value, onChange }: { value: LocationValue; onChange: (v: LocationValue) => void }) {
  const [query, setQuery] = useState(value.name);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleInput(q: string) {
    setQuery(q);
    setOpen(true);
    setStatus("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(() => fetchCities(q.trim()), 400);
  }

  async function fetchCities(q: string) {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=8`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data: NominatimResult[] = await res.json();
      setResults(data);
      if (data.length === 0) setStatus("No results found");
    } catch {
      setStatus("Search unavailable — check connection");
    }
    setLoading(false);
  }

  async function selectResult(r: NominatimResult) {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    const name = friendlyName(r);
    setQuery(name);
    setOpen(false);
    setResults([]);
    setStatus("Getting timezone…");
    // Fetch timezone from Open-Meteo (free, no API key)
    try {
      const tzRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&timezone=auto&forecast_days=0&hourly=temperature_2m`
      );
      const tzData = await tzRes.json();
      const timezone: string = tzData.timezone ?? "UTC";
      const utcOffset = tzData.utc_offset_seconds ? tzData.utc_offset_seconds / 3600 : lon / 15;
      setStatus("");
      onChange({ name, lat, lon, utcOffset, timezone });
    } catch {
      // Fall back to longitude-based offset
      const utcOffset = Math.round(lon / 15 * 2) / 2;
      setStatus("");
      onChange({ name, lat, lon, utcOffset });
    }
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Type any city name…"
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          className="w-full px-3 py-2 pr-8 rounded-xl border border-indigo-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin text-sm">◌</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-indigo-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-52 overflow-y-auto">
            {results.map(r => (
              <button
                key={r.place_id}
                onMouseDown={() => selectResult(r)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 border-b border-indigo-50 last:border-0"
              >
                <span className="font-medium text-slate-800 block leading-tight">{friendlyName(r)}</span>
                <span className="text-xs text-slate-400">{r.lat}°N, {r.lon}°E</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(status || (!open && value.lat !== 0)) && (
        <p className="text-xs text-slate-400 mt-1">
          {status || `${value.lat.toFixed(4)}°, ${value.lon.toFixed(4)}° · ${value.timezone ?? ("UTC" + (value.utcOffset >= 0 ? "+" : "") + value.utcOffset)}`}
        </p>
      )}
    </div>
  );
}

// ─── North Indian Kundali Chart (SVG) ─────────────────────────────────────────
/*
  House layout (North Indian style):
  Row 0: [H2] [H1] [H12] [H11]
  Row 1: [H3] [  ] [   ] [H10]
  Row 2: [H4] [  ] [   ] [H9 ]
  Row 3: [H5] [H6] [H7 ] [H8 ]
  Center (rows 1-2, cols 1-2) = chart info
*/
const HOUSE_CELLS: Array<{ house: number; row: number; col: number }> = [
  { house: 1, row: 0, col: 1 }, { house: 2, row: 0, col: 0 },
  { house: 3, row: 1, col: 0 }, { house: 4, row: 2, col: 0 },
  { house: 5, row: 3, col: 0 }, { house: 6, row: 3, col: 1 },
  { house: 7, row: 3, col: 2 }, { house: 8, row: 3, col: 3 },
  { house: 9, row: 2, col: 3 }, { house: 10, row: 1, col: 3 },
  { house: 11, row: 0, col: 3 }, { house: 12, row: 0, col: 2 },
];

function NorthIndianChart({ data }: { data: KundaliData }) {
  const CW = 82;
  const CH = 82;
  const W = CW * 4;
  const H = CH * 4;
  const pad = 6;

  const housePlanets: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) housePlanets[h] = [];
  for (const p of data.planets) {
    const h = Math.min(12, Math.max(1, p.house));
    housePlanets[h].push(`${p.symbol}${p.isRetrograde ? "ᴿ" : ""}`);
  }

  // Sign index for each house (Lagna sign = house 1, then +1 each house)
  const signForHouse = (h: number) => (data.lagnaSignIndex + h - 1) % 12;
  const SIGN_ABBR = ["Mes","Vri","Mit","Kar","Sim","Kan","Tul","Vri","Dha","Mak","Kum","Mee"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[340px] mx-auto" style={{ fontFamily: "inherit" }}>
      {/* Background */}
      <rect width={W} height={H} rx={8} fill="#f5f3ff" stroke="#6366f1" strokeWidth={1.5} />

      {/* Grid lines */}
      {[1,2,3].map(i => (
        <line key={`v${i}`} x1={i*CW} y1={0} x2={i*CW} y2={H} stroke="#818cf8" strokeWidth={0.8} />
      ))}
      {[1,2,3].map(i => (
        <line key={`h${i}`} x1={0} y1={i*CH} x2={W} y2={i*CH} stroke="#818cf8" strokeWidth={0.8} />
      ))}

      {/* Center box */}
      <rect x={CW} y={CH} width={2*CW} height={2*CH} fill="#e0e7ff" stroke="#6366f1" strokeWidth={1} />
      <text x={W/2} y={CH*2 - 14} textAnchor="middle" fontSize={10} fill="#4338ca" fontWeight="bold">ॐ</text>
      <text x={W/2} y={CH*2 + 2} textAnchor="middle" fontSize={8.5} fill="#4338ca" fontWeight="600">
        {data.lagnaSign}
      </text>
      <text x={W/2} y={CH*2 + 15} textAnchor="middle" fontSize={7.5} fill="#6366f1">Lagna</text>

      {/* House cells */}
      {HOUSE_CELLS.map(({ house, row, col }) => {
        const x = col * CW;
        const y = row * CH;
        const signIdx = signForHouse(house);
        const planetsHere = housePlanets[house] ?? [];
        const isLagna = house === 1;
        return (
          <g key={house}>
            <rect x={x+0.5} y={y+0.5} width={CW-1} height={CH-1}
              fill={isLagna ? "#ede9fe" : "transparent"} />
            {/* House number */}
            <text x={x+pad} y={y+pad+9} fontSize={8} fill="#6366f1" fontWeight="bold" opacity={0.7}>{house}</text>
            {/* Sign abbreviation */}
            <text x={x+CW-pad} y={y+pad+9} textAnchor="end" fontSize={8} fill="#9333ea" opacity={0.8}>
              {SIGN_ABBR[signIdx]}
            </text>
            {/* Planets */}
            {planetsHere.map((sym, i) => (
              <text key={i} x={x + CW/2} y={y + CH/2 + (i - (planetsHere.length-1)/2) * 13}
                textAnchor="middle" fontSize={11} fill={isLagna ? "#4338ca" : "#1e1b4b"}>
                {sym}
              </text>
            ))}
            {isLagna && (
              <text x={x+CW/2} y={y+CH-pad} textAnchor="middle" fontSize={7.5} fill="#7c3aed">Asc</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Navamsa (D9) Chart ────────────────────────────────────────────────────────
function NavamsaChart({ data }: { data: KundaliData }) {
  const CW = 82, CH = 82, W = CW*4, H = CH*4;
  const pad = 6;

  // Compute navamsa sign index for each planet
  const navHousePlanets: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) navHousePlanets[h] = [];

  // Navamsa lagna sign index
  const NAVAMSA_START: Record<number, number> = {
    0:0,4:0,8:0, 1:9,5:9,9:9, 2:6,6:6,10:6, 3:3,7:3,11:3
  };
  const navLagnaSignIdx = (() => {
    const si = data.lagnaSignIndex;
    const deg = data.lagna - si * 30;
    const navPart = Math.floor(deg * 9 / 30);
    return ((NAVAMSA_START[si] ?? 0) + navPart) % 12;
  })();

  for (const p of data.planets) {
    const navSignIdx = (() => {
      const si = p.signIndex;
      const navPart = Math.floor(p.degInSign * 9 / 30);
      return ((NAVAMSA_START[si] ?? 0) + navPart) % 12;
    })();
    const house = ((navSignIdx - navLagnaSignIdx + 12) % 12) + 1;
    navHousePlanets[house].push(p.symbol);
  }

  const SIGN_ABBR = ["Mes","Vri","Mit","Kar","Sim","Kan","Tul","Vri","Dha","Mak","Kum","Mee"];
  const signForHouse = (h: number) => (navLagnaSignIdx + h - 1) % 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[340px] mx-auto" style={{ fontFamily: "inherit" }}>
      <rect width={W} height={H} rx={8} fill="#fff7ed" stroke="#ea580c" strokeWidth={1.5} />
      {[1,2,3].map(i => (
        <line key={`v${i}`} x1={i*CW} y1={0} x2={i*CW} y2={H} stroke="#fb923c" strokeWidth={0.8} />
      ))}
      {[1,2,3].map(i => (
        <line key={`h${i}`} x1={0} y1={i*CH} x2={W} y2={i*CH} stroke="#fb923c" strokeWidth={0.8} />
      ))}
      <rect x={CW} y={CH} width={2*CW} height={2*CH} fill="#ffedd5" stroke="#ea580c" strokeWidth={1} />
      <text x={W/2} y={CH*2-2} textAnchor="middle" fontSize={9} fill="#c2410c" fontWeight="bold">D-9</text>
      <text x={W/2} y={CH*2+12} textAnchor="middle" fontSize={8} fill="#c2410c">Navamsa</text>

      {HOUSE_CELLS.map(({ house, row, col }) => {
        const x = col * CW, y = row * CH;
        const signIdx = signForHouse(house);
        const planetsHere = navHousePlanets[house] ?? [];
        const isLagna = house === 1;
        return (
          <g key={house}>
            <rect x={x+0.5} y={y+0.5} width={CW-1} height={CH-1}
              fill={isLagna ? "#fed7aa" : "transparent"} />
            <text x={x+pad} y={y+pad+9} fontSize={8} fill="#ea580c" fontWeight="bold" opacity={0.7}>{house}</text>
            <text x={x+CW-pad} y={y+pad+9} textAnchor="end" fontSize={8} fill="#9a3412" opacity={0.8}>
              {SIGN_ABBR[signIdx]}
            </text>
            {planetsHere.map((sym, i) => (
              <text key={i} x={x+CW/2} y={y+CH/2+(i-(planetsHere.length-1)/2)*13}
                textAnchor="middle" fontSize={11} fill={isLagna ? "#7c2d12" : "#431407"}>
                {sym}
              </text>
            ))}
            {isLagna && (
              <text x={x+CW/2} y={y+CH-pad} textAnchor="middle" fontSize={7.5} fill="#9a3412">Asc</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Planet Table ──────────────────────────────────────────────────────────────
function PlanetTable({ data }: { data: KundaliData }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-indigo-100">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-indigo-50 text-indigo-700">
            <th className="px-2 py-2 text-left font-semibold">Planet</th>
            <th className="px-2 py-2 text-left font-semibold">Sign</th>
            <th className="px-2 py-2 text-center font-semibold">H</th>
            <th className="px-2 py-2 text-left font-semibold">Nakshatra</th>
            <th className="px-2 py-2 text-left font-semibold">Navamsa</th>
            <th className="px-2 py-2 text-right font-semibold">Degree</th>
          </tr>
        </thead>
        <tbody>
          {data.planets.map(p => (
            <tr key={p.id} className="border-t border-indigo-50 hover:bg-indigo-50/40">
              <td className="px-2 py-1.5">
                <span className={`font-bold ${PLANET_COLORS[p.id]}`}>{p.symbol} {p.name}</span>
                {p.isRetrograde && <span className="text-red-400 ml-1 text-[10px]">ᴿ</span>}
              </td>
              <td className="px-2 py-1.5 text-slate-700">{p.sign}</td>
              <td className="px-2 py-1.5 text-center">
                <span className="inline-block w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-center leading-5">
                  {p.house}
                </span>
              </td>
              <td className="px-2 py-1.5 text-slate-600">{p.nakshatra} <span className="text-indigo-400">P{p.nakshatraPada}</span></td>
              <td className="px-2 py-1.5 text-purple-600">{p.navamsaSign}</td>
              <td className="px-2 py-1.5 text-right font-mono text-slate-500">{formatDegree(p.degInSign)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Dasha Section ─────────────────────────────────────────────────────────────
function DashaSection({ data }: { data: KundaliData }) {
  const now = new Date();
  const prog = dashaProgress(data.currentDasha);

  return (
    <div className="space-y-4">
      {/* Current Mahadasha */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Current Mahadasha</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{data.currentDasha.symbol}</span>
          <div>
            <p className="text-xl font-bold text-indigo-900">{data.currentDasha.lord} Dasha</p>
            <p className="text-xs text-slate-500">{formatDate(data.currentDasha.start)} – {formatDate(data.currentDasha.end)}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-bold text-indigo-700">{data.currentDasha.years} yrs</p>
            <p className="text-xs text-slate-500">{prog.toFixed(1)}% elapsed</p>
          </div>
        </div>
        <div className="w-full bg-indigo-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${prog}%` }} />
        </div>
      </div>

      {/* Antardasha */}
      <div>
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2 px-1">Antardashas (Sub-periods)</p>
        <div className="rounded-xl border border-indigo-100 overflow-hidden">
          {data.antar.map((a, i) => (
            <div key={i}
              className={`flex items-center gap-2 px-3 py-2 border-b border-indigo-50 last:border-b-0 text-xs
                ${a.isCurrent ? "bg-amber-50 border-l-4 border-l-amber-400" : "hover:bg-indigo-50/40"}`}>
              <span className="text-base">{a.symbol}</span>
              <span className={`font-semibold ${a.isCurrent ? "text-amber-700" : "text-slate-700"}`}>{a.lord}</span>
              {a.isCurrent && <span className="text-[10px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-bold">Now</span>}
              <span className="ml-auto text-slate-400">{formatDate(a.start)} – {formatDate(a.end)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Mahadashas */}
      <div>
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2 px-1">Dasha Timeline</p>
        <div className="space-y-1">
          {data.upcomingDashas.map((d, i) => {
            const isCurr = now >= d.start && now < d.end;
            const isPast = now >= d.end;
            return (
              <div key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                  ${isCurr ? "bg-indigo-100 border border-indigo-300" : isPast ? "opacity-40" : "bg-slate-50"}`}>
                <span>{d.symbol}</span>
                <span className="font-semibold text-slate-700 w-20">{d.lord}</span>
                <span className="text-slate-400 text-[10px]">{d.years}y</span>
                <span className="ml-auto text-slate-400 text-[10px]">{formatDate(d.start)} – {formatDate(d.end)}</span>
                {isCurr && <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">Active</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Interpretation Card ───────────────────────────────────────────────────────
function InterpretationCard({ data }: { data: KundaliData }) {
  const interp = LAGNA_INTERPRETATIONS[data.lagnaSign];
  const moon = data.planets.find(p => p.id === "moon")!;
  const sun  = data.planets.find(p => p.id === "sun")!;

  return (
    <div className="space-y-4">
      {interp && (
        <div className="panchang-gradient rounded-2xl p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-1">Lagna Reading</p>
          <p className="text-lg font-bold mb-2">{interp.title}</p>
          <p className="text-sm text-indigo-100 leading-relaxed">{interp.body}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InfoTile icon="🌙" label="Moon Sign (Rashi)" value={moon.sign} sub={moon.signEn} />
        <InfoTile icon="☀️" label="Sun Sign (Rashi)" value={sun.sign} sub={sun.signEn} />
        <InfoTile icon="⭐" label="Janma Nakshatra" value={data.moonNakshatra} sub={`Pada ${data.moonNakshatraPada}`} />
        <InfoTile icon="🔺" label="Navamsa Lagna" value={data.navamsaLagna} sub="D-9 Chart" />
      </div>

      {/* Key planet strengths */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">Key Placements</p>
        <div className="space-y-2">
          {data.planets.slice(0, 7).map(p => (
            <div key={p.id} className="flex items-center gap-2 text-xs">
              <span className={`font-bold w-16 ${PLANET_COLORS[p.id]}`}>{p.symbol} {p.name}</span>
              <span className="text-slate-600">in <strong>{p.sign}</strong>, House {p.house}</span>
              {p.isRetrograde && <span className="text-red-400 text-[10px]">Retrograde</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center shadow-sm">
      <p className="text-xl mb-1">{icon}</p>
      <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

// ─── Main KundaliSection ───────────────────────────────────────────────────────
type KundaliTab = "chart" | "dasha" | "navamsa" | "reading";

const defaultCity = CITIES[0];

function cityToLocation(c: City): LocationValue {
  return { name: c.name, lat: c.lat, lon: c.lon, utcOffset: 5.5, timezone: c.timezone };
}

export default function KundaliSection() {
  const today = new Date();
  const [birthDate, setBirthDate] = useState(`${today.getFullYear() - 30}-06-15`);
  const [birthTime, setBirthTime] = useState("06:30");
  const [birthLoc, setBirthLoc] = useState<LocationValue>(cityToLocation(defaultCity));
  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [innerTab, setInnerTab] = useState<KundaliTab>("chart");
  const [error, setError] = useState("");

  function calculate() {
    setError("");
    try {
      if (!birthDate || !birthTime) { setError("Please enter birth date and time."); return; }
      const [year, month, day] = birthDate.split("-").map(Number);
      const [hour, minute] = birthTime.split(":").map(Number);
      if (!year || !month || !day) { setError("Invalid date."); return; }

      // Convert local birth time → UTC using the location's UTC offset
      let offsetHours = birthLoc.utcOffset;

      // If we have a timezone string, compute the exact DST-aware offset for that date
      if (birthLoc.timezone) {
        try {
          const probe = new Date(Date.UTC(year, month - 1, day, hour, minute));
          const localStr = probe.toLocaleString("en-US", {
            timeZone: birthLoc.timezone, hour12: false,
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit",
          });
          const [datePart, timePart] = localStr.split(", ");
          const [mm, dd, yyyy] = datePart.split("/").map(Number);
          const [hh, mi] = timePart.replace(/^24/, "00").split(":").map(Number);
          const localAsUtc = Date.UTC(yyyy, mm - 1, dd, hh, mi);
          offsetHours = (probe.getTime() - localAsUtc) / 3600000;
        } catch { /* fall back to fixed offset */ }
      }

      // Birth time in UTC
      const utcMs = Date.UTC(year, month - 1, day, hour, minute) - offsetHours * 3600000;
      const utcDate = new Date(utcMs);

      const result = computeKundali(utcDate, birthLoc.lat, birthLoc.lon);
      setKundali(result);
      setInnerTab("chart");
    } catch (e: unknown) {
      setError("Calculation error. Please check your inputs.");
      console.error(e);
    }
  }

  const innerTabs: Array<{ id: KundaliTab; label: string; icon: string }> = [
    { id: "chart",   label: "Kundali",   icon: "◈" },
    { id: "dasha",   label: "Dasha",     icon: "⏳" },
    { id: "navamsa", label: "Navamsa D9",icon: "🔷" },
    { id: "reading", label: "Reading",   icon: "📖" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Birth Details Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="panchang-gradient px-5 py-4">
          <p className="text-white font-bold text-lg">🔯 Janma Kundali</p>
          <p className="text-indigo-200 text-sm">Hindu Astrology Birth Chart</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1">Birth Date</label>
              <input
                type="date" value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1">Birth Time</label>
              <input
                type="time" value={birthTime}
                onChange={e => setBirthTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1">Birth Place</label>
            <CitySearch value={birthLoc} onChange={setBirthLoc} />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button
            onClick={calculate}
            className="w-full py-3 rounded-xl font-bold text-white text-sm gold-gradient shadow-md hover:opacity-90 active:scale-[0.98] transition"
          >
            ✨ Calculate Kundali
          </button>
          <p className="text-xs text-slate-400 text-center">
            Uses Lahiri Ayanamsha · Equal House System · Vimshottari Dasha
          </p>
        </div>
      </div>

      {/* Results */}
      {kundali && (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">Lagna</p>
              <p className="text-base font-bold text-indigo-900 mt-0.5">{kundali.lagnaSign}</p>
              <p className="text-xs text-slate-400">{kundali.lagnaSignEn}</p>
            </div>
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">Moon Rashi</p>
              <p className="text-base font-bold text-indigo-900 mt-0.5">{kundali.moonSign}</p>
              <p className="text-xs text-slate-400">{kundali.moonNakshatra}</p>
            </div>
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center shadow-sm">
              <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">Dasha</p>
              <p className="text-base font-bold text-indigo-900 mt-0.5">{kundali.currentDasha.symbol}</p>
              <p className="text-xs text-slate-400">{kundali.currentDasha.lord}</p>
            </div>
          </div>

          {/* Inner tab nav */}
          <div className="flex bg-white border border-indigo-100 rounded-2xl p-1 shadow-sm gap-1">
            {innerTabs.map(t => (
              <button key={t.id} onClick={() => setInnerTab(t.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition
                  ${innerTab === t.id
                    ? "bg-indigo-600 text-white shadow"
                    : "text-indigo-500 hover:bg-indigo-50"}`}>
                <span className="mr-1">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* Inner tab content */}
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4">
            {innerTab === "chart" && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Birth Chart · Rashi (D1)</p>
                <NorthIndianChart data={kundali} />
                <PlanetTable data={kundali} />
                <p className="text-xs text-slate-400 text-center">
                  Houses based on Lagna: {kundali.lagnaSign} ({formatDegree(kundali.lagna % 30)})
                </p>
              </div>
            )}
            {innerTab === "dasha" && <DashaSection data={kundali} />}
            {innerTab === "navamsa" && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Navamsa Chart (D9) — Marriage & Dharma</p>
                <NavamsaChart data={kundali} />
                <p className="text-xs text-slate-400 text-center">
                  Navamsa Lagna: <strong>{kundali.navamsaLagna}</strong> · D9 chart shows dharma, spouse, and soul purpose.
                </p>
              </div>
            )}
            {innerTab === "reading" && <InterpretationCard data={kundali} />}
          </div>
        </>
      )}

      {!kundali && (
        <div className="text-center py-10 text-slate-400">
          <p className="text-5xl mb-3">🔯</p>
          <p className="text-sm font-medium">Enter your birth details above and tap <strong>Calculate Kundali</strong></p>
          <p className="text-xs mt-1">Birth chart, Vimshottari Dasha & Navamsa D9 will appear here</p>
        </div>
      )}
    </div>
  );
}
