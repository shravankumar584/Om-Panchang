import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PanchangPage from "@/pages/PanchangPage";
import LegalPage from "@/pages/LegalPage";
import AboutPage from "@/pages/AboutPage";
import { CITIES, slugToCity, type City } from "@/lib/panchangData";

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
  return CITIES[0];
}

function parseRoute(path: string) {
  return {
    legalPage:   detectLegalPage(path),
    variant:     detectVariant(path),
    initialCity: detectInitialCity(path),
  };
}

function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const { legalPage, variant, initialCity } = route;

  return (
    <QueryClientProvider client={queryClient}>
      {legalPage === "about"
        ? <AboutPage />
        : legalPage
          ? <LegalPage page={legalPage} />
          : <PanchangPage
              key={`${variant}-${initialCity.name}`}
              variant={variant as any}
              initialCity={initialCity}
            />
      }
    </QueryClientProvider>
  );
}

export default App;
