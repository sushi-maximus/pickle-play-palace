
import { useAuth } from "@/contexts/AuthContext";
import { CreatePostForm2 } from "../posts/CreatePostForm2";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useEditPost } from "../posts/hooks/useEditPost";
import { useDeletePost } from "../posts/hooks/useDeletePost";
import { PostHeader } from "../posts/post-card/PostHeader";
import { PostContent } from "../posts/post-card/PostContent";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";

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
    return (
      <div className="flex-1 px-4 py-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-12 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-6 relative z-0 overflow-y-auto">
      {/* Post Creation Form at the top */}
      {user && (
        <div className="mb-6">
          <CreatePostForm2
            groupId={groupId}
            user={user}
            onPostCreated={handlePostCreated}
            refreshing={refreshing}
          />
        </div>
      )}
      
      {refreshing && (
        <div className="text-center py-2 mb-4">
          <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isAuthor = user?.id === post.user?.id;
          const isEditingThisPost = isEditing && currentPostId === post.id;

          return (
            <div key={post.id} className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.user?.avatar_url || ""} />
                <AvatarFallback>
                  {post.user?.first_name?.substring(0, 1).toUpperCase() || ""}
                  {post.user?.last_name?.substring(0, 1).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <PostHeader 
                  post={post}
                  isAuthor={isAuthor}
                  isEditing={isEditingThisPost}
                  onStartEditing={() => startEditing(post.id, post.content)}
                  onDeleteClick={() => handleDeleteClick(post.id)}
                />
                
                <div className="mt-1">
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
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DeletePostDialog 
        isOpen={deleteDialogPostId !== null}
        onOpenChange={(open) => !open && setDeleteDialogPostId(null)}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
