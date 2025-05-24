
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoadingState } from "@/components/loading/AuthLoadingState";
import { LandingPageSkeleton } from "@/components/landing/LandingPageSkeleton";
import Index from "@/pages/Index";

export const Landing = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Handle auth state changes
    if (!isLoading) {
      setHasCheckedAuth(true);
      
      if (user) {
        // Small delay before redirect for better UX
        const timer = setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // Always hide skeleton after a reasonable time
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking auth
  if (isLoading && !hasCheckedAuth) {
    return <AuthLoadingState message="Loading..." />;
  }

  // Show welcome message for authenticated users before redirect
  if (user && hasCheckedAuth) {
    return <AuthLoadingState message="Welcome back! Redirecting..." showSpinner={false} />;
  }

  // Show skeleton briefly for perceived performance
  if (showSkeleton && hasCheckedAuth) {
    return <LandingPageSkeleton />;
  }

  // Show landing page for unauthenticated users
  return <Index />;
};
