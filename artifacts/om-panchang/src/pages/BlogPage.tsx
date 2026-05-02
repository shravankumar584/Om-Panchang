import { useEffect, useMemo } from "react";
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  BlogArticle,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/blogData";
import { getCanonicalUrl } from "@/lib/canonical";
import ShareBar from "@/components/ShareBar";

interface Props {
  slug?: string;
}

const SITE_URL = "https://ompanchang.org";
const SITE_LOGO = `${SITE_URL}/og-image.png`;

function CommonFooter() {
  return (
    <footer className="text-center py-8 text-slate-400 text-xs border-t border-indigo-100 bg-white">
      <p className="font-medium text-slate-500">🕉️ Om Panchang · Hindu Calendar & Vedic Almanac 🕉️</p>
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        <a href="/" className="hover:text-indigo-600 transition">Home</a>
        <a href="/blog" className="hover:text-indigo-600 transition">Blog</a>
        <a href="/hindu-festivals" className="hover:text-indigo-600 transition">Festivals</a>
        <a href="/about-us" className="hover:text-indigo-600 transition">About Us</a>
        <a href="/disclaimer" className="hover:text-indigo-600 transition">Disclaimer</a>
        <a href="/contact-us" className="hover:text-indigo-600 transition">Contact Us</a>
        <a href="/privacy-policy" className="hover:text-indigo-600 transition">Privacy Policy</a>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// BLOG INDEX
// ────────────────────────────────────────────────────────────────────────────
function BlogIndex() {
  useEffect(() => {
    document.title = "Hindu Knowledge Hub – Articles on Deities, Panchang & Culture | Om Panchang";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute(
      "content",
      "Free articles on Hindu deities, Panchang concepts (tithi, nakshatra, muhurta), vrats, life ceremonies and Hindu culture. Read in-depth, original guides on Om Panchang.",
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}/blog`;

    // Inject Blog (CollectionPage) JSON-LD
    const existing = document.getElementById("blog-index-schema");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "blog-index-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Om Panchang Blog",
      "url": `${SITE_URL}/blog`,
      "description":
        "Original articles on Hindu deities, Panchang concepts, vrats, life ceremonies, and Hindu culture from Om Panchang.",
      "publisher": {
        "@type": "Organization",
        "name": "Om Panchang",
        "url": SITE_URL,
        "logo": SITE_LOGO,
      },
      "blogPost": BLOG_ARTICLES.map((a) => ({
        "@type": "BlogPosting",
        "headline": a.cardTitle,
        "url": `${SITE_URL}/blog/${a.slug}`,
        "datePublished": a.publishDate,
        "author": { "@type": "Organization", "name": "Om Panchang" },
      })),
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  const grouped = useMemo(() => {
    return BLOG_CATEGORIES.map((cat) => ({
      ...cat,
      articles: BLOG_ARTICLES.filter((a) => a.category === cat.name),
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <a href="/" className="text-indigo-200 text-sm hover:text-white">← Om Panchang</a>
          <div className="flex items-center justify-center gap-3 mt-3 mb-2">
            <span className="text-5xl">📖</span>
            <h1 className="text-3xl md:text-4xl font-bold">Hindu Knowledge Hub</h1>
          </div>
          <p className="text-indigo-100 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            In-depth, original articles on Hindu deities, Panchang concepts, vrats, life ceremonies, and the broader Hindu worldview — written for the global Hindu community.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10 space-y-10">
        {grouped.map((group) => (
          <section key={group.name}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{group.emoji}</span>
              <div>
                <h2 className="text-xl font-bold text-indigo-800">{group.name}</h2>
                <p className="text-xs text-slate-500">{group.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        ))}

        <section className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-indigo-800 mb-3">Looking for daily Panchang?</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Our knowledge hub is paired with free daily tools — today's Panchang for your city, festival dates, kundali calculator, and more. Use them alongside the articles to put the knowledge into practice.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="/panchang-today" className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-medium transition">Today's Panchang →</a>
            <a href="/hindu-festivals" className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-medium transition">Hindu Festivals →</a>
            <a href="/kundali" className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-medium transition">Free Kundali →</a>
            <a href="/marriage-muhurat" className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-medium transition">Marriage Muhurat →</a>
          </div>
        </section>
      </main>

      <CommonFooter />
    </div>
  );
}

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <a
      href={`/blog/${article.slug}`}
      className="group bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 transition"
    >
      <div className={`bg-gradient-to-br ${article.gradient} text-white p-5 flex items-center gap-3`}>
        <span className="text-4xl">{article.emoji}</span>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">{article.category}</p>
          <p className="text-sm font-bold leading-tight mt-0.5">{article.cardTitle}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{article.excerpt}</p>
        <p className="text-[11px] text-indigo-500 mt-3 font-medium group-hover:underline">
          Read article · {article.readTime} min read →
        </p>
      </div>
    </a>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// BLOG DETAIL
// ────────────────────────────────────────────────────────────────────────────
function BlogDetail({ article }: { article: BlogArticle }) {
  const related = useMemo(() => getRelatedArticles(article), [article]);
  const url = `${SITE_URL}/blog/${article.slug}`;

  useEffect(() => {
    document.title = `${article.cardTitle} | Om Panchang Blog`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", article.metaDescription);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = getCanonicalUrl(window.location.pathname);

    // Inject Article + FAQPage JSON-LD
    const articleScript = document.createElement("script");
    articleScript.type = "application/ld+json";
    articleScript.id = "blog-article-schema";
    articleScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.metaDescription,
      "datePublished": article.publishDate,
      "dateModified": article.publishDate,
      "author": {
        "@type": "Organization",
        "name": "Om Panchang",
        "url": SITE_URL,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Om Panchang",
        "url": SITE_URL,
        "logo": { "@type": "ImageObject", "url": SITE_LOGO },
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
      "articleSection": article.category,
      "url": url,
    });
    document.head.appendChild(articleScript);

    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.id = "blog-faq-schema";
    faqScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer },
      })),
    });
    document.head.appendChild(faqScript);

    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.id = "blog-breadcrumb-schema";
    breadcrumbScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": article.cardTitle, "item": url },
      ],
    });
    document.head.appendChild(breadcrumbScript);

    return () => {
      articleScript.remove();
      faqScript.remove();
      breadcrumbScript.remove();
    };
  }, [article, url]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 font-sans">
      {/* Hero */}
      <header className={`bg-gradient-to-br ${article.gradient} text-white`}>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <nav className="text-xs text-white/70 mb-4 flex items-center gap-2 flex-wrap">
            <a href="/" className="hover:text-white">Om Panchang</a>
            <span>›</span>
            <a href="/blog" className="hover:text-white">Blog</a>
            <span>›</span>
            <span className="text-white/90">{article.category}</span>
          </nav>

          <div className="flex items-start gap-4">
            <span className="text-6xl flex-shrink-0">{article.emoji}</span>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
                {article.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{article.title}</h1>
              <p className="text-white/80 text-xs mt-3">
                {new Date(article.publishDate).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })} · {article.readTime} min read
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        {/* Lead paragraph */}
        <p className="text-base text-slate-700 leading-relaxed font-serif border-l-4 border-indigo-300 pl-4 italic mb-8">
          {article.intro}
        </p>

        {/* Sections */}
        <article className="prose prose-slate max-w-none">
          {article.sections.map((section) => (
            <section key={section.heading} className="mb-8">
              <h2 className="text-xl font-bold text-indigo-800 mb-3 mt-0">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-slate-700 text-[15px] leading-relaxed mb-3">{p}</p>
              ))}
            </section>
          ))}
        </article>

        <ShareBar 
          title={article.title}
          summary={article.excerpt}
          url={url}
        />

        {/* Useful links sidebar (inline on this layout) */}
        {article.relatedLinks.length > 0 && (
          <aside className="bg-white border border-indigo-100 rounded-2xl p-5 my-8 shadow-sm">
            <h3 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
              <span>🛠️</span> Useful tools on Om Panchang
            </h3>
            <ul className="space-y-2">
              {article.relatedLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-2"
                  >
                    <span className="text-xs">→</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* FAQs */}
        <section className="my-10">
          <h2 className="text-xl font-bold text-indigo-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {article.faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-indigo-100 rounded-xl overflow-hidden"
              >
                <summary className="cursor-pointer list-none p-4 flex justify-between items-start gap-3 hover:bg-indigo-50/50 transition">
                  <span className="text-sm font-semibold text-slate-800">{faq.question}</span>
                  <span className="text-indigo-400 group-open:rotate-180 transition flex-shrink-0">▼</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="my-10">
            <h2 className="text-xl font-bold text-indigo-800 mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <a
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group bg-white border border-indigo-100 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <p className="text-sm font-semibold text-slate-800 mt-2 leading-tight group-hover:text-indigo-700">
                    {r.cardTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{r.excerpt}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Back to blog */}
        <div className="text-center mt-10">
          <a
            href="/blog"
            className="inline-block text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
          >
            ← Back to all articles
          </a>
        </div>
      </main>

      <CommonFooter />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 404
// ────────────────────────────────────────────────────────────────────────────
function ArticleNotFound() {
  useEffect(() => {
    document.title = "Article not found | Om Panchang Blog";
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans px-6 text-center">
      <span className="text-6xl mb-4">📖</span>
      <h1 className="text-2xl font-bold text-indigo-800 mb-2">Article not found</h1>
      <p className="text-slate-600 max-w-md mb-6">
        We couldn't find the article you were looking for. It may have moved or the link may be incorrect.
      </p>
      <a
        href="/blog"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition"
      >
        Browse all articles →
      </a>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// EXPORT
// ────────────────────────────────────────────────────────────────────────────
export default function BlogPage({ slug }: Props) {
  if (!slug) return <BlogIndex />;
  const article = getArticleBySlug(slug);
  if (!article) return <ArticleNotFound />;
  return <BlogDetail article={article} />;
}
