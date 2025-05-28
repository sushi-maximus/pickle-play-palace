
import { memo } from "react";
import { FacebookCommentContent } from "./FacebookCommentContent";
import { FacebookCommentEditForm } from "./FacebookCommentEditForm";
import { FacebookCommentReactions } from "../FacebookCommentReactions";
import type { Profile } from "../../posts/hooks/types/groupPostTypes";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  thumbsup_count: number;
  thumbsdown_count: number;
  user_thumbsup: boolean;
  user_thumbsdown: boolean;
}

interface FacebookCommentBodyProps {
  comment: Comment;
  user?: Profile | null;
  isEditing: boolean;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isEditSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  thumbsUpCount: number;
  thumbsDownCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  onThumbsUpClick: () => void;
  onThumbsDownClick: () => void;
}

const FacebookCommentBodyComponent = ({
  comment,
  user,
  isEditing,
  editableContent,
  setEditableContent,
  isEditSubmitting,
  onSave,
  onCancel,
  onKeyPress,
  thumbsUpCount,
  thumbsDownCount,
  isThumbsUpActive,
  isThumbsDownActive,
  isThumbsUpSubmitting,
  isThumbsDownSubmitting,
  onThumbsUpClick,
  onThumbsDownClick
}: FacebookCommentBodyProps) => {
  // Debug log to verify comment structure
  console.log('FacebookCommentBody comment structure:', {
    id: comment.id,
    user_id: comment.user_id,
    hasUserId: 'user_id' in comment
  });

  return (
    <div className="flex-1 min-w-0 ml-10">
      {isEditing ? (
        <FacebookCommentEditForm
          comment={comment}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          isSubmitting={isEditSubmitting}
          onSave={onSave}
          onCancel={onCancel}
          onKeyPress={onKeyPress}
        />
      ) : (
        <FacebookCommentContent comment={comment} />
      )}
      
      {!isEditing && user && (
        <FacebookCommentReactions
          thumbsUpCount={thumbsUpCount}
          thumbsDownCount={thumbsDownCount}
          isThumbsUpActive={isThumbsUpActive}
          isThumbsDownActive={isThumbsDownActive}
          isThumbsUpSubmitting={isThumbsUpSubmitting}
          isThumbsDownSubmitting={isThumbsDownSubmitting}
          onThumbsUpClick={onThumbsUpClick}
          onThumbsDownClick={onThumbsDownClick}
          disabled={!user?.id}
        />
      )}
    </div>
  );
};

export const FacebookCommentBody = memo(FacebookCommentBodyComponent);
