
import { createContext, useContext } from "react";
import type { AuthContextType } from "@/providers/auth/types";

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
