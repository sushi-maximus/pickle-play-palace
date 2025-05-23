
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requestToJoinGroup } from "./services/groupService";
import { toast } from "sonner";

interface JoinRequestDialogProps {
  groupId: string;
  groupName: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinRequestDialog = ({
  groupId,
  groupName,
  userId,
  isOpen,
  onClose,
  onSuccess
}: JoinRequestDialogProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!userId) {
      toast.error("You need to be logged in to request to join a group");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { success } = await requestToJoinGroup(userId, groupId, message);
      
      if (success) {
        toast.success(`Request to join ${groupName} sent successfully`);
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to send join request");
      }
    } catch (error) {
      console.error("Error submitting join request:", error);
      toast.error("An error occurred while sending your request");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request to Join {groupName}</DialogTitle>
          <DialogDescription>
            This is a private group. Send a request to the group administrators to join.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <label htmlFor="message" className="text-sm font-medium mb-2 block">
            Message (Optional)
          </label>
          <Textarea
            id="message"
            placeholder="Introduce yourself to the group admins..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
