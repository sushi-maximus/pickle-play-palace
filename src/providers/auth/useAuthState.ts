
import { useState, useEffect, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logError, AppError } from "@/utils/errorHandling";

interface UseAuthStateProps {
  onProfileFetch: (userId: string) => void;
  onProfileClear: () => void;
  onLoadingComplete: () => void;
}

export const useAuthState = ({ onProfileFetch, onProfileClear, onLoadingComplete }: UseAuthStateProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    console.log("🚀 AuthProvider initializing...");

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) {
          console.log("⚠️ Component unmounted, ignoring auth state change");
          return;
        }

        console.log("🔔 Auth state changed:", event, "Session exists:", !!session);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile when user authenticates
          if (session?.user) {
            console.log("👤 User authenticated, fetching profile");
            // Use setTimeout to prevent potential deadlock
            setTimeout(() => {
              if (mounted) {
                onProfileFetch(session.user.id);
              }
            }, 0);
          } else {
            console.log("🚪 No user, clearing profile");
            onProfileClear();
          }
        } catch (error) {
          console.error("❌ Error in auth state change handler:", error);
          logError(error as Error, "AuthProvider.authStateChange");
        } finally {
          if (mounted) {
            console.log("✅ Setting isLoading to false (from auth state change)");
            setIsLoading(false);
            onLoadingComplete();
          }
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("🔍 Checking for existing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Error getting session:", error);
          logError(new AppError("Failed to get session", "SESSION_ERROR"), "AuthProvider");
          if (mounted) {
            setIsLoading(false);
            onLoadingComplete();
          }
          return;
        }

        if (!mounted) {
          console.log("⚠️ Component unmounted during session check");
          return;
        }

        console.log("📋 Initial session check result:", !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile for existing session
        if (session?.user) {
          console.log("👤 Initial session found, fetching profile");
          // Use setTimeout to prevent potential deadlock
          setTimeout(() => {
            if (mounted) {
              onProfileFetch(session.user.id);
            }
          }, 0);
        } else {
          console.log("🔓 No initial session found");
        }
      } catch (error) {
        console.error("❌ Error in initializeAuth:", error);
        logError(error as Error, "AuthProvider.initializeAuth");
      } finally {
        // Always set loading to false after initial check, even if there's an error
        if (mounted) {
          console.log("✅ Auth initialization complete, setting isLoading to false");
          setIsLoading(false);
          onLoadingComplete();
        }
      }
    };

    initializeAuth();

    return () => {
      console.log("🧹 AuthProvider cleanup");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [onProfileFetch, onProfileClear, onLoadingComplete]);

  return {
    session,
    user,
    isLoading
  };
};
