
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any | null; data: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: any | null; data: any | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
  signUp: async () => ({ error: null, data: null }),
  signIn: async () => ({ error: null, data: null }),
  resendVerificationEmail: async () => ({ error: null, data: null }),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
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
      toast.success("Signed out", {
        description: "You have been signed out successfully."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out", {
        description: "An error occurred while signing out."
      });
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      // Log the metadata being sent to Supabase for debugging purposes
      console.log("Signup metadata being sent:", {
        email,
        firstName: metadata.firstName,
        lastName: metadata.lastName,
        gender: metadata.gender,
        skillLevel: metadata.skillLevel
      });
      
      // Verify that all required fields are present in the metadata
      if (!metadata.firstName || !metadata.lastName || !metadata.gender || !metadata.skillLevel) {
        console.warn("Missing metadata fields:", {
          hasFirstName: !!metadata.firstName,
          hasLastName: !!metadata.lastName,
          hasGender: !!metadata.gender,
          hasSkillLevel: !!metadata.skillLevel
        });
      }
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (result.error) {
        console.error("Signup error details:", result.error);
        toast.error("Signup error", {
          description: result.error.message || "An error occurred during signup."
        });
        return { error: result.error, data: null };
      }

      // Check if user was actually created
      if (!result.data?.user) {
        console.error("User not created. Response:", result);
        toast.error("Signup failed", {
          description: "User account could not be created. Please try again."
        });
        return { error: { message: "User not created" }, data: null };
      }

      console.log("Signup successful. User data:", result.data.user);
      
      // Check if profile was created
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', result.data.user.id)
          .single();
        
        if (profileError) {
          console.error("Error checking for profile:", profileError);
        } else if (!profile) {
          console.warn("Profile not found for user after signup:", result.data.user.id);
        } else {
          console.log("Profile successfully created:", profile);
        }
      } catch (profileCheckError) {
        console.error("Exception checking profile:", profileCheckError);
      }
      
      toast.success("Account created", {
        description: "Please check your email to confirm your account before logging in.",
        duration: Infinity  // Make this toast persist until manually closed
      });
      return { error: null, data: result.data };
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      toast.error("Signup error", {
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
        if (result.error.message.includes("Email not confirmed")) {
          toast.error("Email not verified", {
            description: "Please check your inbox and verify your email before logging in."
          });
        } else {
          toast.error("Login error", {
            description: result.error.message || "Invalid login credentials."
          });
        }
        return { error: result.error, data: null };
      }

      toast.success("Welcome back!", {
        description: "You have been logged in successfully."
      });
      return { error: null, data: result.data };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast.error("Login error", {
        description: error.message || "An unexpected error occurred during login."
      });
      return { error, data: null };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      
      if (result.error) {
        toast.error("Error sending verification email", {
          description: result.error.message || "Failed to send verification email."
        });
        return { error: result.error, data: null };
      }
      
      toast.success("Email sent", {
        description: "If an account exists with this email, a new verification link has been sent.",
        duration: Infinity  // Make this toast persist until manually closed
      });
      return { error: null, data: result.data };
    } catch (error: any) {
      console.error("Error resending verification email:", error);
      toast.error("Error sending verification email", {
        description: error.message || "An unexpected error occurred."
      });
      return { error, data: null };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      signOut, 
      signUp, 
      signIn,
      resendVerificationEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
