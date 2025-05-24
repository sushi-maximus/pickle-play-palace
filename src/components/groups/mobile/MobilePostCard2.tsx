
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Edit, Trash2, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PostContent } from "../posts/post-card/PostContent";
import { PostReactions2 } from "../posts/post-card/PostReactions2";
import { CommentsSection2 } from "../posts/post-card/CommentsSection2";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import { usePostReactions2 } from "../posts/hooks/usePostReactions2";
import { useEditPost } from "../posts/hooks/useEditPost";
import { useDeletePost } from "../posts/hooks/useDeletePost";

interface MobilePostCard2Props {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    media_urls?: string[] | null;
    profiles?: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
  };
  currentUserId?: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  onPostUpdate?: () => void;
}

export const MobilePostCard2 = ({ 
  post, 
  currentUserId, 
  user, 
  onPostUpdate 
}: MobilePostCard2Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(post.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const {
    reactions,
    userReactions,
    isSubmitting: isReactionsSubmitting,
    handleReactionToggle
  } = usePostReactions2(post.id, currentUserId);

  const { editPost, isSubmitting: isEditSubmitting } = useEditPost({
    onSuccess: () => {
      setIsEditing(false);
      onPostUpdate?.();
    }
  });

  const { deletePost, isSubmitting: isDeleteSubmitting } = useDeletePost({
    onSuccess: () => {
      onPostUpdate?.();
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditableContent(post.content);
  };

  const handleSaveEditing = () => {
    if (editableContent.trim() && editableContent !== post.content) {
      editPost({
        postId: post.id,
        content: editableContent.trim()
      });
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditableContent(post.content);
  };

  const handleDelete = () => {
    deletePost(post.id);
    setShowDeleteDialog(false);
  };

  const isOwnPost = currentUserId === post.user_id;
  const profile = post.profiles;
  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown User';
  const initials = profile ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` : 'UU';

  return (
    <Card className="w-full border-0 shadow-sm bg-white rounded-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-start justify-between p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-sm bg-gray-100">{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                {fullName}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          {isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit} disabled={isEditing}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="text-red-600 focus:text-red-600"
                  disabled={isDeleteSubmitting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Content */}
        <div className="px-3 md:px-4 pb-3">
          <PostContent
            content={post.content}
            mediaUrls={post.media_urls}
            isEditing={isEditing}
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            onCancelEditing={handleCancelEditing}
            onSaveEditing={handleSaveEditing}
            isEditSubmitting={isEditSubmitting}
          />
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-t border-gray-100">
          <PostReactions2
            thumbsUpCount={reactions.thumbsup}
            thumbsDownCount={reactions.thumbsdown}
            heartCount={reactions.like}
            isThumbsUpActive={userReactions.thumbsup}
            isThumbsDownActive={userReactions.thumbsdown}
            isHeartActive={userReactions.like}
            isThumbsUpSubmitting={isReactionsSubmitting.thumbsup}
            isThumbsDownSubmitting={isReactionsSubmitting.thumbsdown}
            isHeartSubmitting={isReactionsSubmitting.like}
            onThumbsUpClick={() => handleReactionToggle('thumbsup')}
            onThumbsDownClick={() => handleReactionToggle('thumbsdown')}
            onHeartClick={() => handleReactionToggle('like')}
            disabled={!currentUserId}
          />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-auto px-2 md:h-9 md:px-3 flex items-center gap-1 md:gap-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm font-medium">
              {showComments ? 'Hide' : 'Comments'}
            </span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentsSection2
            postId={post.id}
            currentUserId={currentUserId}
            user={user}
          />
        )}
      </CardContent>
      
      <DeletePostDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isSubmitting={isDeleteSubmitting}
      />
    </Card>
  );
};
