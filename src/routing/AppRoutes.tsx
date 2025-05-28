
import { Routes, Route } from "react-router-dom";
import { RouteLoader } from "@/components/routing/RouteLoader";
import { RouteErrorBoundary } from "@/components/error-boundaries/RouteErrorBoundary";
import {
  LazyIndex,
  LazyLogin,
  LazySignup,
  LazyDashboard,
  LazyProfile,
  LazyGroups,
  LazyGroupDetails,
  LazyAdmin,
  LazyContact,
  LazyPrivacy,
  LazyForgotPassword,
  LazyAuthCallback,
  LazyNotFound,
  LazyEventDetailsPage
} from "@/pages/lazy";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { PublicRoute } from "@/components/routing/PublicRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LazyIndex />} />
      <Route path="/contact" element={<LazyContact />} />
      <Route path="/privacy" element={<LazyPrivacy />} />
      
      {/* Auth Routes - only accessible when not logged in */}
      <Route path="/login" element={
        <PublicRoute>
          <LazyLogin />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <LazySignup />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <LazyForgotPassword />
        </PublicRoute>
      } />
      <Route path="/auth/callback" element={<LazyAuthCallback />} />

      {/* Protected Routes - require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RouteLoader routeName="dashboard">
            <RouteErrorBoundary>
              <LazyDashboard />
            </RouteErrorBoundary>
          </RouteLoader>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <RouteLoader routeName="profile">
            <RouteErrorBoundary>
              <LazyProfile />
            </RouteErrorBoundary>
          </RouteLoader>
        </ProtectedRoute>
      } />

      <Route path="/groups" element={
        <ProtectedRoute>
          <RouteLoader routeName="groups">
            <RouteErrorBoundary>
              <LazyGroups />
            </RouteErrorBoundary>
          </RouteLoader>
        </ProtectedRoute>
      } />

      <Route path="/groups/:id" element={
        <ProtectedRoute>
          <RouteLoader routeName="group-details">
            <RouteErrorBoundary>
              <LazyGroupDetails />
            </RouteErrorBoundary>
          </RouteLoader>
        </ProtectedRoute>
      } />

      <Route path="/groups/:groupId/events/:eventId" element={
        <ProtectedRoute>
          <RouteLoader routeName="event-details">
            <RouteErrorBoundary>
              <LazyEventDetailsPage />
            </RouteErrorBoundary>
          </RouteLoader>
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute>
          <RouteLoader routeName="admin">
            <RouteErrorBoundary>
              <LazyAdmin />
            </RouteErrorBoundary>
          </RouteLoader>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<LazyNotFound />} />
    </Routes>
  );
};
