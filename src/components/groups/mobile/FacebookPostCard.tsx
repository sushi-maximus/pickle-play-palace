
import { memo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Check } from "lucide-react";
import { useFacebookLike } from "./hooks/useFacebookLike";
import { FacebookActionBar } from "./FacebookActionBar";
import { FacebookComments } from "./FacebookComments";
import { FacebookErrorBoundary } from "./FacebookErrorBoundary";
import { FacebookErrorState } from "./FacebookErrorState";
import { useComments2 } from "../posts/hooks/useComments2";
import { useEditPost } from "../posts/hooks/useEditPost";
import { useDeletePost } from "../posts/hooks/useDeletePost";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookPostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    thumbsup_count?: number;
    user_thumbsup?: boolean;
    profiles?: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
  };
  user?: Profile | null;
  onPostUpdated?: () => void;
}

const FacebookPostCardComponent = ({ post, user, onPostUpdated }: FacebookPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [displayContent, setDisplayContent] = useState(post.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Check if current user is the post author
  const isOwnPost = user?.id === post.user_id;
  
  // Better handling of user name display with robust fallbacks
  const firstName = post.profiles?.first_name?.trim() || '';
  const lastName = post.profiles?.last_name?.trim() || '';
  
  let authorName = 'Unknown User';
  if (firstName && lastName) {
    authorName = `${firstName} ${lastName}`;
  } else if (firstName) {
    authorName = firstName;
  } else if (lastName) {
    authorName = lastName;
  }
  
  // Generate initials with better fallback logic
  let authorInitials = 'U';
  if (firstName && lastName) {
    authorInitials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  } else if (firstName) {
    authorInitials = firstName[0].toUpperCase();
  } else if (lastName) {
    authorInitials = lastName[0].toUpperCase();
  }

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
  } = useEditPost({ 
    onPostUpdated: () => {
      // Update the displayed content immediately
      setDisplayContent(editableContent);
      // Call the parent's refresh callback if provided
      onPostUpdated?.();
      console.log("Post updated successfully");
    }
  });

  // Delete post functionality
  const { isDeleting, handleDelete } = useDeletePost({
    onPostDeleted: () => {
      console.log("Post deleted successfully");
      onPostUpdated?.();
    }
  });
  
  const isCurrentlyEditing = isEditing && currentPostId === post.id;
  
  // Validate required data
  if (!post?.id || !post?.content) {
    return (
      <FacebookErrorState
        title="Invalid Post Data"
        description="This post appears to be corrupted or incomplete."
        showRetry={false}
        variant="generic"
      />
    );
  }

  let timeAgo: string;
  try {
    timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    timeAgo = 'Unknown time';
  }
  
  const {
    likeCount,
    isLiked,
    isSubmitting,
    toggleLike,
    isDisabled,
    error: likeError
  } = useFacebookLike({ 
    postId: post.id,
    userId: user?.id,
    initialLikeCount: post.thumbsup_count || 0,
    initialUserLiked: post.user_thumbsup || false
  });

  const { comments, error: commentsError } = useComments2({
    postId: post.id,
    userId: user?.id
  });

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleCommentAdded = () => {
    console.log("Comment added to post:", post.id);
  };

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  const handleEditPost = () => {
    startEditing(post.id, displayContent);
  };

  const handleDeletePost = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await handleDelete(post.id);
    setShowDeleteDialog(false);
  };

  const handleSaveEdit = () => {
    handleUpdate();
  };

  const handleCancelEdit = () => {
    cancelEditing();
  };

  // Show error state if there's a critical error
  if (hasError || (likeError && !isSubmitting)) {
    return (
      <FacebookErrorState
        error={likeError}
        onRetry={handleRetry}
        title="Failed to Load Post"
        description="There was a problem loading this post. Please try again."
      />
    );
  }

  const commentsCount = comments?.length || 0;

  // Convert string error to Error object if needed
  const commentsErrorObject = commentsError ? new Error(commentsError) : null;

  return (
    <FacebookErrorBoundary
      onError={(error) => {
        console.error('Post card error:', error);
        setHasError(true);
      }}
    >
      <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in overflow-hidden mx-3 sm:mx-0 rounded-lg sm:rounded-lg">
        {/* Post Header - Enhanced for mobile with proper touch targets */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={post.profiles?.avatar_url || undefined} alt={authorName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm font-semibold">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer truncate">
                {authorName}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{timeAgo}</div>
            </div>
          </div>
          
          {isOwnPost && !isCurrentlyEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="min-h-[44px] min-w-[44px] p-0 text-gray-400 hover:text-gray-600 touch-manipulation rounded-full hover:bg-gray-100"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-40 bg-white shadow-lg border border-gray-200 z-[9999]"
                sideOffset={8}
              >
                <DropdownMenuItem 
                  onClick={handleEditPost}
                  className="min-h-[48px] flex items-center touch-manipulation cursor-pointer hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeletePost}
                  className="min-h-[48px] flex items-center text-red-600 focus:text-red-600 touch-manipulation cursor-pointer hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Content - Enhanced readability on mobile */}
        <div className="px-4 py-3">
          {isCurrentlyEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full resize-none text-sm sm:text-base"
                rows={3}
                disabled={isEditSubmitting}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelEdit}
                  disabled={isEditSubmitting}
                  className="text-xs sm:text-sm"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  disabled={!editableContent.trim() || isEditSubmitting}
                  className="text-xs sm:text-sm"
                >
                  {isEditSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
              {displayContent}
            </p>
          )}
        </div>

        {/* Facebook Action Bar with counts inline */}
        <FacebookActionBar
          postId={post.id}
          isLiked={isLiked}
          isSubmitting={isSubmitting}
          isDisabled={isDisabled || !!likeError}
          onLikeClick={toggleLike}
          onCommentClick={handleCommentClick}
          user={user}
          likeCount={likeCount}
          commentsCount={commentsCount}
        />

        {/* Comments Section - Enhanced for mobile */}
        {showComments && (
          <div className="animate-fade-in">
            {commentsErrorObject ? (
              <div className="p-4 border-t border-gray-200">
                <FacebookErrorState
                  error={commentsErrorObject}
                  title="Failed to Load Comments"
                  description="Comments couldn't be loaded. Please try again."
                  onRetry={() => window.location.reload()}
                  variant="network"
                />
              </div>
            ) : (
              <FacebookComments
                postId={post.id}
                user={user}
                onCommentAdded={handleCommentAdded}
              />
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeletePostDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </FacebookErrorBoundary>
  );
};

export const FacebookPostCard = memo(FacebookPostCardComponent);
