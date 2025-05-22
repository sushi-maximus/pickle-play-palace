
import { useState, useEffect, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { signIn, signOut, signUp, resendVerificationEmail } from "@/utils/auth-utils";
import { toast } from "@/components/ui/use-toast";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
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
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    }
  }, []);

  // Refresh profile data function
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when auth state changes
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch profile for existing session
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
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
