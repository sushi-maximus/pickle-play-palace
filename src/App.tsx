import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { AppErrorBoundary } from "@/components/error-boundaries";
import { createCacheManager } from "@/lib/cacheUtils";
import { preloadCriticalRoutes } from "@/utils/lazyLoading";
import { RouteLoader } from "@/components/routing/RouteLoader";

// Import routing components
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import { Landing } from "@/components/routing/Landing";

// Import eager-loaded pages (critical for initial load)
import { Index, Login, Signup } from "@/pages/lazy";

// Import lazy-loaded pages
import { 
  LazyDashboard,
  LazyProfile,
  LazyGroups,
  LazyGroupDetails,
  LazyAbout,
  LazyContact,
  LazyPrivacy,
  LazyForgotPassword,
  LazyAuthCallback,
  LazyNotFound
} from "@/pages/lazy";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error instanceof Error && error.message.includes('auth')) {
          return false;
        }
        // Retry network errors up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Enhanced caching strategy
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
      refetchOnMount: (query) => {
        // Only refetch if data is older than 2 minutes
        return Date.now() - (query.state.dataUpdatedAt || 0) > 2 * 60 * 1000;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error instanceof Error && error.message.includes('auth')) {
          return false;
        }
        return failureCount < 2;
      },
      // Add optimistic update options
      onMutate: () => {
        console.log('Mutation started - optimistic update in progress');
      },
      onError: (error, variables, context) => {
        console.error('Mutation failed, rolling back:', error);
      },
      onSuccess: () => {
        console.log('Mutation successful');
      },
    },
  },
});

// Initialize cache manager for advanced cache operations
const cacheManager = createCacheManager(queryClient);

// Add cache monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Log cache stats every 30 seconds
  setInterval(() => {
    const stats = cacheManager.getCacheStats();
    console.log('Cache Stats:', stats);
  }, 30000);
  
  // Clear stale cache every 5 minutes
  setInterval(() => {
    cacheManager.clearStaleCache();
  }, 5 * 60 * 1000);
}

// Preload critical routes after app initialization
setTimeout(() => {
  preloadCriticalRoutes();
}, 1000);

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PerformanceProvider enabled={process.env.NODE_ENV === 'development'}>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Router>
              <AuthProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Routes>
                    {/* Smart landing route - redirects authenticated users to dashboard */}
                    <Route path="/" element={<Landing />} />
                    
                    {/* Public routes that redirect authenticated users */}
                    <Route path="/login" element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    } />
                    <Route path="/signup" element={
                      <PublicRoute>
                        <Signup />
                      </PublicRoute>
                    } />
                    <Route path="/forgot-password" element={
                      <PublicRoute>
                        <RouteLoader routeName="Forgot Password">
                          <LazyForgotPassword />
                        </RouteLoader>
                      </PublicRoute>
                    } />
                    
                    {/* Public informational pages */}
                    <Route path="/about" element={
                      <RouteLoader routeName="About">
                        <LazyAbout />
                      </RouteLoader>
                    } />
                    <Route path="/contact" element={
                      <RouteLoader routeName="Contact">
                        <LazyContact />
                      </RouteLoader>
                    } />
                    <Route path="/privacy" element={
                      <RouteLoader routeName="Privacy">
                        <LazyPrivacy />
                      </RouteLoader>
                    } />
                    
                    {/* Protected routes requiring authentication */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <RouteLoader routeName="Dashboard">
                          <LazyDashboard />
                        </RouteLoader>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <RouteLoader routeName="Profile">
                          <LazyProfile />
                        </RouteLoader>
                      </ProtectedRoute>
                    } />
                    <Route path="/groups" element={
                      <ProtectedRoute>
                        <RouteLoader routeName="Groups">
                          <LazyGroups />
                        </RouteLoader>
                      </ProtectedRoute>
                    } />
                    <Route path="/groups/:id" element={
                      <ProtectedRoute>
                        <RouteLoader routeName="Group Details">
                          <LazyGroupDetails />
                        </RouteLoader>
                      </ProtectedRoute>
                    } />
                    
                    {/* Auth callback - no protection needed */}
                    <Route path="/auth/callback" element={
                      <RouteLoader routeName="Authentication">
                        <LazyAuthCallback />
                      </RouteLoader>
                    } />
                    
                    {/* 404 route */}
                    <Route path="*" element={
                      <RouteLoader routeName="Page Not Found">
                        <LazyNotFound />
                      </RouteLoader>
                    } />
                  </Routes>
                </div>
                <Toaster />
              </AuthProvider>
            </Router>
          </ThemeProvider>
        </PerformanceProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
