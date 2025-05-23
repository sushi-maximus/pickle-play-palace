
import React from "react";
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

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        await handleSubmit();
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={onFormSubmit}>
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="What's on your mind?"
        className="w-full rounded-full border-gray-300"
        disabled={isSubmitting || refreshing}
      />
    </form>
  );
};
