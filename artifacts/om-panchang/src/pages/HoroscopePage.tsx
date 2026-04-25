import { useEffect, useMemo } from "react";
import { useGetHoroscope, type HoroscopeResult } from "@workspace/api-client-react";
import { ZODIAC_SIGNS, getZodiacBySlug, type ZodiacSign } from "@/lib/horoscopeData";
import { getCanonicalUrl } from "@/lib/canonical";
import SubscribeCard from "@/components/SubscribeCard";
import FindTempleCard from "@/components/FindTempleCard";

interface Props {
  slug?: string; // when undefined we render the index page
}

const SignCard = ({ sign }: { sign: ZodiacSign }) => (
  <a
    href={`/horoscope/${sign.slug}`}
    className="block rounded-2xl border border-stone-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition group"
    data-testid={`zodiac-card-${sign.slug}`}
  >
    <div className="flex items-center gap-3 mb-2">
      <span className="text-3xl">{sign.symbol}</span>
      <div>
        <h3 className="text-lg font-bold text-stone-800 group-hover:text-indigo-700">{sign.english}</h3>
        <p className="text-xs text-stone-500">{sign.sanskrit} · {sign.dateRange}</p>
      </div>
    </div>
    <p className="text-sm text-stone-600 line-clamp-2">{sign.shortDescription}</p>
  </a>
);

function HoroscopeIndex() {
  useEffect(() => {
    document.title = "Daily Horoscope – All 12 Zodiac Signs (Vedic Rashifal) | Om Panchang";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Read today's free daily horoscope for all 12 Vedic rashis (zodiac signs) — Aries, Taurus, Gemini and more. Updated every day with love, career, health and lucky number predictions.");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="panchang-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <a href="/" className="text-indigo-200 text-sm hover:text-white">← Om Panchang</a>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Daily Horoscope</h1>
          <p className="text-indigo-100 mt-2 max-w-2xl">
            Free Vedic daily horoscope (rashifal) for all 12 zodiac signs. Pick your rashi to read today's prediction for love, career, health, finances and your lucky number.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ZODIAC_SIGNS.map((s) => <SignCard key={s.slug} sign={s} />)}
        </div>

        <section className="mt-12 prose prose-stone max-w-none">
          <h2 className="text-2xl font-bold text-stone-800">About Daily Rashifal</h2>
          <p className="text-stone-700">
            In Vedic astrology, your rashi (moon sign) is determined by the position of the Moon at the time of your birth — not your sun sign. Daily rashifal predictions consider the day's planetary transits relative to your rashi to suggest favourable activities and timings. Your daily horoscope is updated every morning.
          </p>
          <p className="text-stone-700">
            For deeper insight, also check the <a href="/" className="text-indigo-700 hover:underline">today's panchang</a> for tithi, nakshatra and muhurat details.
          </p>
        </section>
      </main>
    </div>
  );
}

function SignSection({ title, body, icon, accent }: { title: string; body: string; icon: string; accent: string }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-bold text-stone-800">{title}</h3>
      </div>
      <p className="text-stone-700 leading-relaxed text-sm">{body}</p>
    </div>
  );
}

