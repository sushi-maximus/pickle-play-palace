
import { ReactNode, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { signIn, signUp, signOut, resendVerificationEmail } from "@/utils/auth-utils";
import { DataFetchErrorBoundary } from "@/components/error-boundaries";
import { useAuthState } from "./auth/useAuthState";
import { useProfileManager } from "./auth/useProfileManager";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { profile, setProfile, fetchProfile, refreshProfile } = useProfileManager();

  const handleProfileFetch = useCallback((userId: string) => {
    fetchProfile(userId);
  }, [fetchProfile]);

  const handleProfileClear = useCallback(() => {
    setProfile(null);
  }, [setProfile]);

  const handleLoadingComplete = useCallback(() => {
    // This callback can be used for any additional logic when loading completes
  }, []);

  const { session, user, isLoading } = useAuthState({
    onProfileFetch: handleProfileFetch,
    onProfileClear: handleProfileClear,
    onLoadingComplete: handleLoadingComplete
  });

  const handleRefreshProfile = useCallback(async () => {
    await refreshProfile(user);
  }, [refreshProfile, user]);

  const contextValue = {
    session, 
    user, 
    profile,
    loading: isLoading,
    isLoading, 
    signOut, 
    signUp, 
    signIn,
    resendVerificationEmail,
    refreshProfile: handleRefreshProfile
  };

  console.log("🎯 AuthProvider render - isLoading:", isLoading, "user:", !!user, "profile:", !!profile);

  return (
    <AuthContext.Provider value={contextValue}>
      <DataFetchErrorBoundary componentName="Authentication" onRetry={handleRefreshProfile}>
        {children}
      </DataFetchErrorBoundary>
    </AuthContext.Provider>
  );
};
