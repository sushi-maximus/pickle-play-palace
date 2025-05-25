
import { useState, memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import { useComments2 } from "../posts/hooks/useComments2";
import { PostDisplay } from "./components/PostDisplay";
import { PostInteractions } from "./components/PostInteractions";
import { usePostEditor } from "./hooks/usePostEditor";
import { useUnifiedPostReactions } from "./hooks/useUnifiedPostReactions";
import type { PostData, PostActions } from "./types/postTypes";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface MobilePostCard2Props {
  post: PostData;
  user?: Profile | null;
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

const MobilePostCard2Component = ({ 
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
}: MobilePostCard2Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Memoize the current editing state to avoid unnecessary recalculations
  const isCurrentlyEditing = useMemo(() => 
    isEditing && currentPostId === post.id, 
    [isEditing, currentPostId, post.id]
  );

  const editor = usePostEditor({
    postId: post.id,
    content: post.content,
    isEditing: isCurrentlyEditing,
    isSubmitting: isEditSubmitting,
    onStartEditing,
    onCancelEditing,
    onSaveEditing
  });

  const reactions = useUnifiedPostReactions({ post, user });

  const { comments } = useComments2({
    postId: post.id,
    userId: user?.id
  });

  // Memoize the comments count to avoid recalculation
  const commentsCount = useMemo(() => comments?.length || 0, [comments?.length]);

  // Memoize delete handler to prevent recreation
  const handleDeleteClick = useMemo(() => () => {
    onDeleteClick(post.id);
    setShowDeleteDialog(false);
  }, [onDeleteClick, post.id]);

  // Memoize show delete dialog handler
  const handleShowDeleteDialog = useMemo(() => () => {
    setShowDeleteDialog(true);
  }, []);

  // Create a proper heart click handler
  const handleHeartClick = useMemo(() => () => {
    if (!reactions.isDisabled && !reactions.isHeartSubmitting) {
      reactions.toggleHeart();
    }
  }, [reactions.isDisabled, reactions.isHeartSubmitting, reactions.toggleHeart]);

  return (
    <Card className="w-full bg-white border-0 border-b border-gray-200 shadow-none hover:shadow-none rounded-none">
      <CardContent className="p-0">
        <PostDisplay
          post={post}
          currentUserId={user?.id}
          isEditing={editor.isEditing}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          isEditSubmitting={editor.isSubmitting}
          onEdit={editor.handleStartEditing}
          onDeleteClick={handleShowDeleteDialog}
          onCancelEditing={editor.handleCancelEditing}
          onSaveEditing={editor.handleSaveEditing}
        />

        <PostInteractions
          postId={post.id}
          currentUserId={user?.id}
          user={user}
          commentsCount={commentsCount}
          thumbsUpCount={reactions.thumbsUpCount}
          thumbsDownCount={reactions.thumbsDownCount}
          heartCount={reactions.heartCount}
          isThumbsUpActive={reactions.isThumbsUpActive}
          isThumbsDownActive={reactions.isThumbsDownActive}
          isHeartActive={reactions.isHeartActive}
          isThumbsUpSubmitting={reactions.isThumbsUpSubmitting}
          isThumbsDownSubmitting={reactions.isThumbsDownSubmitting}
          isHeartSubmitting={reactions.isHeartSubmitting}
          onThumbsUpClick={reactions.toggleThumbsUp}
          onThumbsDownClick={reactions.toggleThumbsDown}
          onHeartClick={handleHeartClick}
        />
      </CardContent>
      
      <DeletePostDialog
        isOpen={showDeleteDialog}
        onOpenChange={(open) => !open && setShowDeleteDialog(false)}
        onConfirmDelete={handleDeleteClick}
        isDeleting={false}
      />
    </Card>
  );
};

// Enhanced memoization with more specific comparisons
export const MobilePostCard2 = memo(MobilePostCard2Component, (prevProps, nextProps) => {
  // Check post-specific properties first (most likely to change)
  if (
    prevProps.post.id !== nextProps.post.id ||
    prevProps.post.content !== nextProps.post.content ||
    prevProps.post.created_at !== nextProps.post.created_at
  ) {
    return false;
  }

  // Check editing state
  if (
    prevProps.isEditing !== nextProps.isEditing ||
    prevProps.currentPostId !== nextProps.currentPostId ||
    prevProps.editableContent !== nextProps.editableContent ||
    prevProps.isEditSubmitting !== nextProps.isEditSubmitting
  ) {
    return false;
  }

  // Check user (only check ID to avoid deep object comparison)
  if (prevProps.user?.id !== nextProps.user?.id) {
    return false;
  }

  // All checks passed, component should not re-render
  return true;
});

MobilePostCard2Component.displayName = "MobilePostCard2";
