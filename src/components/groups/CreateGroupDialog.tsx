import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CreateGroupForm } from "./forms/CreateGroupForm";
import { createGroup } from "./services";
import { CreateGroupFormValues } from "./schemas/groupSchemas";

interface CreateGroupDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateGroupDialog({ trigger, onSuccess }: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: CreateGroupFormValues) => {
    if (!user) {
      toast.error("You need to be logged in to create a group");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    try {
      const newGroup = await createGroup(values, user.id);
      toast.success("Group created successfully!");
      setOpen(false);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the group page if no callback is provided
        navigate(`/groups/${newGroup.id}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">
            Create Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogDescription>
            Create a group for pickleball players with similar interests or skill levels.
          </DialogDescription>
        </DialogHeader>
        <CreateGroupForm 
          isLoading={isLoading} 
          onCancel={() => setOpen(false)} 
          onSubmit={handleSubmit} 
        />
      </DialogContent>
    </Dialog>
  );
}
