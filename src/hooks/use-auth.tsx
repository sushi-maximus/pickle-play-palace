
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any | null; data: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
  signUp: async () => ({ error: null, data: null }),
  signIn: async () => ({ error: null, data: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "An error occurred while signing out."
      });
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Signup error",
          description: result.error.message || "An error occurred during signup."
        });
        return { error: result.error, data: null };
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email to confirm your account."
      });
      return { error: null, data: result.data };
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup error",
        description: error.message || "An unexpected error occurred during signup."
      });
      return { error, data: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Login error",
          description: result.error.message || "Invalid login credentials."
        });
        return { error: result.error, data: null };
      }

      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully."
      });
      return { error: null, data: result.data };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: error.message || "An unexpected error occurred during login."
      });
      return { error, data: null };
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut, signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
