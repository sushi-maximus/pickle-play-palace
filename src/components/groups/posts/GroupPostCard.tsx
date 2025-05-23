
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, MoreHorizontal, Edit, X, Check, Trash, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEditPost } from "./hooks/useEditPost";
import { useDeletePost } from "./hooks/useDeletePost";
import { Textarea } from "@/components/ui/textarea";
import { CommentsSection } from "./CommentsSection";
import { usePostReactions, PostReactionType } from "./hooks/usePostReactions";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GroupPostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    media_urls?: string[] | null;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
    reactions: Record<PostReactionType, number>;
    comments_count?: number;
    user_reactions: Record<PostReactionType, boolean>;
  };
  currentUserId?: string;
  onPostUpdated?: () => void;
  onPostDeleted?: () => void;
}

export const GroupPostCard = ({ 
  post, 
  currentUserId,
  onPostUpdated,
  onPostDeleted
}: GroupPostCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isAuthor = currentUserId === post.user.id;
  
  const {
    reactions,
    userReactions,
    isSubmitting,
    toggleReaction
  } = usePostReactions({
    postId: post.id,
    userId: currentUserId,
    initialReactions: post.reactions,
    initialUserReactions: post.user_reactions
  });

  const {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting: isEditSubmitting,
    startEditing,
    cancelEditing,
    handleUpdate,
    currentPostId
  } = useEditPost({ onPostUpdated });

  const {
    isDeleting,
    handleDelete
  } = useDeletePost({ 
    onPostDeleted: () => {
      setIsDeleteDialogOpen(false);
      onPostDeleted?.();
    }
  });

  const handleReactionToggle = (type: PostReactionType) => {
    toggleReaction(type);
  };

  const isEditingThisPost = isEditing && currentPostId === post.id;
  
  const confirmDelete = () => {
    handleDelete(post.id);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {post.user.avatar_url ? (
                <AvatarImage src={post.user.avatar_url} alt={`${post.user.first_name} ${post.user.last_name}`} />
              ) : (
                <AvatarFallback>
                  {post.user.first_name?.[0] || '?'}
                  {post.user.last_name?.[0] || '?'}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{`${post.user.first_name} ${post.user.last_name}`}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                {post.created_at !== post.updated_at && 
                  <span className="ml-1">(edited)</span>
                }
              </p>
            </div>
          </div>
          
          {isAuthor && !isEditingThisPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => startEditing(post.id, post.content)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditingThisPost ? (
          <div className="space-y-2">
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full resize-none"
              rows={3}
              disabled={isEditSubmitting}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={cancelEditing}
                disabled={isEditSubmitting}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpdate}
                disabled={!editableContent.trim() || isEditSubmitting}
              >
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-line">{post.content}</p>
            
            {post.media_urls && post.media_urls.length > 0 && (
              <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2">
                {post.media_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post attachment ${index + 1}`}
                    className="rounded-md w-full object-cover"
                    style={{ maxHeight: "300px" }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {!isEditingThisPost && (
        <CardFooter className="border-t pt-3 flex flex-col">
          <div className="w-full flex gap-4">
            {/* Like button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${userReactions.like ? "text-red-500" : ""}`}
              onClick={() => handleReactionToggle("like")}
              disabled={!currentUserId || isSubmitting.like}
            >
              <Heart 
                className={`h-4 w-4 ${userReactions.like ? "fill-red-500 text-red-500" : ""}`}
              />
              <span>{reactions.like > 0 ? reactions.like : ''}</span>
            </Button>
            
            {/* Thumbs Up button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${userReactions.thumbsup ? "text-blue-500" : ""}`}
              onClick={() => handleReactionToggle("thumbsup")}
              disabled={!currentUserId || isSubmitting.thumbsup}
            >
              <ThumbsUp 
                className={`h-4 w-4 ${userReactions.thumbsup ? "fill-blue-500 text-blue-500" : ""}`}
              />
              <span>{reactions.thumbsup > 0 ? reactions.thumbsup : ''}</span>
            </Button>
            
            {/* Thumbs Down button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${userReactions.thumbsdown ? "text-red-500" : ""}`}
              onClick={() => handleReactionToggle("thumbsdown")}
              disabled={!currentUserId || isSubmitting.thumbsdown}
            >
              <ThumbsDown 
                className={`h-4 w-4 ${userReactions.thumbsdown ? "fill-red-500 text-red-500" : ""}`}
              />
              <span>{reactions.thumbsdown > 0 ? reactions.thumbsdown : ''}</span>
            </Button>
            
            {/* Comments section */}
            <CommentsSection 
              postId={post.id}
              userId={currentUserId}
              commentsCount={post.comments_count || 0}
            />
          </div>
        </CardFooter>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and remove it from the group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
