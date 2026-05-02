import { BLOG_ARTICLES } from "@/lib/blogData";
import { DayPanchang } from "@/lib/panchangData";

interface SpiritualInsightsProps {
  panchang: DayPanchang;
}

export default function SpiritualInsights({ panchang }: SpiritualInsightsProps) {
  // Logic to find the most relevant article based on today's data
  const getRelevantArticle = () => {
    const tithi = panchang.tithi.toLowerCase();
    const day = panchang.date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // 1. Check for Ekadashi first (Highest priority)
    if (tithi.includes("ekadashi")) {
      return BLOG_ARTICLES.find(a => a.slug === "ekadashi-vrat-explained");
    }

    // 2. Check for Pradosh (Trayodashi)
    if (tithi.includes("trayodashi")) {
      return BLOG_ARTICLES.find(a => a.slug === "pradosh-vrat-guide");
    }

    // 3. Weekly Deity Logic
    const weeklyMap: Record<number, string> = {
      0: "lord-surya",      // Sunday
      1: "lord-shiva",      // Monday
      2: "lord-hanuman",    // Tuesday
      3: "lord-ganesha",    // Wednesday
      4: "lord-vishnu",     // Thursday
      5: "goddess-lakshmi", // Friday
      6: "lord-shiva",      // Saturday (common fallback)
    };

    const slug = weeklyMap[day];
    return BLOG_ARTICLES.find(a => a.slug === slug);
  };

  const article = getRelevantArticle();

  if (!article) return null;

  function navigateTo(href: string) {
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm card-glow border border-indigo-100 overflow-hidden no-print mt-4">
      <div className="bg-indigo-50/50 px-5 py-3 border-b border-indigo-100 flex items-center justify-between">
        <h3 className="text-indigo-900 font-bold text-sm flex items-center gap-2">
          <span>✨</span> Spiritual Insights for Today
        </h3>
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-indigo-100">
          Wisdom
        </span>
      </div>
      
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-start">
        <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${article.gradient} flex items-center justify-center text-3xl shadow-sm`}>
          {article.emoji}
        </div>
        
        <div className="flex-1">
          <h4 className="text-slate-900 font-bold text-base leading-tight mb-1">
            {article.cardTitle}
          </h4>
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          <button
            onClick={() => navigateTo(`/blog/${article.slug}`)}
            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group"
          >
            Read Full Article <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
