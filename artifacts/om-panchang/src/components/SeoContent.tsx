import { useEffect } from "react";
import { SEO_CONTENT } from "@/lib/seoContent";

interface Props {
  variant: string;
}

export default function SeoContent({ variant }: Props) {
  const content = SEO_CONTENT[variant];

  useEffect(() => {
    if (!content || content.faqs.length === 0) return;
    const id = "seo-faq-jsonld";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [content]);

  if (!content) return null;

  return (
    <section
      className="max-w-4xl mx-auto px-4 py-10 text-slate-700"
      data-testid="seo-content"
    >
      <article className="prose prose-slate max-w-none">
        <p className="text-base leading-relaxed text-slate-600">
          {content.intro}
        </p>

        {content.sections.map((sec, i) => (
          <div key={i} className="mt-8">
            <h2 className="text-2xl font-bold text-indigo-900 border-b border-indigo-100 pb-2 mb-4">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p, j) => (
              <p
                key={j}
                className="text-base leading-relaxed text-slate-600 mb-3"
              >
                {p}
              </p>
            ))}
            {sec.bullets && (
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-2">
                {sec.bullets.map((b, k) => (
                  <li key={k} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {content.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-indigo-900 border-b border-indigo-100 pb-2 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {content.faqs.map((f, i) => (
                <div key={i} className="bg-indigo-50/40 rounded-lg p-5 border border-indigo-100">
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    {f.q}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
