
import { useState } from "react";
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

export const MobilePostCard2 = ({ 
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

  const editor = usePostEditor({
    postId: post.id,
    content: post.content,
    isEditing: isEditing && currentPostId === post.id,
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

  const handleDeleteClick = () => {
    onDeleteClick(post.id);
    setShowDeleteDialog(false);
  };

  return (
    <Card className="w-full shadow-sm border border-border rounded-lg overflow-hidden bg-white transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <PostDisplay
          post={post}
          currentUserId={user?.id}
          isEditing={editor.isEditing}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          isEditSubmitting={editor.isSubmitting}
          onEdit={editor.handleStartEditing}
          onDeleteClick={() => setShowDeleteDialog(true)}
          onCancelEditing={editor.handleCancelEditing}
          onSaveEditing={editor.handleSaveEditing}
        />

        <PostInteractions
          postId={post.id}
          currentUserId={user?.id}
          user={user}
          commentsCount={comments?.length || 0}
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
          onHeartClick={reactions.handleHeartClick}
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
