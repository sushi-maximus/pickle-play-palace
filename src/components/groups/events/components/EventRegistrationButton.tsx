
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus, Clock, Users } from "lucide-react";
import { useEventRegistration } from "../hooks/useEventRegistration";

interface EventRegistrationButtonProps {
  eventId: string;
  playerId: string | null;
  isRegistrationOpen: boolean;
  className?: string;
}

export const EventRegistrationButton = ({ 
  eventId, 
  playerId, 
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

  if (!playerId) {
    return (
      <Button variant="secondary" disabled className={className}>
        <Users className="h-4 w-4 mr-2" />
        Login to Register
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

  if (isLoadingRegistration) {
    return (
      <Button variant="secondary" disabled className={className}>
        Loading...
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
