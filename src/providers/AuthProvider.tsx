
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
      console.log("No userId provided to fetchProfile");
      return;
    }
    
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        logError(new AppError("Failed to fetch user profile", "PROFILE_FETCH_ERROR"), "AuthProvider");
        return;
      }
      
      if (data) {
        console.log("Profile fetched successfully:", data);
        setProfile(data);
      } else {
        console.log("No profile data returned");
      }
    } catch (error) {
      console.error("Exception in fetchProfile:", error);
      logError(error as Error, "AuthProvider.fetchProfile");
    }
  }, []);

  // Refresh profile data function
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      try {
        await fetchProfile(user.id);
      } catch (error) {
        logError(error as Error, "AuthProvider.refreshProfile");
        throw new AppError("Failed to refresh profile data");
      }
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log("Auth state changed:", event, "Session exists:", !!session);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile when auth state changes
          if (session?.user) {
            console.log("User authenticated, fetching profile");
            await fetchProfile(session.user.id);
          } else {
            console.log("No user, clearing profile");
            setProfile(null);
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          logError(error as Error, "AuthProvider.authStateChange");
        } finally {
          console.log("Setting isLoading to false");
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          logError(new AppError("Failed to get session", "SESSION_ERROR"), "AuthProvider");
          setIsLoading(false);
          return;
        }

        if (!mounted) return;

        console.log("Initial session check:", !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile for existing session
        if (session?.user) {
          console.log("Initial session found, fetching profile");
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error in initializeAuth:", error);
        logError(error as Error, "AuthProvider.initializeAuth");
      } finally {
        if (mounted) {
          console.log("Auth initialization complete, setting isLoading to false");
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile,
      isLoading, 
      signOut, 
      signUp, 
      signIn,
      resendVerificationEmail,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
