
import { useState } from "react";
import { CreatePostForm2 } from "../posts/CreatePostForm2";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import { useEditPost } from "../posts/hooks/useEditPost";
import { useDeletePost } from "../posts/hooks/useDeletePost";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import { MobilePostsLoading } from "./MobilePostsLoading";
import { MobilePostsList } from "./MobilePostsList";

interface MobileHome2TabProps {
  groupId: string;
  user: any;
  onPostCreated?: () => void;
}

export const MobileHome2Tab = ({ 
  groupId, 
  user, 
  onPostCreated 
}: MobileHome2TabProps) => {
  const [deleteDialogPostId, setDeleteDialogPostId] = useState<string | null>(null);

  const { 
    posts, 
    loading, 
    refreshing,
    refreshPosts 
  } = useGroupPosts({ 
    groupId, 
    userId: user?.id 
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
  } = useEditPost({ onPostUpdated: refreshPosts });

  // Delete post functionality
  const {
    isDeleting,
    handleDelete
  } = useDeletePost({ 
    onPostDeleted: () => {
      setDeleteDialogPostId(null);
      refreshPosts();
    }
  });

  const handlePostCreated = () => {
    refreshPosts();
    onPostCreated?.();
  };

  const handleDeleteClick = (postId: string) => {
    setDeleteDialogPostId(postId);
  };

  const confirmDelete = () => {
    if (deleteDialogPostId) {
      handleDelete(deleteDialogPostId);
    }
  };

  if (loading) {
    return <MobilePostsLoading />;
  }

  return (
    <div className="flex-1 px-3 py-4 md:px-6 md:py-8 relative z-0 overflow-y-auto">
      {/* Post Creation Form - mobile first responsive */}
      {user && (
        <div className="mb-4 md:mb-6">
          <CreatePostForm2
            groupId={groupId}
            user={user}
            onPostCreated={handlePostCreated}
            refreshing={refreshing}
          />
        </div>
      )}
      
      {refreshing && (
        <div className="text-center py-1 md:py-2 mb-3 md:mb-4">
          <div className="inline-block w-3 h-3 md:w-4 md:h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Posts Feed - mobile first responsive */}
      <MobilePostsList
        posts={posts}
        user={user}
        isEditing={isEditing}
        currentPostId={currentPostId}
        editableContent={editableContent}
        setEditableContent={setEditableContent}
        isEditSubmitting={isEditSubmitting}
        onStartEditing={startEditing}
        onCancelEditing={cancelEditing}
        onSaveEditing={handleUpdate}
        onDeleteClick={handleDeleteClick}
      />

      <DeletePostDialog 
        isOpen={deleteDialogPostId !== null}
        onOpenChange={(open) => !open && setDeleteDialogPostId(null)}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
