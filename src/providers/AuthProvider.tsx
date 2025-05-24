
import { useState, useEffect, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { signIn, signUp, signOut, resendVerificationEmail } from "@/utils/auth-utils";
import { toast } from "@/hooks/use-toast";
import { logError, AppError } from "@/utils/errorHandling";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile data
  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
      console.log("❌ No userId provided to fetchProfile");
      return;
    }
    
    try {
      console.log("🔍 Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching profile:", error);
        // Don't throw error for missing profile - user might not have one yet
        if (error.code === 'PGRST116') {
          console.log("ℹ️ No profile found for user, this is normal for new users");
          setProfile(null);
          return;
        }
        logError(new AppError("Failed to fetch user profile", "PROFILE_FETCH_ERROR"), "AuthProvider");
        return;
      }
      
      if (data) {
        console.log("✅ Profile fetched successfully:", data);
        setProfile(data);
      } else {
        console.log("ℹ️ No profile data returned");
        setProfile(null);
      }
    } catch (error) {
      console.error("❌ Exception in fetchProfile:", error);
      logError(error as Error, "AuthProvider.fetchProfile");
      setProfile(null);
    }
  }, []);

  // Refresh profile data function
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      try {
        console.log("🔄 Refreshing profile for user:", user.id);
        await fetchProfile(user.id);
      } catch (error) {
        logError(error as Error, "AuthProvider.refreshProfile");
        throw new AppError("Failed to refresh profile data");
      }
    } else {
      console.log("❌ Cannot refresh profile - no user ID");
    }
  }, [user, fetchProfile]);

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
                fetchProfile(session.user.id);
              }
            }, 0);
          } else {
            console.log("🚪 No user, clearing profile");
            setProfile(null);
          }
        } catch (error) {
          console.error("❌ Error in auth state change handler:", error);
          logError(error as Error, "AuthProvider.authStateChange");
        } finally {
          if (mounted) {
            console.log("✅ Setting isLoading to false (from auth state change)");
            setIsLoading(false);
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
              fetchProfile(session.user.id);
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
        }
      }
    };

    initializeAuth();

    return () => {
      console.log("🧹 AuthProvider cleanup");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const contextValue = {
    session, 
    user, 
    profile,
    isLoading, 
    signOut, 
    signUp, 
    signIn,
    resendVerificationEmail,
    refreshProfile 
  };

  console.log("🎯 AuthProvider render - isLoading:", isLoading, "user:", !!user, "profile:", !!profile);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
