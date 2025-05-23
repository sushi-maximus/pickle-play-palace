
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MoreHorizontal, Edit, X, Check, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEditPost } from "./hooks/useEditPost";
import { useDeletePost } from "./hooks/useDeletePost";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialogTrigger,
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
    reactions_count?: number;
    comments_count?: number;
    user_has_reacted?: boolean;
  };
  currentUserId?: string;
  onReactionToggle?: (postId: string) => void;
  onPostUpdated?: () => void;
  onPostDeleted?: () => void;
}

export const GroupPostCard = ({ 
  post, 
  currentUserId,
  onReactionToggle, 
  onPostUpdated,
  onPostDeleted
}: GroupPostCardProps) => {
  const [isReacted, setIsReacted] = useState(post.user_has_reacted || false);
  const [reactionsCount, setReactionsCount] = useState(post.reactions_count || 0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isAuthor = currentUserId === post.user.id;
  
  const {
    isEditing,
    editableContent,
    setEditableContent,
    isSubmitting,
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

  const handleReactionToggle = () => {
    setIsReacted(!isReacted);
    setReactionsCount(isReacted ? reactionsCount - 1 : reactionsCount + 1);
    onReactionToggle?.(post.id);
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
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={cancelEditing}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpdate}
                disabled={!editableContent.trim() || isSubmitting}
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
        <CardFooter className="border-t pt-3 flex">
          <div className="flex space-x-1 items-center mr-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleReactionToggle}
            >
              <Heart 
                className={`h-4 w-4 ${isReacted ? "fill-red-500 text-red-500" : ""}`}
              />
              <span>{reactionsCount > 0 ? reactionsCount : ''}</span>
            </Button>
          </div>
          
          <div className="flex space-x-1 items-center">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments_count || ''}</span>
            </Button>
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
