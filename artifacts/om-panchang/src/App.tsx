import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PanchangPage from "@/pages/PanchangPage";

const queryClient = new QueryClient();

// Detect calendar variant from the URL path — works regardless of BASE_PATH prefix
function detectVariant(): "telugu" | "hindu" | "default" {
  const path = window.location.pathname;
  if (path.includes("telugu-calendar")) return "telugu";
  if (path.includes("hindu-calendar")) return "hindu";
  return "default";
}

const variant = detectVariant();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PanchangPage variant={variant} />
    </QueryClientProvider>
  );
}

export default App;
