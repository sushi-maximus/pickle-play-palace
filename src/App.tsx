
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { AppErrorBoundary } from "@/components/error-boundaries";
import { AppRouter } from "@/routing/AppRouter";
import { createAppQueryClient, setupCacheManager } from "@/config/queryClient";
import { initializeApp } from "@/utils/appInitialization";

import "./App.css";

const queryClient = createAppQueryClient();
setupCacheManager(queryClient);
initializeApp();

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PerformanceProvider enabled={process.env.NODE_ENV === 'development'}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <AppRouter />
          </ThemeProvider>
        </PerformanceProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
