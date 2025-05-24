
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
  const [authPhase, setAuthPhase] = useState<'checking' | 'verified' | 'complete'>('checking');

  useEffect(() => {
    // Progressive auth loading phases
    if (isLoading) {
      setAuthPhase('checking');
    } else if (user) {
      setAuthPhase('verified');
      // Small delay to show verification state
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } else {
      setAuthPhase('complete');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // Show skeleton briefly for perceived performance
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced loading states based on auth phase
  if (isLoading) {
    if (authPhase === 'checking') {
      return <AuthLoadingState message="Checking authentication..." />;
    }
    if (authPhase === 'verified') {
      return <AuthLoadingState message="Welcome back! Redirecting..." showSpinner={false} />;
    }
  }

  // Show skeleton briefly for perceived performance
  if (showSkeleton && !isLoading) {
    return <LandingPageSkeleton />;
  }

  // Show landing page for unauthenticated users
  return <Index />;
};
