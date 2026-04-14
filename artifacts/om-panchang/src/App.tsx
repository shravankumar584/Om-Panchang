import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PanchangPage from "@/pages/PanchangPage";
import LegalPage from "@/pages/LegalPage";
import AboutPage from "@/pages/AboutPage";
import { CITIES, slugToCity, type City } from "@/lib/panchangData";

const queryClient = new QueryClient();

// Detect legal pages first (standalone pages, not a variant of PanchangPage)
function detectLegalPage(): "disclaimer" | "contact" | "privacy" | "about" | null {
  const path = window.location.pathname;
  if (path.includes("about"))         return "about";
  if (path.includes("disclaimer"))    return "disclaimer";
  if (path.includes("contact-us") || path.includes("contact_us")) return "contact";
  if (path.includes("privacy-policy") || path.includes("privacy_policy")) return "privacy";
  return null;
}

// Detect calendar variant from the URL path — works regardless of BASE_PATH prefix
function detectVariant() {
  const path = window.location.pathname;
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

/**
 * Extract a city slug from the URL.
 * Handles: /panchang/new-york  → "new-york"
 *          /choghadiya/chicago → "chicago"
 *          /rahu-kalam/houston → "houston"
 *          /                   → null (use default city)
 */
function detectInitialCity(): City {
  const segments = window.location.pathname.split("/").filter(Boolean);
  // City slug is always the last segment when there are 2+ segments
  // e.g. /panchang/new-york → segments = ["panchang", "new-york"]
  if (segments.length >= 2) {
    const slug = segments[segments.length - 1];
    const city = slugToCity(slug);
    if (city) return city;
  }
  return CITIES[0];
}

const legalPage   = detectLegalPage();
const variant     = detectVariant();
const initialCity = detectInitialCity();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {legalPage === "about"
        ? <AboutPage />
        : legalPage
          ? <LegalPage page={legalPage} />
          : <PanchangPage variant={variant as any} initialCity={initialCity} />
      }
    </QueryClientProvider>
  );
}

export default App;
