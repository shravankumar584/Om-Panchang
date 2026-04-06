import { useState, useRef, useEffect } from "react";
import { computeKundali } from "@/lib/jyotishData";
import { computeMilan, MilanResult } from "@/lib/kundaliMilan";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LocationValue {
  name: string; lat: number; lon: number; utcOffset: number;
}
interface NominatimResult {
  place_id: number; display_name: string; lat: string; lon: string;
  address?: { city?:string; town?:string; village?:string; state?:string; country?:string };
}
interface PersonInput {
  name: string; dob: string; tob: string; location: LocationValue;
}

// ─── City Search combobox ─────────────────────────────────────────────────────
// Common abbreviations → full city name (expand before sending to Nominatim)
const CITY_ALIASES: Record<string, string> = {
  // India
  hyd:"Hyderabad", hb:"Hyderabad",
  mum:"Mumbai", bom:"Mumbai",
  del:"Delhi", ndl:"New Delhi", nd:"New Delhi",
  blr:"Bangalore", ban:"Bengaluru",
  che:"Chennai", mad:"Chennai",
  kol:"Kolkata", cal:"Kolkata",
  pun:"Pune", pune:"Pune",
  ahm:"Ahmedabad", ahd:"Ahmedabad",
  nag:"Nagpur",
  sur:"Surat",
  jp:"Jaipur",
  lko:"Lucknow",
  viz:"Visakhapatnam", vsk:"Visakhapatnam",
  cbe:"Coimbatore",
  // US
  nyc:"New York City",
  la:"Los Angeles",
  sf:"San Francisco",
  chi:"Chicago",
  hou:"Houston",
  dal:"Dallas",
  det:"Detroit",
  phi:"Philadelphia",
  phx:"Phoenix",
  sea:"Seattle",
  atl:"Atlanta",
};

function expandQuery(q: string): string {
  return CITY_ALIASES[q.toLowerCase().trim()] ?? q;
}

function friendlyName(r: NominatimResult): string {
  const a = r.address ?? {};
  return [a.city??a.town??a.village??"", a.state??"", a.country??""].filter(Boolean).join(", ");
}

