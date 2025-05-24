
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";

interface CreateGroupButtonProps {
  onSuccess: () => Promise<void>;
}

export const CreateGroupButton = ({ onSuccess }: CreateGroupButtonProps) => {
  return (
    <CreateGroupDialog 
      trigger={
        <Button className="hover-scale">
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      }
      onSuccess={onSuccess}
    />
  );
};
