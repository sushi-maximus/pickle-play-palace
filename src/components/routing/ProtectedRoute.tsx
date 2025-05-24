
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoadingState } from "@/components/loading/AuthLoadingState";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Enhanced loading state while checking authentication
  if (isLoading) {
    return <AuthLoadingState message="Verifying access..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
