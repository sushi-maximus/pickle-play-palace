
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppErrorBoundary } from "@/components/error-boundaries";
import { createCacheManager } from "@/lib/cacheUtils";

// Import routing components
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import { Landing } from "@/components/routing/Landing";

// Import pages
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Profile from "@/pages/Profile";
import Groups from "@/pages/Groups";
import GroupDetails from "@/pages/GroupDetails";
import Dashboard from "@/pages/Dashboard";
import AuthCallback from "@/pages/AuthCallback";
import NotFound from "@/pages/NotFound";

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
        return Date.now() - query.dataUpdatedAt > 2 * 60 * 1000;
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

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
                      <ForgotPassword />
                    </PublicRoute>
                  } />
                  
                  {/* Public informational pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  
                  {/* Protected routes requiring authentication */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/groups" element={
                    <ProtectedRoute>
                      <Groups />
                    </ProtectedRoute>
                  } />
                  <Route path="/groups/:id" element={
                    <ProtectedRoute>
                      <GroupDetails />
                    </ProtectedRoute>
                  } />
                  
                  {/* Auth callback - no protection needed */}
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
