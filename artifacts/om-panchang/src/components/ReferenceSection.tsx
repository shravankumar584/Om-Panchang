import { useState } from "react";
import { NAKSHATRA_DATA, TITHI_DATA, YOGA_DATA, LUNAR_MONTHS, NakshatraInfo, TithiInfo, YogaInfo } from "@/lib/referenceData";

function NakshatraModal({ info, onClose }: { info: NakshatraInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="panchang-gradient px-6 py-4 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Nakshatra {info.index}
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {info.gana}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{info.name}</h2>
              <p className="text-indigo-200 text-sm mt-0.5">{info.rashi} · Ruled by {info.ruler}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none ml-4 mt-1">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Symbol</p>
              <p className="text-sm font-medium text-stone-800">{info.symbol}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Presiding Deity</p>
              <p className="text-sm font-medium text-stone-800">{info.deity}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Quality</p>
              <p className="text-sm font-medium text-stone-800">{info.quality}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Planetary Ruler</p>
              <p className="text-sm font-medium text-stone-800">{info.ruler}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
              <span className="text-indigo-500">📖</span> About {info.name} Nakshatra
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">{info.description}</p>
          </div>

          {/* Characteristics */}
          <div>
            <h3 className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
              <span className="text-indigo-500">✨</span> Key Characteristics
            </h3>
            <ul className="space-y-1.5">
              {info.characteristics.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Favorable & Unfavorable */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h3 className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                ✅ Favorable For
              </h3>
              <ul className="space-y-1">
                {info.favorable.map((f, i) => (
                  <li key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                ⚠️ Unfavorable For
              </h3>
              <ul className="space-y-1">
                {info.unfavorable.map((f, i) => (
                  <li key={i} className="text-xs text-red-800 flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TithiModal({ info, onClose }: { info: TithiInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="panchang-gradient px-6 py-4 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Tithi {info.index}
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {info.nature}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{info.symbol} {info.name}</h2>
              <p className="text-indigo-200 text-sm mt-0.5">Deity: {info.deity}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none ml-4 mt-1">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Paksha</p>
            <p className="text-sm font-medium text-stone-800">{info.paksha} Paksha</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-stone-700 mb-2 flex items-center gap-2">
              <span className="text-indigo-500">📖</span> About {info.name}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">{info.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h3 className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">✅ Favorable For</h3>
              <ul className="space-y-1">
                {info.favorable.map((f, i) => (
                  <li key={i} className="text-xs text-green-800 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">⚠️ Unfavorable For</h3>
              <ul className="space-y-1">
                {info.unfavorable.map((f, i) => (
                  <li key={i} className="text-xs text-red-800 flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function YogaModal({ info, onClose }: { info: YogaInfo; onClose: () => void }) {
  const bg = info.nature === "Auspicious" ? "from-green-500 to-emerald-600" :
             info.nature === "Inauspicious" ? "from-red-500 to-rose-600" : "from-orange-500 to-amber-600";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className={`bg-gradient-to-r ${bg} px-6 py-4 rounded-t-2xl`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block">
                Yoga {info.index} · {info.nature}
              </span>
              <h2 className="text-2xl font-bold text-white">{info.name}</h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none ml-4 mt-1">✕</button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-stone-600 leading-relaxed">{info.description}</p>
          <div className={`mt-4 rounded-xl p-3 text-xs font-semibold text-center ${
            info.nature === "Auspicious" ? "bg-green-50 text-green-700 border border-green-200" :
            info.nature === "Inauspicious" ? "bg-red-50 text-red-700 border border-red-200" :
            "bg-indigo-50 text-indigo-700 border border-indigo-200"
          }`}>
            {info.nature === "Auspicious" ? "✅ Generally Auspicious for activities" :
             info.nature === "Inauspicious" ? "⚠️ Avoid important undertakings" :
             "🔄 Mixed results — proceed with caution"}
          </div>
        </div>
      </div>
    </div>
  );
}

type ReferenceTab = "nakshatra" | "tithi" | "yoga" | "months";

export default function ReferenceSection() {
  const [activeTab, setActiveTab] = useState<ReferenceTab>("nakshatra");
  const [selectedNakshatra, setSelectedNakshatra] = useState<NakshatraInfo | null>(null);
  const [selectedTithi, setSelectedTithi] = useState<TithiInfo | null>(null);
  const [selectedYoga, setSelectedYoga] = useState<YogaInfo | null>(null);

  const tabs: { key: ReferenceTab; label: string; icon: string }[] = [
    { key: "nakshatra", label: "Nakshatra List", icon: "⭐" },
    { key: "tithi", label: "Tithi Names", icon: "🌙" },
    { key: "yoga", label: "Yoga Names", icon: "🔯" },
    { key: "months", label: "Lunar Months", icon: "📅" },
  ];

  return (
    <div className="mt-6">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Section header */}
        <div className="panchang-gradient px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> Panchang Reference Guide
          </h2>
          <p className="text-indigo-200 text-sm mt-0.5">
            Click any name below to learn its meaning, mythology, and significance
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-indigo-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition border-b-2 ${
                activeTab === tab.key
                  ? "border-orange-500 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-stone-500 hover:text-indigo-500 hover:bg-indigo-50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* NAKSHATRA TAB */}
          {activeTab === "nakshatra" && (
            <div>
              <p className="text-xs text-stone-500 mb-4">
                There are 27 Nakshatras (lunar mansions) in Vedic astrology. Each spans 13°20′ of the zodiac. Click any nakshatra to learn more.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {NAKSHATRA_DATA.map(n => (
                  <button
                    key={n.index}
                    onClick={() => setSelectedNakshatra(n)}
                    className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-indigo-100 hover:border-orange-300 hover:bg-indigo-50 transition text-left"
                  >
                    <span className="w-6 h-6 flex-shrink-0 rounded-full text-xs font-bold flex items-center justify-center bg-orange-100 text-indigo-700 group-hover:bg-indigo-500 group-hover:text-white transition">
                      {n.index}
                    </span>
                    <span className="text-sm font-medium text-stone-700 group-hover:text-indigo-700 transition leading-tight">
                      {n.name}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-center text-stone-400">
                ⭐ {NAKSHATRA_DATA.length} Nakshatras · Click each to see full details
              </p>
            </div>
          )}

          {/* TITHI TAB */}
          {activeTab === "tithi" && (
            <div>
              <p className="text-xs text-stone-500 mb-4">
                A Tithi is a lunar day — 1/30th of a lunar month. Each tithi lasts about 19–26 hours and has a unique spiritual significance. Click any tithi to learn more.
              </p>
              <div className="space-y-2">
                {/* Shukla Paksha */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-orange-100"></div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-2">🌕 Shukla Paksha (Waxing Moon)</span>
                    <div className="h-px flex-1 bg-orange-100"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {TITHI_DATA.slice(0, 15).map(t => (
                      <button
                        key={t.index}
                        onClick={() => setSelectedTithi(t)}
                        className="group flex items-center gap-2 p-2.5 rounded-xl border border-indigo-100 hover:border-orange-300 hover:bg-indigo-50 transition text-left"
                      >
                        <span className="text-base">{t.symbol.split("")[0]}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-500">#{t.index}</p>
                          <p className="text-sm font-medium text-stone-700 group-hover:text-indigo-700 transition leading-tight truncate">{t.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Krishna Paksha */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-stone-200"></div>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest px-2">🌑 Krishna Paksha (Waning Moon)</span>
                    <div className="h-px flex-1 bg-stone-200"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {TITHI_DATA.map(t => (
                      <button
                        key={t.index + 15}
                        onClick={() => setSelectedTithi(t)}
                        className="group flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 hover:border-orange-300 hover:bg-indigo-50 transition text-left"
                      >
                        <span className="text-base">🌑</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-400">#{t.index}</p>
                          <p className="text-sm font-medium text-stone-600 group-hover:text-indigo-700 transition leading-tight truncate">{t.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-center text-stone-400">
                🌙 30 Tithis per lunar month · Click each to see full details
              </p>
            </div>
          )}

          {/* YOGA TAB */}
          {activeTab === "yoga" && (
            <div>
              <p className="text-xs text-stone-500 mb-4">
                Yoga is computed by adding the longitudes of the Sun and Moon, then dividing by 13°20′. There are 27 Yogas, ranging from auspicious to inauspicious. Click any yoga to learn more.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {YOGA_DATA.map(y => (
                  <button
                    key={y.index}
                    onClick={() => setSelectedYoga(y)}
                    className={`group flex items-center gap-2.5 p-2.5 rounded-xl border transition text-left ${
                      y.nature === "Auspicious"
                        ? "border-green-200 hover:bg-green-50 hover:border-green-400"
                        : y.nature === "Inauspicious"
                        ? "border-red-200 hover:bg-red-50 hover:border-red-400"
                        : "border-indigo-200 hover:bg-indigo-50 hover:border-orange-400"
                    }`}
                  >
                    <span className={`w-6 h-6 flex-shrink-0 rounded-full text-xs font-bold flex items-center justify-center ${
                      y.nature === "Auspicious" ? "bg-green-100 text-green-700 group-hover:bg-green-500 group-hover:text-white" :
                      y.nature === "Inauspicious" ? "bg-red-100 text-red-700 group-hover:bg-red-500 group-hover:text-white" :
                      "bg-orange-100 text-indigo-700 group-hover:bg-indigo-500 group-hover:text-white"
                    } transition`}>
                      {y.index}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-700 leading-tight truncate">{y.name}</p>
                      <p className={`text-xs font-semibold ${
                        y.nature === "Auspicious" ? "text-green-600" :
                        y.nature === "Inauspicious" ? "text-red-600" : "text-indigo-600"
                      }`}>
                        {y.nature === "Auspicious" ? "✅" : y.nature === "Inauspicious" ? "⚠️" : "🔄"} {y.nature}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-stone-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Auspicious</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Inauspicious</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span> Mixed</span>
              </div>
            </div>
          )}

          {/* MONTHS TAB */}
          {activeTab === "months" && (
            <div>
              <p className="text-xs text-stone-500 mb-4">
                The Hindu lunar calendar has 12 months, each named after the nakshatra in which the Full Moon (Purnima) occurs. Each month has a presiding deity and unique festivals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LUNAR_MONTHS.map(m => (
                  <div key={m.index} className="border border-indigo-100 rounded-xl p-4 hover:bg-indigo-50 hover:border-indigo-200 transition">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-orange-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {m.index}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="font-bold text-stone-800">{m.name}</h3>
                          <span className="text-xs text-stone-500">{m.englishName}</span>
                          <span className="text-xs bg-orange-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-medium">{m.deity}</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{m.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedNakshatra && (
        <NakshatraModal info={selectedNakshatra} onClose={() => setSelectedNakshatra(null)} />
      )}
      {selectedTithi && (
        <TithiModal info={selectedTithi} onClose={() => setSelectedTithi(null)} />
      )}
      {selectedYoga && (
        <YogaModal info={selectedYoga} onClose={() => setSelectedYoga(null)} />
      )}
    </div>
  );
}
