
import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { usePostReactions2 } from "../posts/hooks/usePostReactions2";
import { PostHeader } from "../posts/post-card/PostHeader";
import { PostContent } from "../posts/post-card/PostContent";
import { PostReactions2 } from "../posts/post-card/PostReactions2";
import { CommentsSection2 } from "../posts/post-card/CommentsSection2";

interface MobilePostCardProps {
  post: any;
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

export const MobilePostCard = ({
  post,
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
}: MobilePostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const isAuthor = user?.id === post.user?.id;
  const isEditingThisPost = isEditing && currentPostId === post.id;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 border-l-2 md:border-l-4 border-l-primary/30">
      <CardHeader className="p-3 pb-2 md:p-4 md:pb-3">
        <PostHeader 
          post={post}
          isAuthor={isAuthor}
          isEditing={isEditingThisPost}
          onStartEditing={() => onStartEditing(post.id, post.content)}
          onDeleteClick={() => onDeleteClick(post.id)}
        />
      </CardHeader>
      
      <CardContent className="px-3 pb-0 md:px-4">
        <PostContent 
          content={post.content}
          mediaUrls={post.media_urls}
          isEditing={isEditingThisPost}
          editableContent={editableContent}
          setEditableContent={setEditableContent}
          onCancelEditing={onCancelEditing}
          onSaveEditing={onSaveEditing}
          isEditSubmitting={isEditSubmitting}
        />
      </CardContent>
      
      {!isEditingThisPost && (
        <CardFooter className="border-t border-gray-100 pt-2 px-3 pb-3 md:pt-3 md:px-4 md:pb-4">
          <div className="w-full ml-12 md:ml-14">
            <div className="flex items-center gap-2 md:gap-3">
              <PostReactions2Component 
                post={post}
                user={user}
              />
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-auto px-2 md:h-9 md:px-3 flex items-center gap-1 md:gap-2 text-gray-600 hover:text-primary hover:bg-primary/10"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm font-medium">
                  {post.comments_count > 0 ? post.comments_count : ""}
                </span>
              </Button>
            </div>
          </div>
        </CardFooter>
      )}

      {/* Comments Section */}
      {showComments && !isEditingThisPost && (
        <CommentsSection2 postId={post.id} user={user} />
      )}
    </Card>
  );
};

// Helper component to encapsulate reactions logic for each post
const PostReactions2Component = ({ 
  post, 
  user
}: {
  post: any;
  user: any;
}) => {
  // Always call hooks at the top level, never conditionally
  const reactionsHook = usePostReactions2({
    postId: post.id,
    userId: user?.id,
    initialThumbsUp: post.reactions?.thumbsup || 0,
    initialThumbsDown: post.reactions?.thumbsdown || 0,
    initialHeart: post.reactions?.heart || 0,
    initialUserThumbsUp: post.user_reactions?.thumbsup || false,
    initialUserThumbsDown: post.user_reactions?.thumbsdown || false,
    initialUserHeart: post.user_reactions?.heart || false,
  });

  const { 
    thumbsUpCount, 
    thumbsDownCount,
    heartCount,
    isThumbsUpActive, 
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    toggleThumbsUp,
    toggleThumbsDown,
    toggleHeart
  } = reactionsHook;

  return (
    <PostReactions2
      thumbsUpCount={thumbsUpCount}
      thumbsDownCount={thumbsDownCount}
      heartCount={heartCount}
      isThumbsUpActive={isThumbsUpActive}
      isThumbsDownActive={isThumbsDownActive}
      isHeartActive={isHeartActive}
      isThumbsUpSubmitting={isThumbsUpSubmitting}
      isThumbsDownSubmitting={isThumbsDownSubmitting}
      isHeartSubmitting={isHeartSubmitting}
      onThumbsUpClick={toggleThumbsUp}
      onThumbsDownClick={toggleThumbsDown}
      onHeartClick={toggleHeart}
      disabled={!user?.id}
    />
  );
};
