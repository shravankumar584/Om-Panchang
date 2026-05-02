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

export default function TrendingBlogTicker() {
  const trending = TRENDING_SLUGS
    .map((slug) => BLOG_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  if (trending.length === 0) return null;

  // Double the items for seamless looping
  const items = [...trending, ...trending];

  return (
    <div className="bg-indigo-950 text-white overflow-hidden py-2 border-b border-indigo-800/50 select-none no-print">
      <div className="flex w-max whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
        {items.map((article, idx) => (
          <button
            key={`${article.slug}-${idx}`}
            onClick={() => navigateTo(`/blog/${article.slug}`)}
            className="flex items-center mx-10 hover:text-gold transition-colors text-[11px] sm:text-xs font-bold uppercase tracking-widest group"
          >
            <span className="mr-3 text-gold filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              {article.emoji}
            </span>
            <span className="group-hover:translate-x-1 transition-transform inline-block">
              {article.cardTitle ?? article.title}
            </span>
            <span className="mx-6 text-indigo-700/50 font-light">/</span>
          </button>
        ))}
      </div>
    </div>
  );
}
