
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost2 } from "../posts/hooks/useCreatePost2";

interface MobileHome2TabProps {
  groupId: string;
  user: any;
  onPostCreated?: () => void;
}

export const MobileHome2Tab = ({ 
  groupId, 
  user, 
  onPostCreated 
}: MobileHome2TabProps) => {
  const { content, setContent, isSubmitting, handleSubmit } = useCreatePost2({
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

  return (
    <div className="flex-1 px-4 py-6 relative z-0">
      {/* Add Post Text Box */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex-1 mb-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[80px] resize-none border-slate-300 rounded-lg"
            rows={3}
            disabled={isSubmitting}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={() => handleSubmit()}
            disabled={isSubmitting || !content.trim()}
            size="sm"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};