function HoroscopeDetail({ sign }: { sign: ZodiacSign }) {
  const { data, isLoading, isError } = useGetHoroscope(sign.slug as Parameters<typeof useGetHoroscope>[0]);
  const horoscope = data as HoroscopeResult | undefined;

  const today = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }, []);

  useEffect(() => {
    document.title = `${sign.english} Daily Horoscope (${sign.sanskrit} Rashifal) – Today | Om Panchang`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        `Today's free ${sign.english} (${sign.sanskrit}) daily horoscope. Read predictions for love, career, health, finance and lucky number, color, time. Updated daily.`
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = getCanonicalUrl(window.location.pathname);

    const existing = document.getElementById("horoscope-schema");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "horoscope-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${sign.english} Daily Horoscope – ${today}`,
      "datePublished": new Date().toISOString().slice(0, 10),
      "dateModified": new Date().toISOString().slice(0, 10),
      "author": { "@type": "Organization", "name": "Om Panchang" },
      "publisher": {
        "@type": "Organization",
        "name": "Om Panchang",
        "logo": { "@type": "ImageObject", "url": "https://ompanchang.org/og-image.png" },
      },
      "description": `Today's daily horoscope for ${sign.english} (${sign.sanskrit}). Predictions for love, career, health, finance and lucky details.`,
      "mainEntityOfPage": { "@type": "WebPage", "@id": getCanonicalUrl(window.location.pathname) },
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [sign, today]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="panchang-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <a href="/horoscope" className="text-indigo-200 text-sm hover:text-white">← All Signs</a>
            <a href="/" className="text-indigo-200 text-sm hover:text-white">Om Panchang →</a>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-5xl">{sign.symbol}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{sign.english} Daily Horoscope</h1>
              <p className="text-indigo-100 text-sm mt-1">
                {sign.sanskrit} · Ruled by {sign.lord} · {sign.element} element
              </p>
              <p className="text-amber-200 text-sm mt-1">{today}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {isLoading && (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-stone-500" data-testid="horoscope-loading">
              <div className="animate-pulse">Reading the stars for {sign.english}...</div>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-red-700">
              Couldn't load today's horoscope. Please refresh in a minute.
            </div>
          )}

          {horoscope && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm" data-testid="horoscope-overview">
                <h2 className="text-xl font-bold text-stone-800 mb-2">Today's Overview</h2>
                <p className="text-stone-700 leading-relaxed">{horoscope.overview}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SignSection title="Love & Relationships" body={horoscope.love} icon="❤️" accent="bg-rose-50 border-rose-200" />
                <SignSection title="Career & Work" body={horoscope.career} icon="💼" accent="bg-amber-50 border-amber-200" />
                <SignSection title="Health & Wellness" body={horoscope.health} icon="🌿" accent="bg-green-50 border-green-200" />
                <SignSection title="Money & Finance" body={horoscope.finance} icon="💰" accent="bg-yellow-50 border-yellow-200" />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-200">
                <h3 className="font-bold text-stone-800 mb-3">Today's Lucky Numbers & More</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">Lucky Number</p>
                    <p className="text-2xl font-bold text-stone-800" data-testid="lucky-number">{horoscope.luckyNumber}</p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-rose-600 font-semibold uppercase mb-1">Lucky Color</p>
                    <p className="text-lg font-bold text-stone-800">{horoscope.luckyColor}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-amber-700 font-semibold uppercase mb-1">Lucky Time</p>
                    <p className="text-sm font-bold text-stone-800">{horoscope.luckyTime}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-green-700 font-semibold uppercase mb-1">Mood</p>
                    <p className="text-sm font-bold text-stone-800">{horoscope.mood}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <section className="bg-white rounded-2xl p-6 border border-stone-200">
            <h3 className="font-bold text-stone-800 mb-2">About {sign.english} ({sign.sanskrit})</h3>
            <p className="text-stone-700 text-sm mb-3">{sign.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {sign.traits.map((t) => (
                <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </section>

          <nav className="bg-white rounded-2xl p-5 border border-stone-200">
            <h3 className="font-bold text-stone-800 mb-3">All Zodiac Signs</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {ZODIAC_SIGNS.map((s) => (
                <a
                  key={s.slug}
                  href={`/horoscope/${s.slug}`}
                  className={`text-center rounded-lg py-2 px-1 text-sm border transition ${
                    s.slug === sign.slug ? "bg-indigo-100 border-indigo-300 text-indigo-800 font-semibold" : "bg-stone-50 border-stone-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-xl">{s.symbol}</div>
                  <div className="text-xs mt-0.5">{s.english}</div>
                </a>
              ))}
            </div>
          </nav>
        </div>

        <aside className="space-y-5">
          <SubscribeCard variant="sidebar" />
          <FindTempleCard />
        </aside>
      </main>
    </div>
  );
}

export default function HoroscopePage({ slug }: Props) {
  if (!slug) return <HoroscopeIndex />;
  const sign = getZodiacBySlug(slug);
  if (!sign) return <HoroscopeIndex />;
  return <HoroscopeDetail sign={sign} />;
}
