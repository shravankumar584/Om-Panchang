import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PanchangPage from "@/pages/PanchangPage";
import LegalPage from "@/pages/LegalPage";
import AboutPage from "@/pages/AboutPage";
import MonthlyCalendarPage from "@/pages/MonthlyCalendarPage";
import FestivalPage from "@/pages/FestivalPage";
import UnsubscribePage from "@/pages/UnsubscribePage";
import HoroscopePage from "@/pages/HoroscopePage";
import BlogPage from "@/pages/BlogPage";
import { slugToMonthYear } from "@/lib/calendarUtils";
import { CITIES, slugToCity, getDefaultCityByTimezone, type City } from "@/lib/panchangData";
import { FESTIVALS } from "@/lib/festivalsData";
import { ZODIAC_SLUGS } from "@/lib/horoscopeData";
import { BLOG_SLUGS } from "@/lib/blogData";
import CanonicalTag from "@/components/CanonicalTag";
import RobotsTag from "@/components/RobotsTag";
import TrendingBlogTicker from "@/components/TrendingBlogTicker";

const FESTIVAL_SLUGS = new Set(FESTIVALS.map(f => f.slug));

function detectBlog(path: string): { isIndex: boolean; slug?: string } | null {
  const segments = path.split("/").filter(Boolean);
  if (segments[0] !== "blog") return null;
  if (segments.length === 1) return { isIndex: true };
  // Only accept exactly /blog/:slug — deeper paths like /blog/x/y are not valid
  // article URLs and must not be treated as articles (avoids duplicate content).
  if (segments.length > 2) return { isIndex: false, slug: undefined };
  const slug = segments[1].toLowerCase();
  return { isIndex: false, slug };
}

// Thin/templated routes that should NOT be indexed by search engines.
// These pages share boilerplate text and only differ by city/date data,
// which trips Google's "low value content" / doorway-page filters.
const CITY_TEMPLATED_VARIANTS = new Set([
  "panchang",
  "choghadiya",
  "rahu-kalam-today",
  "nakshatra-today",
  "hora-today",
  "brahma-muhurta",
]);

function shouldNoindex(path: string): boolean {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return false;
  // All monthly calendar pages (e.g. /panchang-calendar/april-2026/delhi)
  if (segments[0] === "panchang-calendar") return true;
  // City-specific subroutes (e.g. /panchang/delhi, /choghadiya/mumbai)
  if (segments.length >= 2 && CITY_TEMPLATED_VARIANTS.has(segments[0])) {
    return true;
  }
  return false;
}

function detectHoroscope(path: string): { isIndex: boolean; sign?: string } | null {
  const segments = path.split("/").filter(Boolean);
  if (segments[0] !== "horoscope") return null;
  if (segments.length === 1) return { isIndex: true };
  const slug = segments[1].toLowerCase();
  if (ZODIAC_SLUGS.has(slug)) return { isIndex: false, sign: slug };
  return { isIndex: true };
}

function detectFestival(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  // Strip optional trailing year suffix (e.g. "diwali-2026" → "diwali")
  let slug = segments[0].toLowerCase();
  const yearStripped = slug.replace(/-20\d{2}$/, "");
  if (FESTIVAL_SLUGS.has(slug)) return slug;
  if (FESTIVAL_SLUGS.has(yearStripped)) return yearStripped;
  return null;
}

const queryClient = new QueryClient();

function detectLegalPage(path: string): "disclaimer" | "contact" | "privacy" | "about" | null {
  if (path.includes("about"))         return "about";
  if (path.includes("disclaimer"))    return "disclaimer";
  if (path.includes("contact-us") || path.includes("contact_us")) return "contact";
  if (path.includes("privacy-policy") || path.includes("privacy_policy")) return "privacy";
  return null;
}

function detectVariant(path: string) {
  if (path.includes("telugu-calendar"))    return "telugu";
  if (path.includes("hindu-calendar"))     return "hindu";
  if (path.includes("vedic-astrology"))    return "vedic-astrology";
  if (path.includes("hindu-astrology"))    return "hindu-astrology";
  if (path.includes("kundali-milan"))      return "kundali-milan";
  if (path.includes("kundali"))            return "kundali";
  if (path.includes("marriage-muhurat"))   return "marriage-muhurat";
  if (path.includes("panchang-today"))     return "panchang-today";
  if (path.includes("hindu-festivals"))    return "hindu-festivals";
  if (path.includes("nakshatra-today"))    return "nakshatra-today";
  if (path.includes("rahu-kalam-today"))   return "rahu-kalam-today";
  if (path.includes("baby-names-by-nakshatra") || path.includes("baby-names-nakshatra")) return "baby-names-nakshatra";
  if (path.includes("choghadiya"))         return "choghadiya-today";
  if (path.includes("ekadashi"))           return "ekadashi-dates";
  if (path.includes("amavasya"))           return "amavasya-dates";
  if (path.includes("purnima") || path.includes("pournami")) return "purnima-dates";
  if (path.includes("pradosh"))            return "pradosh-vrat";
  if (path.includes("hora-today") || path.includes("hora-timings") || path.includes("hora")) return "hora-today";
  if (path.includes("brahma-muhurta") || path.includes("brahma_muhurta")) return "brahma-muhurta";
  return "default";
}

