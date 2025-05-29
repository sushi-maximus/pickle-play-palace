
import { useQuery } from "@tanstack/react-query";
import { adminUtils } from "../utils/adminUtils";
import { useAuth } from "@/contexts/AuthContext";
import { queryKeys } from "@/lib/queryKeys";

interface UseEventAdminStatusProps {
  eventId: string;
  enabled?: boolean;
}

export const useEventAdminStatus = ({ eventId, enabled = true }: UseEventAdminStatusProps) => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.events.adminStatus(eventId, user?.id || ''),
    queryFn: async () => {
      if (!user?.id) {
        return { isAdmin: false };
      }
      
      return await adminUtils.isEventAdmin(user.id, eventId);
    },
    enabled: !!eventId && !!user?.id && enabled
  });

  return {
    isAdmin: data?.isAdmin || false,
    isLoading,
    error: error || data?.error
  };
};
