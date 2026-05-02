import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Om Panchang – Our Mission, Methodology & Team";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Learn about Om Panchang — a free Hindu Vedic almanac built for the global Hindu diaspora. Our mission, accuracy methodology (Drik + Lahiri Ayanamsa), and the team behind the calendar.");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-700 text-white px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-5xl">🕉️</span>
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">Om Panchang</h1>
            <p className="text-indigo-200 text-sm">Hindu Calendar & Vedic Almanac</p>
          </div>
        </div>
        <p className="text-indigo-100 text-base mt-3 max-w-xl mx-auto leading-relaxed">
          Bringing the ancient wisdom of Vedic timekeeping to the modern Hindu community worldwide.
        </p>
        <a
          href="/"
          className="inline-block mt-4 text-indigo-300 hover:text-white text-sm underline underline-offset-2 transition"
        >
          ← Back to Om Panchang
        </a>
      </div>

      <Breadcrumbs items={[{ label: "About Us" }]} />

      <div className="max-w-3xl mx-auto px-5 py-10 space-y-8">

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <h2 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
            <span>🌟</span> Our Mission
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Om Panchang was created with a single purpose — to make the profound depth of the Hindu
            Vedic calendar accessible to everyone, especially the millions of Hindu families living
            in the United States and across the global diaspora.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mt-3">
            Whether you are looking for today's Tithi before starting something important, checking
            the next Ekadashi fasting date, finding an auspicious Muhurta for a new venture, or
            generating a Kundali birth chart — Om Panchang is your single trusted destination for
            all things Vedic.
          </p>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <h2 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <span>📿</span> What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "📅", title: "Daily Panchang", desc: "Tithi, Nakshatra, Yoga, Karana, Vara for any date and city" },
              { icon: "🌙", title: "Vrat Calendar", desc: "All 24 Ekadashi, Amavasya, Purnima, Pradosh & Sankashti dates" },
              { icon: "⏰", title: "Muhurta Timings", desc: "Abhijit Muhurta, Rahu Kalam, Brahma Muhurta daily" },
              { icon: "🌀", title: "Choghadiya", desc: "Day and night auspicious time slots with live current slot" },
              { icon: "🔮", title: "Kundali Calculator", desc: "Free Vedic birth chart generation using Lahiri Ayanamsa" },
              { icon: "💑", title: "Kundali Milan", desc: "Hindu marriage compatibility matching (Gun Milan)" },
              { icon: "🪐", title: "Planetary Positions", desc: "Live Navagraha positions in the sidereal zodiac" },
              { icon: "👶", title: "Baby Names", desc: "Auspicious Hindu baby names by Janma Nakshatra" },
              { icon: "🎉", title: "Festival Calendar", desc: "All major Hindu festivals with dates and significance" },
              { icon: "🌆", title: "70+ Cities", desc: "Accurate calculations for major US & Indian cities" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 bg-indigo-50/60 rounded-xl p-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy & Methodology */}
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <h2 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
            <span>🔭</span> Accuracy & Methodology
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            All panchang calculations on Om Panchang are computed using the <strong>Drik (observed)
            method</strong> — the same modern standard used by leading panchang authorities. We use
            precise astronomical algorithms to compute sunrise, sunset, and planetary longitudes in
            real time for your selected city.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mt-3">
            Vedic (Jyotish) calculations use the <strong>Lahiri Ayanamsa</strong> to convert
            tropical positions to the sidereal zodiac, consistent with the Government of India's
            official panchang standard. Our results have been verified against authoritative sources
            to be accurate within minutes.
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            <strong>Note:</strong> Panchang timings may vary slightly by geographic location and
            local horizon. Always verify with your local priest or Jyotishi for important ceremonies.
          </div>
        </div>

        {/* Who We Are */}
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <h2 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
            <span>🙏</span> Who We Are
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Om Panchang is an independent project built by and for the global Hindu community. We
            are passionate about preserving and sharing the richness of Vedic knowledge — making
            it freely available in a clean, accurate, and modern format for families who may be
            far from home but never far from their traditions.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mt-3">
            The app is free to use and always will be. We are continuously improving it based on
            community feedback and adding new features to serve your needs better.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
          <h2 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
            <span>✉️</span> Contact Us
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            We love hearing from our community — whether it's a question about Panchang, a
            suggestion for a new feature, a date correction, or just a note to say the app helped
            you. Write to us anytime:
          </p>
          <a
            href="mailto:ompanchang.org@gmail.com"
            className="inline-flex items-center gap-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow"
          >
            <span>📧</span>
            ompanchang.org@gmail.com
          </a>
          <p className="text-xs text-slate-500 mt-3">
            We typically respond within 1–2 business days. For urgent panchang questions, include
            your date, city, and what you're looking for.
          </p>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 pb-4">
          <a href="/" className="hover:text-indigo-600 transition">Home</a>
          <span>·</span>
          <a href="/privacy-policy" className="hover:text-indigo-600 transition">Privacy Policy</a>
          <span>·</span>
          <a href="/disclaimer" className="hover:text-indigo-600 transition">Disclaimer</a>
          <span>·</span>
          <a href="/contact-us" className="hover:text-indigo-600 transition">Contact</a>
        </div>

      </div>
    </div>
  );
}
