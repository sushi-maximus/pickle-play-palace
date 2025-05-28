
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus, Clock, Users } from "lucide-react";
import { useEventRegistration } from "../hooks/useEventRegistration";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "@/lib/queryKeys";

interface EventRegistrationButtonProps {
  eventId: string;
  playerId: string | null;
  groupId: string;
  isRegistrationOpen: boolean;
  className?: string;
}

export const EventRegistrationButton = ({ 
  eventId, 
  playerId, 
  groupId,
  isRegistrationOpen,
  className = ""
}: EventRegistrationButtonProps) => {
  const {
    registration,
    isLoadingRegistration,
    isRegistering,
    handleRegister,
    handleCancel,
    registrationStatus
  } = useEventRegistration({ eventId, playerId });

  // Check if user is a group member
  const { data: groupMembership, isLoading: isLoadingMembership } = useQuery({
    queryKey: queryKeys.groups.member(groupId, playerId || ''),
    queryFn: async () => {
      if (!playerId) return null;
      
      const { data, error } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', playerId)
        .eq('status', 'active')
        .eq('role', 'member')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!playerId && !!groupId
  });

  if (!playerId) {
    return (
      <Button variant="secondary" disabled className={className}>
        <Users className="h-4 w-4 mr-2" />
        Login to Register
      </Button>
    );
  }

  if (isLoadingMembership || isLoadingRegistration) {
    return (
      <Button variant="secondary" disabled className={className}>
        Loading...
      </Button>
    );
  }

  if (!groupMembership) {
    return (
      <Button variant="secondary" disabled className={className}>
        <Users className="h-4 w-4 mr-2" />
        Join Group First
      </Button>
    );
  }

  if (!isRegistrationOpen) {
    return (
      <Button variant="secondary" disabled className={className}>
        Registration Closed
      </Button>
    );
  }

  if (registration) {
    return (
      <Button
        variant="destructive"
        onClick={handleCancel}
        disabled={isRegistering}
        className={className}
      >
        <UserMinus className="h-4 w-4 mr-2" />
        {isRegistering ? 'Cancelling...' : 
         registrationStatus === 'confirmed' ? 'Cancel Registration' : 
         registrationStatus === 'waitlist' ? 'Leave Waitlist' : 
         'Cancel'}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={isRegistering}
      className={className}
    >
      {registrationStatus === 'waitlist' ? (
        <Clock className="h-4 w-4 mr-2" />
      ) : (
        <UserCheck className="h-4 w-4 mr-2" />
      )}
      {isRegistering ? 'Registering...' : 'Register'}
    </Button>
  );
};
