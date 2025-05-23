
import { useAuth } from "@/contexts/AuthContext";
import { CreatePostForm2 } from "../posts/CreatePostForm2";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useEditPost } from "../posts/hooks/useEditPost";
import { useDeletePost } from "../posts/hooks/useDeletePost";
import { usePostReactions } from "../posts/hooks/usePostReactions";
import { PostHeader } from "../posts/post-card/PostHeader";
import { PostContent } from "../posts/post-card/PostContent";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import { PostReactions2 } from "../posts/post-card/PostReactions2";
import { CommentsSection2 } from "../posts/post-card/CommentsSection2";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

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
      <div className="flex-1 px-3 py-4 md:px-6 md:py-8">
        <div className="space-y-3 md:space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-2 md:gap-3 animate-pulse">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 md:h-4 bg-slate-200 rounded w-1/3 mb-1 md:mb-2"></div>
                <div className="h-10 md:h-12 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
      <div className="space-y-3 md:space-y-4">
        {posts.map((post) => {
          const isAuthor = user?.id === post.user?.id;
          const isEditingThisPost = isEditing && currentPostId === post.id;

          // Use the post reactions hook for each post
          const {
            reactions,
            userReactions,
            isSubmitting,
            toggleReaction
          } = usePostReactions({
            postId: post.id,
            userId: user?.id,
            initialReactions: post.reactions || { like: 0, thumbsup: 0, thumbsdown: 0 },
            initialUserReactions: post.user_reactions || { like: false, thumbsup: false, thumbsdown: false }
          });

          return (
            <Card key={post.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 border-l-2 md:border-l-4 border-l-primary/30">
              <CardHeader className="p-3 pb-2 md:p-4 md:pb-3">
                <PostHeader 
                  post={post}
                  isAuthor={isAuthor}
                  isEditing={isEditingThisPost}
                  onStartEditing={() => startEditing(post.id, post.content)}
                  onDeleteClick={() => handleDeleteClick(post.id)}
                />
              </CardHeader>
              
              <CardContent className="px-3 pb-0 md:px-4">
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
                <CardFooter className="border-t border-gray-100 pt-2 px-3 pb-3 md:pt-3 md:px-4 md:pb-4 flex flex-col">
                  <div className="w-full flex flex-col space-y-2">
                    <div className="w-full flex justify-between items-center">
                      <PostReactions2
                        reactions={reactions}
                        userReactions={userReactions}
                        isSubmitting={isSubmitting}
                        onReactionToggle={toggleReaction}
                        currentUserId={user?.id}
                      />
                      <CommentsSection2
                        commentsCount={post.comments_count || 0}
                      />
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
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
