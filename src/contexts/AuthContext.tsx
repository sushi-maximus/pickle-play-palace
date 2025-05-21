
import { createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";

// Define the profile type based on our database schema
type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  gender: string;
  skill_level: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any | null; data: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: any | null; data: any | null }>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  signUp: async () => ({ error: null, data: null }),
  signIn: async () => ({ error: null, data: null }),
  resendVerificationEmail: async () => ({ error: null, data: null }),
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);
