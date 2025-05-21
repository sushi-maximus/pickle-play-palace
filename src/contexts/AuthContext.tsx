
import { createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any | null; data: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: any | null; data: any | null }>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
  signUp: async () => ({ error: null, data: null }),
  signIn: async () => ({ error: null, data: null }),
  resendVerificationEmail: async () => ({ error: null, data: null }),
});

export const useAuth = () => useContext(AuthContext);
