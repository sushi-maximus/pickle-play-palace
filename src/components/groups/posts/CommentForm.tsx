
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddComment } from "./hooks/useAddComment";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface CommentFormProps {
  postId: string;
  userId: string;
  onCommentAdded: () => void;
  addOptimisticComment?: (comment: any) => string;
}

export const CommentForm = ({ postId, userId, onCommentAdded, addOptimisticComment }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    let optimisticId;
    if (addOptimisticComment) {
      optimisticId = addOptimisticComment({
        content: content.trim(),
        post_id: postId,
        user_id: userId
      });
    }
    
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          content: content.trim(),
          post_id: postId,
          user_id: userId
        });
        
      if (error) {
        throw error;
      }
      
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);
      // If there was an error and we added an optimistic update, we should remove it
      if (optimisticId && addOptimisticComment) {
        // Ideally we'd call removeOptimisticComment here, but for simplicity,
        // we'll just refresh comments via onCommentAdded which will get the correct state
        onCommentAdded();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] text-sm"
        disabled={isSubmitting}
      />
      <div className="mt-2 flex justify-end">
        <Button 
          type="submit" 
          size="sm"
          disabled={!content.trim() || isSubmitting}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          {isSubmitting ? "Posting..." : "Comment"}
        </Button>
      </div>
    </form>
  );
};

// Import supabase at the top
import { supabase } from "@/integrations/supabase/client";
