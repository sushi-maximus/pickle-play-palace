
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { useCreatePost } from "../posts/hooks/useCreatePost";

interface MobileComposeAreaProps {
  groupId: string;
  user: any;
  onPostCreated?: () => void;
}

export const MobileComposeArea = ({ 
  groupId, 
  user, 
  onPostCreated 
}: MobileComposeAreaProps) => {
  const { content, setContent, isSubmitting, handleSubmit } = useCreatePost({
    groupId,
    userId: user?.id,
    onPostCreated
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCameraClick = () => {
    // TODO: Implement image upload functionality
    console.log("Camera functionality not yet implemented");
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none border-slate-300 rounded-full px-4 py-2"
            rows={1}
            disabled={isSubmitting}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-700"
          onClick={handleCameraClick}
          disabled={isSubmitting}
          aria-label="Add image"
        >
          <Camera className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
