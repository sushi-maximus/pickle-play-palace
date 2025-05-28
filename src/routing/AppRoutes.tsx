
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import { RouteLoader } from "@/components/routing/RouteLoader";
import { RouteErrorBoundary } from "@/components/error-boundaries";

// Lazy load components
import { 
  LazyDashboard,
  LazyGroups,
  LazyGroupDetails,
  LazyProfile,
  LazyAdmin,
  LazyContact,
  LazyPrivacy,
  LazyNotFound,
  LazyAuthCallback,
  LazyEventDetailsPage
} from "@/pages/lazy";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import Index from "@/pages/Index";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <RouteErrorBoundary routeName="Index">
              <Index />
            </RouteErrorBoundary>
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <RouteErrorBoundary routeName="Login">
              <Login />
            </RouteErrorBoundary>
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <RouteErrorBoundary routeName="Signup">
              <Signup />
            </RouteErrorBoundary>
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <RouteErrorBoundary routeName="ForgotPassword">
              <ForgotPassword />
            </RouteErrorBoundary>
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/auth/callback" 
        element={
          <RouteErrorBoundary routeName="AuthCallback">
            <RouteLoader routeName="AuthCallback">
              <LazyAuthCallback />
            </RouteLoader>
          </RouteErrorBoundary>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <RouteErrorBoundary routeName="Dashboard">
              <RouteLoader routeName="Dashboard">
                <LazyDashboard />
              </RouteLoader>
            </RouteErrorBoundary>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/groups" 
        element={
          <ProtectedRoute>
            <RouteErrorBoundary routeName="Groups">
              <RouteLoader routeName="Groups">
                <LazyGroups />
              </RouteLoader>
            </RouteErrorBoundary>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/groups/:groupId" 
        element={
          <ProtectedRoute>
            <RouteErrorBoundary routeName="GroupDetails">
              <RouteLoader routeName="GroupDetails">
                <LazyGroupDetails />
              </RouteLoader>
            </RouteErrorBoundary>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/groups/:groupId/events/:eventId" 
        element={
          <ProtectedRoute>
            <RouteErrorBoundary routeName="EventDetails">
              <RouteLoader routeName="EventDetails">
                <LazyEventDetailsPage />
              </RouteLoader>
            </RouteErrorBoundary>
          </ProtectedRoute>
        } 
      />

      {/* Add direct event route */}
      <Route 
        path="/events/:eventId" 
        element={
          <ProtectedRoute>
            <RouteErrorBoundary routeName="EventDetails">
              <RouteLoader routeName="EventDetails">
                <LazyEventDetailsPage />
              </RouteLoader>
            </RouteErrorBoundary>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <RouteErrorBoundary routeName="Profile">
              <RouteLoader routeName="Profile">
                <LazyProfile />
              </RouteLoader>
            </RouteErrorBoundary>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <RouteErrorBoundary routeName="Admin">
              <RouteLoader routeName="Admin">
                <LazyAdmin />
              </RouteLoader>
            </RouteErrorBoundary>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/contact" 
        element={
          <RouteErrorBoundary routeName="Contact">
            <RouteLoader routeName="Contact">
              <LazyContact />
            </RouteLoader>
          </RouteErrorBoundary>
        } 
      />

      <Route 
        path="/privacy" 
        element={
          <RouteErrorBoundary routeName="Privacy">
            <RouteLoader routeName="Privacy">
              <LazyPrivacy />
            </RouteLoader>
          </RouteErrorBoundary>
        } 
      />

      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <RouteErrorBoundary routeName="NotFound">
            <RouteLoader routeName="NotFound">
              <LazyNotFound />
            </RouteLoader>
          </RouteErrorBoundary>
        } 
      />
    </Routes>
  );
};
