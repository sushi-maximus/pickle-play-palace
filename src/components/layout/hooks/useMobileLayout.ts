
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UseMobileLayoutProps {
  showProfileHeader: boolean;
  profile?: Profile | null;
}

export const useMobileLayout = ({ showProfileHeader, profile }: UseMobileLayoutProps) => {
  const shouldShowProfileHeader = showProfileHeader && !!profile;
  
  // Since profile header is now scrollable content, we only need standard top padding
  const topPadding = "pt-16"; // Standard padding for fixed page header only
  
  return {
    topPadding,
    shouldShowProfileHeader
  };
};
