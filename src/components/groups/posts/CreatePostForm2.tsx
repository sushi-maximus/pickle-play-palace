
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreatePost2 } from "./hooks/useCreatePost2";
import { Send } from "lucide-react";

interface CreatePostForm2Props {
  groupId: string;
  user: any;
  onPostCreated?: () => void;
  refreshing?: boolean;
}

export const CreatePostForm2 = ({ 
  groupId, 
  user, 
  onPostCreated,
  refreshing = false
}: CreatePostForm2Props) => {
  const {
    content,
    setContent,
    isSubmitting,
    handleSubmit,
  } = useCreatePost2({
    groupId,
    userId: user?.id,
    onPostCreated,
  });

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <form onSubmit={onFormSubmit} className="space-y-3">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar_url || ""} />
            <AvatarFallback>
              {user?.first_name?.substring(0, 1).toUpperCase() || ""}
              {user?.last_name?.substring(0, 1).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[80px] resize-none border-slate-200 focus:border-primary"
              disabled={isSubmitting || refreshing}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting || refreshing}
            className="px-6"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
