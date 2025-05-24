
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PostContent } from "../posts/post-card/PostContent";
import { CommentsSection2 } from "../posts/post-card/CommentsSection2";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import { usePostReactions2 } from "../posts/hooks/usePostReactions2";
import { useEditPost } from "../posts/hooks/useEditPost";
import { useDeletePost } from "../posts/hooks/useDeletePost";
import { MobilePostHeader } from "./components/MobilePostHeader";
import { MobilePostActions } from "./components/MobilePostActions";

interface MobilePostCard2Props {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    media_urls?: string[] | null;
    profiles?: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
  };
  currentUserId?: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  onPostUpdate?: () => void;
}

export const MobilePostCard2 = ({ 
  post, 
  currentUserId, 
  user, 
  onPostUpdate 
}: MobilePostCard2Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(post.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const {
    thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    toggleThumbsUp,
    toggleThumbsDown,
    toggleHeart
  } = usePostReactions2({
    postId: post.id,
    userId: currentUserId,
    initialThumbsUp: 0,
    initialThumbsDown: 0,
    initialHeart: 0,
    initialUserThumbsUp: false,
    initialUserThumbsDown: false,
    initialUserHeart: false
  });

  const { 
    startEditing, 
    cancelEditing, 
    handleUpdate, 
    isSubmitting: isEditSubmitting 
  } = useEditPost({
    onPostUpdated: () => {
      setIsEditing(false);
      onPostUpdate?.();
    }
  });

  const { handleDelete, isDeleting } = useDeletePost({
    onPostDeleted: () => {
      onPostUpdate?.();
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditableContent(post.content);
    startEditing(post.id, post.content);
  };

  const handleSaveEditing = () => {
    if (editableContent.trim() && editableContent !== post.content) {
      handleUpdate();
    } else {
      setIsEditing(false);
      cancelEditing();
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditableContent(post.content);
    cancelEditing();
  };

  const handleDeleteClick = () => {
    handleDelete(post.id);
    setShowDeleteDialog(false);
  };

  return (
    <Card className="w-full border-0 shadow-sm bg-white rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <MobilePostHeader
          post={post}
          currentUserId={currentUserId}
          isEditing={isEditing}
          isDeleting={isDeleting}
          onEdit={handleEdit}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />

        <div className="px-3 md:px-4 pb-3">
          <PostContent
            content={post.content}
            mediaUrls={post.media_urls}
            isEditing={isEditing}
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            onCancelEditing={handleCancelEditing}
            onSaveEditing={handleSaveEditing}
            isEditSubmitting={isEditSubmitting}
          />
        </div>

        <MobilePostActions
          thumbsUpCount={thumbsUpCount}
          thumbsDownCount={thumbsDownCount}
          heartCount={heartCount}
          isThumbsUpActive={isThumbsUpActive}
          isThumbsDownActive={isThumbsDownActive}
          isHeartActive={isHeartActive}
          isThumbsUpSubmitting={isThumbsUpSubmitting}
          isThumbsDownSubmitting={isThumbsDownSubmitting}
          isHeartSubmitting={isHeartSubmitting}
          onThumbsUpClick={toggleThumbsUp}
          onThumbsDownClick={toggleThumbsDown}
          onHeartClick={toggleHeart}
          showComments={showComments}
          onToggleComments={() => setShowComments(!showComments)}
          currentUserId={currentUserId}
        />

        {showComments && (
          <CommentsSection2
            postId={post.id}
            currentUserId={currentUserId}
            user={user}
          />
        )}
      </CardContent>
      
      <DeletePostDialog
        isOpen={showDeleteDialog}
        onOpenChange={(open) => !open && setShowDeleteDialog(false)}
        onConfirmDelete={handleDeleteClick}
        isDeleting={isDeleting}
      />
    </Card>
  );
};
