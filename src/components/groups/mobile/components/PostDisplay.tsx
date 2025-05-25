
import { PostContent } from "../../posts/post-card/PostContent";
import { MobilePostHeader } from "./MobilePostHeader";
import type { PostData } from "../types/postTypes";
import type { Profile } from "../../posts/hooks/types/groupPostTypes";

interface PostDisplayProps {
  post: PostData;
  currentUserId?: string;
  isEditing: boolean;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isEditSubmitting: boolean;
  onEdit: () => void;
  onDeleteClick: () => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
}

export const PostDisplay = ({
  post,
  currentUserId,
  isEditing,
  editableContent,
  setEditableContent,
  isEditSubmitting,
  onEdit,
  onDeleteClick,
  onCancelEditing,
  onSaveEditing
}: PostDisplayProps) => {
  return (
    <>
      <MobilePostHeader
        post={post}
        currentUserId={currentUserId}
        isEditing={isEditing}
        isDeleting={false}
        onEdit={onEdit}
        onDeleteClick={onDeleteClick}
      />

      <div className="px-6 pb-6">
        <PostContent
          content={post.content}
          mediaUrls={post.media_urls}
          isEditing={isEditing}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          onCancelEditing={onCancelEditing}
          onSaveEditing={onSaveEditing}
          isEditSubmitting={isEditSubmitting}
        />
      </div>
    </>
  );
};
