
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatePost2 } from "./hooks/useCreatePost2";

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
    <form onSubmit={onFormSubmit} className="flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="flex-1 rounded-full border-gray-300"
        disabled={isSubmitting || refreshing}
      />
      <Button
        type="submit"
        disabled={!content.trim() || isSubmitting || refreshing}
        className="px-6 bg-green-500 hover:bg-green-600 text-white rounded-full"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Post"
        )}
      </Button>
    </form>
  );
};
