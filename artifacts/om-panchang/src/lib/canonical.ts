export function getCanonicalUrl(pathname: string): string {
  const path = pathname.split(/[?#]/)[0].replace(/\/+$|^$/, "");
  if (!path || path === "/") return "https://ompanchang.org/";
  const monthlyMatch = path.match(/^\/panchang-calendar\/[a-z0-9-]+\/([a-z0-9-]+)$/);
  if (monthlyMatch) return `https://ompanchang.org${path}`;
  const cityCalendarMatch = path.match(/^\/panchang-([a-z0-9-]+)$/);
  if (cityCalendarMatch) return `https://ompanchang.org${path}`;
  if (path === "/about-us") return "https://ompanchang.org/about-us";
  if (path === "/disclaimer") return "https://ompanchang.org/disclaimer";
  if (path === "/contact-us") return "https://ompanchang.org/contact-us";
  if (path === "/privacy-policy") return "https://ompanchang.org/privacy-policy";
  if (path === "/hindu-calendar") return "https://ompanchang.org/hindu-calendar";
  if (path === "/telugu-calendar") return "https://ompanchang.org/telugu-calendar";
  if (path === "/vedic-astrology") return "https://ompanchang.org/vedic-astrology";
  // /hindu-astrology was consolidated into /vedic-astrology (near-duplicate content).
  // Canonical points to the survivor so any lingering references collapse correctly.
  if (path === "/hindu-astrology") return "https://ompanchang.org/vedic-astrology";
  if (path === "/kundali") return "https://ompanchang.org/kundali";
  if (path === "/kundali-milan") return "https://ompanchang.org/kundali-milan";
  if (path === "/marriage-muhurat") return "https://ompanchang.org/marriage-muhurat";
  if (path === "/panchang-today") return "https://ompanchang.org/panchang-today";
  if (path === "/hindu-festivals") return "https://ompanchang.org/hindu-festivals";
  if (path === "/ekadashi-dates") return "https://ompanchang.org/ekadashi-dates";
  if (path === "/amavasya-dates") return "https://ompanchang.org/amavasya-dates";
  if (path === "/purnima-dates") return "https://ompanchang.org/purnima-dates";
  if (path === "/pradosh-vrat") return "https://ompanchang.org/pradosh-vrat";
  if (path === "/hora-today") return "https://ompanchang.org/hora-today";
  if (path === "/brahma-muhurta") return "https://ompanchang.org/brahma-muhurta";
  if (path === "/choghadiya-today") return "https://ompanchang.org/choghadiya-today";
  if (path === "/nakshatra-today") return "https://ompanchang.org/nakshatra-today";
  if (path === "/rahu-kalam-today") return "https://ompanchang.org/rahu-kalam-today";
  if (path === "/blog") return "https://ompanchang.org/blog";
  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) return `https://ompanchang.org/blog/${blogMatch[1]}`;
  // Any other /blog/* path (including deep nested or invalid slugs) canonicalises
  // back to the blog index to avoid creating spurious indexable URLs.
  if (path.startsWith("/blog/")) return "https://ompanchang.org/blog";
  const festivalMatch = path.match(/^\/(diwali|dhanteras|bhai-dooj|raksha-bandhan|janmashtami|ganesh-chaturthi|navratri|dussehra|karwa-chauth|chhath-puja|guru-purnima|buddha-purnima|akshaya-tritiya|holi|maha-shivratri|ram-navami|hanuman-jayanti|ugadi)(?:-20\d{2})?$/);
  if (festivalMatch) return `https://ompanchang.org/${festivalMatch[1]}`;
  return `https://ompanchang.org${path}`;
}
