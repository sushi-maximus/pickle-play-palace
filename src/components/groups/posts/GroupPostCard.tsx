
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEditPost } from "./hooks/useEditPost";
import { useDeletePost } from "./hooks/useDeletePost";
import { CommentsSection } from "./CommentsSection";
import { usePostReactions } from "./hooks/usePostReactions";
import { PostHeader, PostContent, PostReactions, DeletePostDialog } from "./post-card";

interface GroupPostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    media_urls?: string[] | null;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
    reactions: Record<"like" | "thumbsup" | "thumbsdown", number>;
    comments_count?: number;
    user_reactions: Record<"like" | "thumbsup" | "thumbsdown", boolean>;
  };
  currentUserId?: string;
  onPostUpdated?: () => void;
  onPostDeleted?: () => void;
}

export const GroupPostCard = ({ 
  post, 
  currentUserId,
  onPostUpdated,
  onPostDeleted
}: GroupPostCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isAuthor = currentUserId === post.user.id;
  
  const {
    reactions,
    userReactions,
    isSubmitting,
    toggleReaction
  } = usePostReactions({
    postId: post.id,
    userId: currentUserId,
    initialReactions: post.reactions,
    initialUserReactions: post.user_reactions
  });

  const {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting: isEditSubmitting,
    startEditing,
    cancelEditing,
    handleUpdate,
    currentPostId
  } = useEditPost({ onPostUpdated });

  const {
    isDeleting,
    handleDelete
  } = useDeletePost({ 
    onPostDeleted: () => {
      setIsDeleteDialogOpen(false);
      onPostDeleted?.();
    }
  });

  const handleReactionToggle = (type: "like" | "thumbsup" | "thumbsdown") => {
    toggleReaction(type);
  };

  const isEditingThisPost = isEditing && currentPostId === post.id;
  
  const confirmDelete = () => {
    handleDelete(post.id);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <PostHeader 
          post={post}
          isAuthor={isAuthor}
          isEditing={isEditingThisPost}
          onStartEditing={() => startEditing(post.id, post.content)}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
        />
      </CardHeader>
      
      <CardContent>
        <PostContent 
          content={post.content}
          mediaUrls={post.media_urls}
          isEditing={isEditingThisPost}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          onCancelEditing={cancelEditing}
          onSaveEditing={handleUpdate}
          isEditSubmitting={isEditSubmitting}
        />
      </CardContent>
      
      {!isEditingThisPost && (
        <CardFooter className="border-t pt-3 flex flex-col">
          <div className="w-full flex">
            <PostReactions 
              reactions={reactions}
              userReactions={userReactions}
              isSubmitting={isSubmitting}
              onReactionToggle={handleReactionToggle}
              currentUserId={currentUserId}
            />
            
            <div className="ml-auto">
              <CommentsSection 
                postId={post.id}
                userId={currentUserId}
                commentsCount={post.comments_count || 0}
              />
            </div>
          </div>
        </CardFooter>
      )}

      <DeletePostDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
};
