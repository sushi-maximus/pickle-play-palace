
import { MobilePostCard2 } from "./MobilePostCard2";

interface MobilePostsListProps {
  posts: any[];
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

export const MobilePostsList = ({
  posts,
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
}: MobilePostsListProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      {posts.map((post) => (
        <MobilePostCard2
          key={post.id}
          post={post}
          user={user}
          isEditing={isEditing}
          currentPostId={currentPostId}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          isEditSubmitting={isEditSubmitting}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onSaveEditing={onSaveEditing}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};
