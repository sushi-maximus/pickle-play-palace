
import { useState } from "react";
import { CreatePostForm2 } from "../posts/CreatePostForm2";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import { useEditPost } from "../posts/hooks/useEditPost";
import { useDeletePost } from "../posts/hooks/useDeletePost";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import { MobilePostsLoading } from "./MobilePostsLoading";
import { MobilePostsList } from "./MobilePostsList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface MobileHome2TabProps {
  groupId: string;
  user: Profile | null;
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

  const handleRefresh = async () => {
    await refreshPosts();
  };

  if (loading) {
    return <MobilePostsLoading />;
  }

  return (
    <main className="flex-1 px-4 py-6">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          {/* Post Creation Form */}
          {user && (
            <div className="mb-8">
              <CreatePostForm2
                groupId={groupId}
                user={user}
                onPostCreated={handlePostCreated}
                refreshing={refreshing}
              />
            </div>
          )}
          
          {refreshing && (
            <div className="text-center py-4 mb-6">
              <LoadingSpinner size="sm" text="Refreshing posts..." />
            </div>
          )}
          
          {/* Posts Feed */}
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
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          <DeletePostDialog 
            isOpen={deleteDialogPostId !== null}
            onOpenChange={(open) => !open && setDeleteDialogPostId(null)}
            onConfirmDelete={confirmDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </main>
  );
};