function detectInitialCity(path: string): City {
  const segments = path.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const slug = segments[segments.length - 1];
    const city = slugToCity(slug);
    if (city) return city;
  }
  // No city in the URL — auto-pick based on the browser's timezone
  // (e.g. Asia/Kolkata → Delhi, America/New_York → New York).
  return getDefaultCityByTimezone();
}

interface MonthlyRoute {
  type: "monthly";
  month: number;
  year: number;
  city: City;
}

function detectMonthlyCalendar(path: string): MonthlyRoute | null {
  const segments = path.split("/").filter(Boolean);
  if (segments[0] !== "panchang-calendar") return null;
  const monthYear = slugToMonthYear(segments[1] ?? "");
  if (!monthYear) return null;
  const citySlug = segments[2] ?? "";
  const city = slugToCity(citySlug) ?? getDefaultCityByTimezone();
  return { type: "monthly", month: monthYear.month, year: monthYear.year, city };
}

function parseRoute(path: string) {
  return {
    legalPage:     detectLegalPage(path),
    monthly:       detectMonthlyCalendar(path),
    festivalSlug:  detectFestival(path),
    variant:       detectVariant(path),
    initialCity:   detectInitialCity(path),
  };
}

// Legacy URLs that should redirect to a canonical equivalent.
// Used for content consolidation (e.g. /hindu-astrology and /vedic-astrology
// were near-duplicates — we keep /vedic-astrology as the canonical URL).
const LEGACY_REDIRECTS: Record<string, string> = {
  "/hindu-astrology": "/vedic-astrology",
};

function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const { legalPage, monthly, festivalSlug, variant, initialCity } = route;
  const path = window.location.pathname;

  // Redirect legacy / consolidated URLs to their canonical destination.
  // Render nothing while the browser navigates to avoid a flash of old content.
  const redirectTarget = LEGACY_REDIRECTS[path];
  if (redirectTarget) {
    window.location.replace(redirectTarget + window.location.search + window.location.hash);
    return null;
  }

  const noindex = shouldNoindex(path);

  if (path.startsWith("/unsubscribe")) {
    return <QueryClientProvider client={queryClient}><RobotsTag noindex={true} /><UnsubscribePage /></QueryClientProvider>;
  }

  const blog = detectBlog(path);
  if (blog) {
    // Index page is always indexable; detail pages indexable only if the slug matches a real article
    const isValidArticle = blog.isIndex || (blog.slug && BLOG_SLUGS.has(blog.slug));
    // For invalid paths (deep nesting or unknown slug), pass a sentinel so BlogPage
    // shows the 404 view instead of falling back to the index (which would be confusing).
    const slugToPass = blog.isIndex
      ? undefined
      : (blog.slug ?? "__invalid__");
    return (
      <QueryClientProvider client={queryClient}>
        <TrendingBlogTicker />
        <CanonicalTag />
        <RobotsTag noindex={!isValidArticle} />
        <BlogPage slug={slugToPass} />
      </QueryClientProvider>
    );
  }

  const horoscope = detectHoroscope(path);
  if (horoscope) {
    return (
      <QueryClientProvider client={queryClient}>
        <TrendingBlogTicker />
        <CanonicalTag />
        <RobotsTag noindex={noindex} />
        <HoroscopePage slug={horoscope.sign} />
      </QueryClientProvider>
    );
  }

  if (legalPage === "about") return <QueryClientProvider client={queryClient}><TrendingBlogTicker /><RobotsTag noindex={noindex} /><AboutPage /></QueryClientProvider>;
  if (legalPage)             return <QueryClientProvider client={queryClient}><TrendingBlogTicker /><RobotsTag noindex={noindex} /><LegalPage page={legalPage} /></QueryClientProvider>;
  if (festivalSlug)          return <QueryClientProvider client={queryClient}><TrendingBlogTicker /><RobotsTag noindex={noindex} /><FestivalPage slug={festivalSlug} /></QueryClientProvider>;
  if (monthly)               return (
    <QueryClientProvider client={queryClient}>
      <TrendingBlogTicker />
      <CanonicalTag />
      <RobotsTag noindex={noindex} />
      <MonthlyCalendarPage
        key={`${monthly.month}-${monthly.year}-${monthly.city.name}`}
        initialMonth={monthly.month}
        initialYear={monthly.year}
        initialCity={monthly.city}
      />
    </QueryClientProvider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TrendingBlogTicker />
      <CanonicalTag />
      <RobotsTag noindex={noindex} />
      <PanchangPage
        key={`${variant}-${initialCity.name}`}
        variant={variant as any}
        initialCity={initialCity}
      />
    </QueryClientProvider>
  );
}

export default App;
