
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LandingPageSkeleton } from "@/components/landing/LandingPageSkeleton";
import Index from "@/pages/Index";

export const Landing = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    // Only redirect after loading is complete and we have a user
    if (!isLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // Show skeleton briefly for perceived performance
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Show skeleton briefly for perceived performance
  if (showSkeleton) {
    return <LandingPageSkeleton />;
  }

  // Show landing page for unauthenticated users
  return <Index />;
};
