import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PanchangPage from "@/pages/PanchangPage";
import LegalPage from "@/pages/LegalPage";

const queryClient = new QueryClient();

// Detect legal pages first (standalone pages, not a variant of PanchangPage)
function detectLegalPage(): "disclaimer" | "contact" | "privacy" | null {
  const path = window.location.pathname;
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
  if (path.includes("rahu-kalam-today"))    return "rahu-kalam-today";
  if (path.includes("baby-names-by-nakshatra") || path.includes("baby-names-nakshatra")) return "baby-names-nakshatra";
  if (path.includes("choghadiya"))              return "choghadiya-today";
  if (path.includes("ekadashi"))                return "ekadashi-dates";
  if (path.includes("amavasya"))                return "amavasya-dates";
  if (path.includes("purnima") || path.includes("pournami")) return "purnima-dates";
  if (path.includes("pradosh"))                 return "pradosh-vrat";
  return "default";
}

const legalPage = detectLegalPage();
const variant   = detectVariant();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {legalPage
        ? <LegalPage page={legalPage} />
        : <PanchangPage variant={variant as any} />
      }
    </QueryClientProvider>
  );
}

export default App;
