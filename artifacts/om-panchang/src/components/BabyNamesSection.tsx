import { useState } from "react";
import { CITIES } from "@/lib/panchangData";
import { computeSiderealPositions } from "@/lib/astronomyCore";
import { getBabyNames, BabyNameResult, NAKSHATRA_SYLLABLES, SYLLABLE_NAMES } from "@/lib/babyNames";

function CityInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="e.g. Houston, TX or leave blank for UTC"
      className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
    />
  );
}

export default function BabyNamesSection() {
  const [birthDate, setBirthDate]   = useState("");
  const [birthTime, setBirthTime]   = useState("06:00");
  const [cityQuery, setCityQuery]   = useState("");
  const [utcOffset, setUtcOffset]   = useState(5.5);  // India default
  const [result, setResult]         = useState<BabyNameResult | null>(null);
  const [activeGender, setActiveGender] = useState<"boys" | "girls">("boys");
  const [activeSyl, setActiveSyl]   = useState<string | null>(null);
  const [error, setError]           = useState("");

  // Try to match a city from the built-in list for UTC offset
  const handleCityBlur = () => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return;
    const match = CITIES.find(c => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase()));
    if (match) {
      // Estimate UTC offset from timezone string (simple heuristic)
      const now = new Date();
      try {
        const parts = new Intl.DateTimeFormat("en-US", { timeZone: match.timezone, timeZoneName: "shortOffset" })
          .formatToParts(now);
        const tzPart = parts.find(p => p.type === "timeZoneName")?.value || "";
        const m = tzPart.match(/GMT([+-]\d+(?::\d+)?)?/);
        if (m && m[1]) {
          const [h, min = "0"] = m[1].replace("+", "").split(":");
          setUtcOffset(parseInt(h) + parseInt(min) / 60);
        }
      } catch { /* use default */ }
    }
  };

  const handleCompute = () => {
    setError("");
    setResult(null);
    if (!birthDate) { setError("Please enter the birth date."); return; }

    const [y, m, d] = birthDate.split("-").map(Number);
    const [hh, mm]  = birthTime.split(":").map(Number);

    // Build a UTC Date representing birth local time
    const birthUtcMs = Date.UTC(y, m - 1, d, hh - utcOffset, mm - (utcOffset % 1) * 60);
    const birthUtcDate = new Date(birthUtcMs);

    const { moonSid } = computeSiderealPositions(birthUtcDate, utcOffset);
    const nameResult  = getBabyNames(moonSid);
    setResult(nameResult);
    setActiveSyl(nameResult.syllable);
  };

  const ordinal = (n: number) => ["1st", "2nd", "3rd", "4th"][n - 1] ?? `${n}th`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl px-6 py-5 mb-6 text-white">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">👶</span>
          <div>
            <h2 className="text-xl font-bold">Baby Name Finder</h2>
            <p className="text-pink-100 text-sm">Hindu names by Janma Nakshatra</p>
          </div>
        </div>
        <p className="text-pink-100 text-xs mt-2">
          Enter your baby's birth details → we compute the Janma Nakshatra (Moon star) → suggest
          the traditional starting syllable and curated Hindu names
        </p>
      </div>

      {/* Input form */}
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1.5">
              Birth Date *
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1.5">
              Birth Time
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wide block mb-1.5">
              Birth City (for timezone)
            </label>
            <CityInput value={cityQuery} onChange={setCityQuery} />
            <p className="text-xs text-slate-400 mt-1">
              Type city name to set timezone automatically
              <span className="text-indigo-400 ml-1">
                · UTC offset: {utcOffset >= 0 ? "+" : ""}{utcOffset.toFixed(1)}h
              </span>
            </p>
          </div>
        </div>

        {/* Quick UTC offset adjust */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "IST +5:30", val: 5.5 }, { label: "EST −5", val: -5 },
            { label: "CST −6", val: -6 },    { label: "MST −7", val: -7 },
            { label: "PST −8", val: -8 },    { label: "UTC 0",  val: 0  },
          ].map(tz => (
            <button key={tz.label} onClick={() => setUtcOffset(tz.val)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                utcOffset === tz.val
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-indigo-200 text-slate-600 hover:bg-indigo-50"
              }`}>{tz.label}</button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={handleCompute}
          className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition text-sm shadow-md"
        >
          🌟 Find Baby Names
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Nakshatra card */}
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white">
              <p className="text-indigo-200 text-xs font-medium uppercase tracking-wide">Janma Nakshatra</p>
              <h3 className="text-2xl font-bold mt-0.5">{result.nakshatra}</h3>
              <p className="text-indigo-200 text-sm">{ordinal(result.pada)} Pada · Starting syllable: <strong className="text-amber-300 text-lg">{result.syllable}</strong></p>
            </div>

            {/* All 4 padas */}
            <div className="px-5 py-3">
              <p className="text-xs text-slate-400 font-medium mb-2">All 4 padas of {result.nakshatra}:</p>
              <div className="flex gap-2 flex-wrap">
                {result.allSyllables.map((syl, i) => (
                  <button key={syl + i}
                    onClick={() => setActiveSyl(syl)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                      activeSyl === syl
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    {syl} <span className="text-xs font-normal opacity-70">{ordinal(i+1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Names */}
          {activeSyl && (
            <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-indigo-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Names starting with <span className="text-indigo-600">"{activeSyl}"</span></p>
                  <p className="text-xs text-slate-400">Traditional Hindu names · {result.nakshatra} Nakshatra</p>
                </div>
                <div className="flex rounded-lg border border-indigo-200 overflow-hidden text-xs font-semibold">
                  <button onClick={() => setActiveGender("boys")}
                    className={`px-3 py-1.5 transition ${activeGender === "boys" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-indigo-50"}`}>
                    👦 Boys
                  </button>
                  <button onClick={() => setActiveGender("girls")}
                    className={`px-3 py-1.5 transition ${activeGender === "girls" ? "bg-pink-500 text-white" : "text-slate-600 hover:bg-pink-50"}`}>
                    👧 Girls
                  </button>
                </div>
              </div>

              <div className="p-5">
                {(() => {
                  const names: string[] = SYLLABLE_NAMES[activeSyl]?.[activeGender] ?? [];
                  if (names.length === 0) return (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No names found for syllable "{activeSyl}". Try another pada.
                    </p>
                  );
                  return (
                    <div className="flex flex-wrap gap-2">
                      {names.map(name => (
                        <span key={name}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                            activeGender === "boys"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-pink-50 text-pink-700 border-pink-200"
                          }`}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
            <strong>🕉️ Vedic tradition:</strong> The first syllable of a baby's name should match the
            Nakshatra pada of the Moon at birth. Naming by Nakshatra brings the child closer to their
            cosmic energy and is auspicious in Hindu tradition.
          </div>
        </div>
      )}

      {/* No compute yet — show nakshatra reference */}
      {!result && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">📋 Nakshatra Syllable Guide</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-64 overflow-y-auto">
            {Object.entries(NAKSHATRA_SYLLABLES).map(([nak, syls]) => (
              <div key={nak} className="flex items-center gap-2 py-1 border-b border-slate-50">
                <span className="text-xs text-slate-500 w-32 truncate">{nak}</span>
                <span className="text-xs font-medium text-indigo-600">{syls.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
