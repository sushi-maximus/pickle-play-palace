
import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { usePostReactions2 } from "../posts/hooks/usePostReactions2";
import { PostHeader } from "../posts/post-card/PostHeader";
import { PostContent } from "../posts/post-card/PostContent";
import { ThumbsUp2 } from "../posts/post-card/ThumbsUp2";

interface MobilePostCardProps {
  post: any;
  user: any;
  isEditing: boolean;
  currentPostId: string | null;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isEditSubmitting: boolean;
  onStartEditing: (postId: string, content: string) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
  onDeleteClick: (postId: string) => void;
}

export const MobilePostCard = ({
  post,
  user,
  isEditing,
  currentPostId,
  editableContent,
  setEditableContent,
  isEditSubmitting,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onDeleteClick
}: MobilePostCardProps) => {
  const isAuthor = user?.id === post.user?.id;
  const isEditingThisPost = isEditing && currentPostId === post.id;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 border-l-2 md:border-l-4 border-l-primary/30">
      <CardHeader className="p-3 pb-2 md:p-4 md:pb-3">
        <PostHeader 
          post={post}
          isAuthor={isAuthor}
          isEditing={isEditingThisPost}
          onStartEditing={() => onStartEditing(post.id, post.content)}
          onDeleteClick={() => onDeleteClick(post.id)}
        />
      </CardHeader>
      
      <CardContent className="px-3 pb-0 md:px-4">
        <PostContent 
          content={post.content}
          mediaUrls={post.media_urls}
          isEditing={isEditingThisPost}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          onCancelEditing={onCancelEditing}
          onSaveEditing={onSaveEditing}
          isEditSubmitting={isEditSubmitting}
        />
      </CardContent>
      
      {!isEditingThisPost && (
        <CardFooter className="border-t border-gray-100 pt-2 px-3 pb-3 md:pt-3 md:px-4 md:pb-4">
          <div className="w-full ml-12 md:ml-14">
            <PostThumbsUp 
              postId={post.id}
              userId={user?.id}
              initialCount={post.reactions?.thumbsup || 0}
              initialUserReaction={post.user_reactions?.thumbsup || false}
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Helper component to encapsulate thumbs up logic for each post
const PostThumbsUp = ({ 
  postId, 
  userId, 
  initialCount, 
  initialUserReaction 
}: {
  postId: string;
  userId?: string;
  initialCount: number;
  initialUserReaction: boolean;
}) => {
  const { count, isActive, isSubmitting, toggleReaction } = usePostReactions2({
    postId,
    userId,
    initialCount,
    initialUserReaction
  });

  return (
    <ThumbsUp2
      count={count}
      isActive={isActive}
      isSubmitting={isSubmitting}
      onClick={toggleReaction}
      disabled={!userId}
    />
  );
};
