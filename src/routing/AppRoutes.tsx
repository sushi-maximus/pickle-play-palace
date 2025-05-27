
import { Routes, Route } from "react-router-dom";
import { RouteLoader } from "@/components/routing/RouteLoader";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";
import { Landing } from "@/components/routing/Landing";

// Import eager-loaded pages (critical for initial load)
import { Login, Signup } from "@/pages/lazy";

// Import lazy-loaded pages
import { 
  LazyDashboard,
  LazyProfile,
  LazyGroups,
  LazyGroupDetails,
  LazyAdmin,
  LazyContact,
  LazyPrivacy,
  LazyForgotPassword,
  LazyAuthCallback,
  LazyNotFound
} from "@/pages/lazy";

// Import event creation wizard
import { EventCreationWizard } from "@/components/groups/events";

export const AppRoutes = () => {
  return (
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
      <Route path="/groups/:id/create-event" element={
        <ProtectedRoute>
          <RouteLoader routeName="Create Event">
            <EventCreationWizard />
          </RouteLoader>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <RouteLoader routeName="Admin">
            <LazyAdmin />
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
  );
};
