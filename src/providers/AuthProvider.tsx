
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
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        logError(new AppError("Failed to fetch user profile", "PROFILE_FETCH_ERROR"), "AuthProvider");
        return;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
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

        console.log("Auth state changed:", event);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile when auth state changes
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
        } catch (error) {
          logError(error as Error, "AuthProvider.authStateChange");
        } finally {
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logError(new AppError("Failed to get session", "SESSION_ERROR"), "AuthProvider");
          setIsLoading(false);
          return;
        }

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile for existing session
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        logError(error as Error, "AuthProvider.initializeAuth");
      } finally {
        if (mounted) {
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
