import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always start with Home
  const allItems = [{ label: "Home", href: "/" }, ...items];

  // Prepare JSON-LD BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://ompanchang.org${item.href}` : undefined
    }))
  };

  function navigateTo(e: React.MouseEvent, href: string) {
    e.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 py-3 no-print">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <ol className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-medium text-slate-500">
        {allItems.map((item, idx) => (
          <Fragment key={idx}>
            <li className="flex items-center">
              {item.href && idx < allItems.length - 1 ? (
                <a
                  href={item.href}
                  onClick={(e) => navigateTo(e, item.href!)}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-slate-400 truncate max-w-[150px] sm:max-w-none">
                  {item.label}
                </span>
              )}
            </li>
            {idx < allItems.length - 1 && (
              <li className="text-slate-300 select-none">/</li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
