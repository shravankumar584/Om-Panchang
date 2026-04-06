import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PanchangPage from "@/pages/PanchangPage";

const queryClient = new QueryClient();

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
  return "default";
}

const variant = detectVariant();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PanchangPage variant={variant as any} />
    </QueryClientProvider>
  );
}

export default App;
