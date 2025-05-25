
import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookCommentFormProps {
  postId: string;
  user: Profile;
  onCommentAdded?: () => void;
}

const FacebookCommentFormComponent = ({ postId, user, onCommentAdded }: FacebookCommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // TODO: Implement comment submission logic
      console.log("Submitting comment:", { postId, content: content.trim() });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContent("");
      onCommentAdded?.();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* User Avatar */}
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      
      {/* Comment Input */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a comment..."
              className="w-full bg-gray-100 border-0 rounded-full px-4 py-2 text-sm placeholder-gray-500 focus:ring-0 focus:outline-none resize-none"
              rows={1}
              style={{ minHeight: '32px' }}
              disabled={isSubmitting}
            />
          </div>
          
          {content.trim() && (
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="sm"
                disabled={isSubmitting || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
              >
                {isSubmitting ? "..." : "Post"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export const FacebookCommentForm = memo(FacebookCommentFormComponent);
