
import { useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logError, AppError } from "@/utils/errorHandling";
import type { Profile } from "./types";

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  // Function to fetch user profile data with enhanced error handling
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
      
      // Show user-friendly error for network issues
      if (error instanceof Error && error.message.includes('network')) {
        toast.error("Unable to load profile. Please check your internet connection.");
      }
    }
  }, []);

  // Refresh profile data function with error boundary protection
  const refreshProfile = useCallback(async (user: User | null) => {
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
  }, [fetchProfile]);

  return {
    profile,
    setProfile,
    fetchProfile,
    refreshProfile
  };
};
