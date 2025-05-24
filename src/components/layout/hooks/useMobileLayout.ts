
import { useMemo } from "react";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UseMobileLayoutProps {
  showProfileHeader: boolean;
  profile: Profile | null;
}

export const useMobileLayout = ({ showProfileHeader, profile }: UseMobileLayoutProps) => {
  // Calculate top padding based on whether profile header is shown
  const topPadding = useMemo(() => {
    return showProfileHeader && profile ? 'pt-48' : 'pt-16';
  }, [showProfileHeader, profile]);

  const shouldShowProfileHeader = useMemo(() => {
    return showProfileHeader && profile;
  }, [showProfileHeader, profile]);

  return {
    topPadding,
    shouldShowProfileHeader
  };
};
