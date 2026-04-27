import { BLOG_ARTICLES } from "@/lib/blogData";

const TRENDING_SLUGS = [
  "hanuman-chalisa-meaning",
  "lord-rama",
  "lord-krishna",
  "lord-surya",
  "gayatri-mantra-meaning",
  "goddess-lakshmi",
];

function navigateTo(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}

export default function TrendingBlogBanner() {
  const trending = TRENDING_SLUGS
    .map((slug) => BLOG_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  if (trending.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm card-glow border border-indigo-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-indigo-200 text-xs uppercase tracking-widest font-semibold">
            🔥 Trending on the Blog
          </p>
          <p className="text-white font-bold text-lg mt-0.5 truncate">
            Long-form Hindu wisdom &amp; mantras
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo("/blog")}
          className="shrink-0 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg border border-white/30 backdrop-blur-sm transition-colors"
        >
          Explore All →
        </button>
      </div>

      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trending.map((article) => (
          <button
            key={article.slug}
            type="button"
            onClick={() => navigateTo(`/blog/${article.slug}`)}
            className="text-left group flex items-start gap-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
          >
            <div
              className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${article.gradient} flex items-center justify-center text-2xl shadow-sm`}
            >
              {article.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                {article.category}
              </p>
              <p className="text-sm font-bold text-slate-800 leading-snug mt-0.5 group-hover:text-indigo-700 line-clamp-2">
                {article.cardTitle ?? article.title}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {article.readTime} min read
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
