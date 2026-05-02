import { useEffect, useMemo } from "react";
import { FESTIVALS, FestivalDetail, getCurrentOrNextOccurrence, getFestivalBySlug } from "@/lib/festivalsData";
import FindTempleCard from "@/components/FindTempleCard";
import { getCanonicalUrl } from "@/lib/canonical";
import { getDeityBlogForFestival, navigateToDeityBlog } from "@/lib/festivalDeityBlog";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Props {
  slug: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function formatDate(yyyymmdd: string): { full: string; weekday: string; year: number } {
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return {
    full: `${WEEKDAYS[date.getDay()]}, ${d} ${MONTHS[m - 1]} ${y}`,
    weekday: WEEKDAYS[date.getDay()],
    year: y,
  };
}

function daysUntil(yyyymmdd: string): number {
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export default function FestivalPage({ slug }: Props) {
  const festival = getFestivalBySlug(slug);
  const next = useMemo(() => festival ? getCurrentOrNextOccurrence(festival) : undefined, [festival]);

  useEffect(() => {
    if (!festival || !next) return;
    const year = next.year;
    document.title = `${festival.name} ${year} – Date, Muhurat, Rituals & Significance | Om Panchang`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", festival.metaDescription);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = getCanonicalUrl(window.location.pathname);

    // Inject Schema.org Event JSON-LD
    const existing = document.getElementById("festival-schema");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "festival-schema";
    const imageUrl = festival.deityImage
      ? `https://ompanchang.org${festival.deityImage}`
      : "https://ompanchang.org/og-image.png";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": `${festival.name} ${year}`,
      "alternateName": festival.alsoKnownAs,
      "startDate": next.date,
      "endDate": next.endDate || next.date,
      "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "description": festival.metaDescription,
      "image": [imageUrl],
      "location": {
        "@type": "Place",
        "name": "Hindu temples worldwide",
        "address": "India and global Hindu communities"
      },
      "organizer": {
        "@type": "Organization",
        "name": "Om Panchang",
        "url": "https://ompanchang.org",
        "logo": "https://ompanchang.org/og-image.png"
      },
      "performer": {
        "@type": "Organization",
        "name": "Hindu devotees & temple priests"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": `https://ompanchang.org/${festival.slug}`,
        "validFrom": next.date
      }
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [festival, next]);

  if (!festival || !next) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-900">Festival not found</p>
          <a href="/" className="text-indigo-600 underline mt-2 inline-block">Return home</a>
        </div>
      </div>
    );
  }

  const dateInfo = formatDate(next.date);
  const days = daysUntil(next.date);
  const dayLabel = days === 0 ? "Today!" : days === 1 ? "Tomorrow" : days > 0 ? `In ${days} days` : `${Math.abs(days)} days ago`;
  const isPast = days < 0;

  const related = festival.related.map(s => FESTIVALS.find(f => f.slug === s)).filter(Boolean) as FestivalDetail[];
  const deityBlog = getDeityBlogForFestival(festival.name);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #e8e8f8 50%, #f5f0ff 100%)" }}>
      {/* Header */}
      <header className="panchang-gradient shadow-xl">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <a href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md">🕉️</div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight group-hover:text-amber-200 transition">Om Panchang</h2>
              <p className="text-indigo-300 text-xs">Hindu Calendar &amp; Vedic Almanac</p>
            </div>
          </a>
        </div>
      </header>

      <Breadcrumbs items={[
        { label: "Festivals", href: "/hindu-festivals" },
        { label: festival.name }
      ]} />

      <article className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        {/* Hero */}
        <section className="bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden">
          <div className="grid md:grid-cols-3 gap-0">
            {festival.deityImage && (
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-6">
                <img
                  src={festival.deityImage}
                  alt={`${festival.deity} - presiding deity of ${festival.name}`}
                  className="w-full max-w-[240px] h-auto rounded-2xl border-4 border-white shadow-xl no-invert"
                />
              </div>
            )}
            <div className={`p-7 md:p-8 ${festival.deityImage ? "md:col-span-2" : "md:col-span-3"}`}>
              <p className="text-amber-600 text-xs uppercase tracking-widest font-bold mb-1">{festival.category === "major" ? "Major Hindu Festival" : festival.category === "vrat" ? "Vrat / Fasting Day" : "Regional Festival"}</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 leading-tight">{festival.name} {dateInfo.year}</h1>
              <p className="text-2xl text-indigo-700 font-semibold mt-1">{festival.sanskrit}</p>
              {festival.alsoKnownAs && (
                <p className="text-sm text-slate-500 mt-2">Also known as: {festival.alsoKnownAs.join(" · ")}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl px-5 py-3 shadow-md">
                  <p className="text-indigo-200 text-[10px] uppercase tracking-widest font-bold">Date</p>
                  <p className="font-bold text-lg leading-tight">{dateInfo.full}</p>
                </div>
                <div className={`${isPast ? "bg-slate-200 text-slate-600" : "bg-gradient-to-br from-amber-400 to-orange-500 text-white"} rounded-xl px-5 py-3 shadow-md flex flex-col justify-center`}>
                  <p className={`${isPast ? "text-slate-500" : "text-amber-100"} text-[10px] uppercase tracking-widest font-bold`}>Status</p>
                  <p className="font-bold text-lg leading-tight">{dayLabel}</p>
                </div>
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl px-5 py-3 shadow-md">
                  <p className="text-rose-200 text-[10px] uppercase tracking-widest font-bold">Deity</p>
                  <p className="font-bold text-lg leading-tight">{festival.deity}</p>
                </div>
              </div>

              <p className="text-slate-700 mt-5 leading-relaxed">{festival.shortDescription}</p>

              {deityBlog && (
                <button
                  type="button"
                  onClick={() => navigateToDeityBlog(deityBlog.slug)}
                  className="mt-5 group w-full text-left bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl px-4 py-3 transition flex items-center gap-3"
                  title={`Read the full guide on ${deityBlog.deityName}`}
                >
                  <span className="text-2xl flex-shrink-0">📖</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-amber-800 text-xs font-bold uppercase tracking-wide">Related Deity Guide</span>
                    <span className="block text-indigo-900 font-semibold text-sm mt-0.5 group-hover:text-indigo-700">
                      Read the full guide on {deityBlog.deityName}
                    </span>
                  </span>
                  <span className="text-indigo-700 group-hover:translate-x-0.5 transition-transform font-bold">→</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Muhurat */}
        {next.muhurat && next.muhurat.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2"><span>⏰</span> Shubh Muhurat &amp; Timings — {dateInfo.year}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {next.muhurat.map((m, i) => (
                <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <p className="text-amber-700 text-xs font-bold uppercase tracking-wide">{m.label}</p>
                  <p className="text-indigo-900 font-bold text-base mt-1">{m.time}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">Timings shown are based on Delhi/IST. For city-specific timings, visit the <a href="/" className="text-indigo-600 underline">Panchang home page</a> and select your city.</p>
          </section>
        )}

        {/* All occurrences */}
        {festival.occurrences.length > 1 && (
          <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
            <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2"><span>📅</span> {festival.name} Dates by Year</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {festival.occurrences.map(o => {
                const f = formatDate(o.date);
                const isCurrent = o.date === next.date;
                return (
                  <div key={o.year} className={`rounded-xl px-4 py-3 border ${isCurrent ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-200"}`}>
                    <p className={`text-xs font-bold uppercase tracking-wide ${isCurrent ? "text-indigo-700" : "text-slate-500"}`}>{festival.name} {o.year}</p>
                    <p className="text-indigo-900 font-bold mt-0.5">{f.full}</p>
                    {o.endDate && <p className="text-xs text-slate-600">until {formatDate(o.endDate).full}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Significance */}
        <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-3 flex items-center gap-2"><span>🌟</span> Significance of {festival.name}</h2>
          <p className="text-slate-700 leading-relaxed">{festival.significance}</p>
        </section>

        {/* Story */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-6">
          <h2 className="text-xl font-bold text-amber-800 mb-3 flex items-center gap-2"><span>📖</span> The Story Behind {festival.name}</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{festival.story}</p>
        </section>

        {/* Rituals */}
        <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-3 flex items-center gap-2"><span>📿</span> Rituals &amp; How to Celebrate</h2>
          <ul className="space-y-2">
            {festival.rituals.map((r, i) => (
              <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                <span className="text-amber-500 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Fasting */}
        {festival.fasting && (
          <section className="bg-rose-50 rounded-2xl border border-rose-200 p-6">
            <h2 className="text-xl font-bold text-rose-800 mb-3 flex items-center gap-2"><span>🍃</span> Fasting Rules</h2>
            <p className="text-slate-700 leading-relaxed">{festival.fasting}</p>
          </section>
        )}

        {/* What to offer */}
        {festival.whatToOffer && festival.whatToOffer.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
            <h2 className="text-xl font-bold text-indigo-800 mb-3 flex items-center gap-2"><span>🌺</span> What to Offer</h2>
            <div className="flex flex-wrap gap-2">
              {festival.whatToOffer.map((o, i) => (
                <span key={i} className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm px-3 py-1.5 rounded-full font-medium">{o}</span>
              ))}
            </div>
          </section>
        )}

        {/* Mantras */}
        {festival.mantras && festival.mantras.length > 0 && (
          <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2"><span>🕉️</span> Mantras to Chant</h2>
            <div className="space-y-4">
              {festival.mantras.map((m, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <p className="text-amber-100 font-serif text-lg leading-relaxed">{m.sanskrit}</p>
                  <p className="text-indigo-200 text-sm mt-2 italic">{m.meaning}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Do and Don't */}
        {festival.doAndDont && (
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
              <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2"><span>✓</span> Do</h3>
              <ul className="space-y-2">
                {festival.doAndDont.do.map((d, i) => (
                  <li key={i} className="text-slate-700 text-sm leading-relaxed flex gap-2"><span className="text-emerald-600">•</span> {d}</li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6">
              <h3 className="text-lg font-bold text-rose-800 mb-3 flex items-center gap-2"><span>✗</span> Don't</h3>
              <ul className="space-y-2">
                {festival.doAndDont.dont.map((d, i) => (
                  <li key={i} className="text-slate-700 text-sm leading-relaxed flex gap-2"><span className="text-rose-600">•</span> {d}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Regional names */}
        {festival.regionalNames && festival.regionalNames.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
            <h2 className="text-xl font-bold text-indigo-800 mb-3 flex items-center gap-2"><span>🗺️</span> Regional Names &amp; Variations</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {festival.regionalNames.map((r, i) => (
                <div key={i} className="bg-slate-50 rounded-lg px-4 py-2 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{r.region}</p>
                  <p className="text-indigo-900 font-bold">{r.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Find a temple near you */}
        <FindTempleCard variant="inline" context={festival.name} />

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
            <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2"><span>🔗</span> Related Festivals</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {related.map(r => (
                <a key={r.slug} href={`/${r.slug}`} className="block bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition rounded-xl p-4 border border-indigo-100">
                  <p className="font-bold text-indigo-900">{r.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{r.sanskrit}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* All festivals */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2"><span>📅</span> Browse All Hindu Festivals</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {FESTIVALS.filter(f => f.slug !== festival.slug).map(f => (
              <a key={f.slug} href={`/${f.slug}`} className="block bg-white hover:bg-indigo-50 transition rounded-lg px-3 py-2 border border-indigo-100 text-sm font-medium text-indigo-800">
                {f.name}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <a href="/hindu-festivals" className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold text-sm">
              View Hindu Festivals Calendar →
            </a>
          </div>
        </section>

        <footer className="text-center py-6 text-sm text-slate-500">
          <p>© 2026 Om Panchang · <a href="/about-us" className="text-indigo-600 hover:underline">About</a> · <a href="/privacy-policy" className="text-indigo-600 hover:underline">Privacy</a> · <a href="/disclaimer" className="text-indigo-600 hover:underline">Disclaimer</a></p>
        </footer>
      </article>
    </div>
  );
}
