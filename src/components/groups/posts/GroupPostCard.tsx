
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useEditPost } from "./hooks/useEditPost";
import { useDeletePost } from "./hooks/useDeletePost";
import { CommentsSection } from "./CommentsSection";
import { usePostReactions } from "./hooks/usePostReactions";
import { PostHeader } from "./post-card/PostHeader";
import { PostContent } from "./post-card/PostContent";
import { PostReactions } from "./post-card/PostReactions";
import { DeletePostDialog } from "./post-card/DeletePostDialog";
import { PostReactionType } from "./hooks/usePostReactions";

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
    reactions: Record<PostReactionType, number>;
    comments_count?: number;
    user_reactions: Record<PostReactionType, boolean>;
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
  
  // Check if current user is the author
  const isAuthor = currentUserId === post.user.id;
  
  // Post reactions hook
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

  // Edit post functionality
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

  // Delete post functionality
  const {
    isDeleting,
    handleDelete
  } = useDeletePost({ 
    onPostDeleted: () => {
      setIsDeleteDialogOpen(false);
      onPostDeleted?.();
    }
  });

  // Event handlers
  const handleReactionToggle = (type: PostReactionType) => {
    toggleReaction(type);
  };

  const handleStartEditing = () => {
    startEditing(post.id, post.content);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    handleDelete(post.id);
  };

  // Check if this specific post is being edited
  const isEditingThisPost = isEditing && currentPostId === post.id;

  return (
    <Card className="mb-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/30 overflow-visible">
      <CardHeader className="pb-3 overflow-visible">
        <PostHeader 
          post={post}
          isAuthor={isAuthor}
          isEditing={isEditingThisPost}
          onStartEditing={handleStartEditing}
          onDeleteClick={handleDeleteClick}
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
          <div className="w-full flex flex-col space-y-2">
            <div className="w-full flex justify-start">
              <PostReactions 
                reactions={reactions}
                userReactions={userReactions}
                isSubmitting={isSubmitting}
                onReactionToggle={handleReactionToggle}
                currentUserId={currentUserId}
              />
            </div>
            
            <div className="w-[80%] mx-auto bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-inner transition-all">
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
