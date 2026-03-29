import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PanchangPage from "@/pages/PanchangPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PanchangPage />
    </QueryClientProvider>
  );
}

export default App;