function CitySearch({ value, onChange, label }: {
  value: LocationValue; onChange: (v: LocationValue) => void; label: string;
}) {
  const [query, setQuery] = useState(value.name);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function handleInput(q: string) {
    setQuery(q); setOpen(true); setStatus("");
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) { setResults([]); return; }
    timer.current = setTimeout(() => fetchCities(q.trim()), 400);
  }

  async function fetchCities(q: string) {
    setLoading(true);
    const expanded = expandQuery(q);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(expanded)}&format=json&addressdetails=1&limit=8&featuretype=settlement`, { headers:{"Accept-Language":"en"} });
      const data: NominatimResult[] = await r.json();
      setResults(data);
      if (data.length === 0) setStatus("No results");
    } catch { setStatus("Search unavailable"); }
    setLoading(false);
  }

  async function select(r: NominatimResult) {
    const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
    const name = friendlyName(r);
    setQuery(name); setOpen(false); setResults([]); setStatus("Getting timezone…");
    try {
      const tz = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto&current_weather=false&hourly=temperature_2m&forecast_days=1`);
      const tzData = await tz.json();
      const offset = (tzData.utc_offset_seconds ?? 0) / 3600;
      onChange({ name, lat, lon, utcOffset: offset });
      setStatus("");
    } catch {
      onChange({ name, lat, lon, utcOffset: 5.5 });
      setStatus("");
    }
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text" value={query}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => { if (results.length > 0) setOpen(true); }}
        placeholder="Search city…"
        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      {loading && <p className="text-xs text-indigo-200 mt-1">Searching…</p>}
      {status && <p className="text-xs text-indigo-200 mt-1">{status}</p>}
      {open && results.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-indigo-100 max-h-48 overflow-y-auto">
          {results.map(r => (
            <li key={r.place_id}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); select(r); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 truncate"
              >
                {friendlyName(r)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── PersonForm ───────────────────────────────────────────────────────────────
const DEFAULT_LOC: LocationValue = { name: "New Delhi, India", lat: 28.6139, lon: 77.209, utcOffset: 5.5 };

function PersonForm({
  label, color, emoji, value, onChange,
}: {
  label: string; color: string; emoji: string;
  value: PersonInput; onChange: (v: PersonInput) => void;
}) {
  return (
    <div className={`rounded-2xl p-5 space-y-4 ${color}`}>
      <h3 className="font-bold text-white text-base flex items-center gap-2">{emoji} {label}</h3>
      <div>
        <label className="block text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">Full Name</label>
        <input
          type="text" value={value.name} placeholder="e.g. Priya Sharma"
          onChange={e => onChange({ ...value, name: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">Date of Birth</label>
          <input
            type="date" value={value.dob}
            onChange={e => onChange({ ...value, dob: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">Time of Birth</label>
          <input
            type="time" value={value.tob}
            onChange={e => onChange({ ...value, tob: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 [color-scheme:dark]"
          />
        </div>
      </div>
      <CitySearch
        label="Place of Birth"
        value={value.location}
        onChange={loc => onChange({ ...value, location: loc })}
      />
    </div>
  );
}

// ─── Koota Row ─────────────────────────────────────────────────────────────────
function KootaRow({
  rank, name, score, max, detail, dosha, expanded, onToggle,
}: {
  rank: number; name: string; score: number; max: number;
  detail: React.ReactNode; dosha: boolean; expanded: boolean; onToggle: () => void;
}) {
  const pct = (score / max) * 100;
  const barColor =
    pct >= 75 ? "bg-emerald-500" :
    pct >= 50 ? "bg-amber-500" :
    pct > 0   ? "bg-orange-500" : "bg-rose-500";

  return (
    <div className={`rounded-xl border transition-all ${dosha ? "border-rose-200 bg-rose-50" : "border-indigo-100 bg-white"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-indigo-50/50 transition rounded-xl"
      >
        <span className="text-xs font-bold text-indigo-400 w-4">{rank}</span>
        <span className="flex-1 font-semibold text-slate-800 text-sm">{name}</span>
        {dosha && <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full">Dosha</span>}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
          <span className={`text-sm font-bold w-10 text-right ${score === max ? "text-emerald-600" : score === 0 ? "text-rose-600" : "text-slate-700"}`}>
            {score}/{max}
          </span>
          <span className="text-indigo-300 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-1 text-sm text-slate-600 border-t border-slate-100 mt-1">
          {detail}
        </div>
      )}
    </div>
  );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, max }: { score: number; max: number }) {
  const pct = score / max;
  const r = 56, circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color =
    pct >= 0.75 ? "#10b981" :
    pct >= 0.58 ? "#f59e0b" :
    pct >= 0.5  ? "#f97316" : "#ef4444";
  const label =
    pct >= 0.75 ? "Excellent" :
    pct >= 0.58 ? "Good" :
    pct >= 0.5  ? "Acceptable" :
    pct >= 0.33 ? "Below avg" : "Poor";

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e0e7ff" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="text-center -mt-[88px] mb-14">
        <p className="text-4xl font-black text-slate-800">{score}</p>
        <p className="text-sm text-slate-400">out of {max}</p>
      </div>
      <span className="text-sm font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function KundaliMilanSection() {
  const [girl, setGirl] = useState<PersonInput>({
    name: "", dob: "", tob: "12:00", location: { ...DEFAULT_LOC },
  });
  const [boy, setBoy] = useState<PersonInput>({
    name: "", dob: "", tob: "12:00", location: { ...DEFAULT_LOC },
  });
  const [result, setResult] = useState<MilanResult | null>(null);
  const [moonInfo, setMoonInfo] = useState({ boyMoon:"", girlMoon:"", boyNak:"", girlNak:"" });
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState<Record<string,boolean>>({});

  function toggle(key: string) {
    setExpanded(e => ({ ...e, [key]: !e[key] }));
  }

  function calculate() {
    setError("");
    if (!boy.dob || !girl.dob) { setError("Please fill in both dates of birth."); return; }

    // Parse birth times → UTC Date
    function parseBirth(p: PersonInput): Date {
      const [y,m,d] = p.dob.split("-").map(Number);
      const [h,min] = (p.tob||"12:00").split(":").map(Number);
      const localMs  = Date.UTC(y, m-1, d, h, min);
      const utcMs    = localMs - p.location.utcOffset * 3600000;
      return new Date(utcMs);
    }

    try {
      const boyDate  = parseBirth(boy);
      const girlDate = parseBirth(girl);
      const boyKundali  = computeKundali(boyDate,  boy.location.lat,  boy.location.lon);
      const girlKundali = computeKundali(girlDate, girl.location.lat, girl.location.lon);

      const moonB = boyKundali.planets.find(p => p.id === "moon")!;
      const moonG = girlKundali.planets.find(p => p.id === "moon")!;

      const nakB = Math.floor(moonB.siderealLon / (360/27));
      const nakG = Math.floor(moonG.siderealLon / (360/27));
      const rashiB = moonB.signIndex;
      const rashiG = moonG.signIndex;

      const milan = computeMilan(rashiB, nakB, rashiG, nakG);
      setResult(milan);
      setMoonInfo({
        boyMoon:  moonB.sign,
        girlMoon: moonG.sign,
        boyNak:   moonB.nakshatra,
        girlNak:  moonG.nakshatra,
      });
      // auto-expand dosha kootas
      const exp: Record<string,boolean> = {};
      if (milan.nadiDosha)    exp.nadi = true;
      if (milan.bhakootDosha) exp.bhakoot = true;
      if (milan.ganaDosha)    exp.gana = true;
      setExpanded(exp);
    } catch (err) {
      setError("Calculation error. Please check the input details.");
      console.error(err);
    }
  }

  const r = result;
  const doshaCount = r ? [r.nadiDosha, r.bhakootDosha, r.ganaDosha].filter(Boolean).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="panchang-gradient rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💑</span>
          <div>
            <h2 className="text-2xl font-black">Kundali Milan</h2>
            <p className="text-indigo-200 text-sm mt-0.5">Ashtakoota Matching — 8-fold compatibility analysis based on Moon Nakshatra & Rashi</p>
          </div>
        </div>
      </div>

      {/* Input Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonForm
          label="Bride (Girl)"
          emoji="👩"
          color="bg-gradient-to-br from-pink-700 to-rose-800"
          value={girl}
          onChange={setGirl}
        />
        <PersonForm
          label="Groom (Boy)"
          emoji="👨"
          color="bg-gradient-to-br from-indigo-700 to-indigo-900"
          value={boy}
          onChange={setBoy}
        />
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full gold-gradient text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:opacity-90 active:scale-[0.99] transition-all"
      >
        ✨ Calculate Compatibility
      </button>

      {/* Results */}
      {r && (
        <div className="space-y-4 animate-fadeIn">
          {/* Score Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ScoreRing score={Math.round(r.total)} max={36} />
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {boy.name || "Groom"} & {girl.name || "Bride"}
                  </h3>
                  <p className="text-slate-500 text-sm mt-0.5">Ashtakoota compatibility report</p>
                </div>
                {/* Moon details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-3">
                    <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Groom's Moon</p>
                    <p className="font-bold text-indigo-800">{moonInfo.boyMoon}</p>
                    <p className="text-xs text-indigo-600">{moonInfo.boyNak}</p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-3">
                    <p className="text-xs text-rose-400 font-semibold uppercase tracking-wider mb-1">Bride's Moon</p>
                    <p className="font-bold text-rose-800">{moonInfo.girlMoon}</p>
                    <p className="text-xs text-rose-600">{moonInfo.girlNak}</p>
                  </div>
                </div>
                {/* Dosha warnings */}
                {doshaCount > 0 ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                    <p className="text-rose-700 font-semibold text-sm">
                      ⚠️ {doshaCount} Major Dosha{doshaCount > 1 ? "s" : ""} detected
                      {r.nadiDosha    && " — Nadi Dosha"}
                      {r.bhakootDosha && " — Bhakoot Dosha"}
                      {r.ganaDosha    && " — Gana Dosha"}
                    </p>
                    <p className="text-rose-600 text-xs mt-1">
                      Please consult a qualified Jyotishi for remedies.
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <p className="text-emerald-700 font-semibold text-sm">✅ No major dosha detected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 8 Kootas */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-700 px-1">Eight Koota Analysis</h3>

            <KootaRow rank={1} name="Varna Koota — Spiritual Compatibility"
              score={r.varna.score} max={r.varna.max} dosha={r.varna.dosha}
              expanded={!!expanded.varna} onToggle={() => toggle("varna")}
              detail={
                <div className="space-y-2">
                  <p>Measures spiritual compatibility based on the <strong>social temperament</strong> of each Moon sign.</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-indigo-700">Groom: <strong>{r.varna.boyVarna}</strong></span>
                    <span className="text-rose-700">Bride: <strong>{r.varna.girlVarna}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500">Varna: Brahmin {">"} Kshatriya {">"} Vaishya {">"} Shudra. Full point if groom's varna is equal or higher than bride's.</p>
                </div>
              }
            />

            <KootaRow rank={2} name="Vashya Koota — Mutual Attraction"
              score={r.vashya.score} max={r.vashya.max} dosha={false}
              expanded={!!expanded.vashya} onToggle={() => toggle("vashya")}
              detail={
                <div className="space-y-1">
                  <p>Measures the natural <strong>dominance and control</strong> in the relationship based on Moon signs.</p>
                  <p className="text-xs text-slate-500">2 pts if groom's sign controls bride's (protection/care), 1 pt if reversed, 0 if no Vashya relationship.</p>
                </div>
              }
            />

            <KootaRow rank={3} name="Tara Koota — Birth Star Compatibility"
              score={r.tara.score} max={r.tara.max} dosha={r.tara.dosha}
              expanded={!!expanded.tara} onToggle={() => toggle("tara")}
              detail={
                <div className="space-y-2">
                  <p>Counts the <strong>nakshatra distance</strong> between the two birth stars and classifies it.</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-indigo-700">Bride→Groom Tara: <strong>{r.tara.boyTara}</strong></span>
                    <span className="text-rose-700">Groom→Bride Tara: <strong>{r.tara.girlTara}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500">Good taras: Sampat, Kshema, Sadhaka, Mitra, Ati-Mitra. Bad: Janma, Vipat, Pratyak, Vadha.</p>
                </div>
              }
            />

            <KootaRow rank={4} name="Yoni Koota — Physical & Intimate Compatibility"
              score={r.yoni.score} max={r.yoni.max} dosha={r.yoni.dosha}
              expanded={!!expanded.yoni} onToggle={() => toggle("yoni")}
              detail={
                <div className="space-y-2">
                  <p>Each nakshatra is assigned an <strong>animal nature (yoni)</strong> indicating physical compatibility.</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-indigo-700">Groom: <strong>{r.yoni.boyYoni}</strong></span>
                    <span className="text-rose-700">Bride: <strong>{r.yoni.girlYoni}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500">4=natural pair (same animal, opposite gender), 3=same animal, 2=neutral, 0=enemy animals.</p>
                </div>
              }
            />

            <KootaRow rank={5} name="Graha Maitri Koota — Planetary Friendship"
              score={r.grahaMaitri.score} max={r.grahaMaitri.max} dosha={false}
              expanded={!!expanded.grahaMaitri} onToggle={() => toggle("grahaMaitri")}
              detail={
                <div className="space-y-2">
                  <p>Compares the <strong>natural friendship</strong> between the lords of each person's Moon sign.</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-indigo-700">Groom's lord: <strong>{r.grahaMaitri.boyLord}</strong></span>
                    <span className="text-rose-700">Bride's lord: <strong>{r.grahaMaitri.girlLord}</strong></span>
                  </div>
                  <p className="text-indigo-700 font-medium text-sm">Relationship: {r.grahaMaitri.relation}</p>
                  <p className="text-xs text-slate-500">Mutual friends=5, Friend+Neutral=4, Both neutral=3, Mixed=1, Enemy=0.</p>
                </div>
              }
            />

            <KootaRow rank={6} name="Gana Koota — Temperament & Nature"
              score={r.gana.score} max={r.gana.max} dosha={r.gana.dosha}
              expanded={!!expanded.gana} onToggle={() => toggle("gana")}
              detail={
                <div className="space-y-2">
                  <p>Each nakshatra belongs to a <strong>Gana (temperament group)</strong>: Deva, Manava, or Rakshasa.</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-indigo-700">Groom: <strong>{r.gana.boyGana}</strong></span>
                    <span className="text-rose-700">Bride: <strong>{r.gana.girlGana}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500">Same gana=6 (ideal), Deva+Manava=5 (acceptable), Manava+Rakshasa=1, Deva+Rakshasa=0 (incompatible).</p>
                </div>
              }
            />

            <KootaRow rank={7} name="Bhakoot Koota — Emotional & Financial Bond"
              score={r.bhakoot.score} max={r.bhakoot.max} dosha={r.bhakoot.dosha}
              expanded={!!expanded.bhakoot} onToggle={() => toggle("bhakoot")}
              detail={
                <div className="space-y-2">
                  <p>Based on the <strong>angular relationship</strong> between the Moon signs of the couple.</p>
                  <p className="text-indigo-700 font-medium text-sm">{r.bhakoot.relation}</p>
                  <p className="text-xs text-slate-500">
                    6/8 (Shadashtaka) and 2/12 placements cause Bhakoot Dosha — indicating potential financial or emotional strain.
                    All other combinations are auspicious (7 pts).
                  </p>
                </div>
              }
            />

            <KootaRow rank={8} name="Nadi Koota — Health & Progeny"
              score={r.nadi.score} max={r.nadi.max} dosha={r.nadi.dosha}
              expanded={!!expanded.nadi} onToggle={() => toggle("nadi")}
              detail={
                <div className="space-y-2">
                  <p>The most critical koota. <strong>Same Nadi = Nadi Dosha</strong>, which can indicate health issues and difficulty with children.</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-indigo-700">Groom: <strong>{r.nadi.boyNadi}</strong></span>
                    <span className="text-rose-700">Bride: <strong>{r.nadi.girlNadi}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Aadi=Vata (air constitution), Madhya=Pitta (fire), Antya=Kapha (water).
                    Different Nadis = 8 pts. Same Nadi = 0 pts (serious dosha requiring remedies).
                  </p>
                </div>
              }
            />
          </div>

          {/* Points summary bar */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-5">
            <h3 className="font-bold text-slate-700 text-sm mb-3">Score Breakdown</h3>
            <div className="space-y-2">
              {[
                { name:"Nadi",        s:r.nadi.score,        m:8  },
                { name:"Bhakoot",     s:r.bhakoot.score,     m:7  },
                { name:"Gana",        s:r.gana.score,        m:6  },
                { name:"Graha Maitri",s:r.grahaMaitri.score, m:5  },
                { name:"Yoni",        s:r.yoni.score,        m:4  },
                { name:"Tara",        s:r.tara.score,        m:3  },
                { name:"Vashya",      s:r.vashya.score,      m:2  },
                { name:"Varna",       s:r.varna.score,       m:1  },
              ].map(({ name, s, m }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-24 shrink-0">{name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s===0?"bg-rose-400":s===m?"bg-emerald-500":"bg-indigo-400"}`}
                      style={{ width: `${(s/m)*100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-8 text-right">{s}/{m}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 w-24 shrink-0">TOTAL</span>
                <div className="flex-1" />
                <span className="text-sm font-black text-indigo-700">{Math.round(r.total * 10) / 10}/36</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
            <strong>📜 Note:</strong> This analysis uses the traditional Ashtakoota method based on Brihat Parashara Hora Shastra.
            A score of 18+/36 is generally considered compatible for marriage.
            Astrology is a guide — please consult a qualified Jyotishi for important life decisions and for dosha remedies.
          </div>
        </div>
      )}
    </div>
  );
}
