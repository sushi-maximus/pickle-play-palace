
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateEventButtonProps {
  groupId: string;
  isAdmin?: boolean;
}

export const CreateEventButton = ({ groupId, isAdmin = false }: CreateEventButtonProps) => {
  const navigate = useNavigate();

  if (!isAdmin) {
    return null;
  }

  const handleCreateEvent = () => {
    navigate(`/groups/${groupId}/create-event`);
  };

  return (
    <Button
      onClick={handleCreateEvent}
      className="hover-scale min-h-[48px] bg-primary hover:bg-primary/90"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Event
    </Button>
  );
};
