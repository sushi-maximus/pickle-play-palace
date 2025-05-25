
import { memo } from "react";
import { Card } from "@/components/ui/card";
import { FacebookActionBar } from "./FacebookActionBar";
import { FacebookComments } from "./FacebookComments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useFacebookLike } from "./hooks/useFacebookLike";
import type { GroupPost, Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookPostCardProps {
  post: GroupPost;
  user: Profile | null;
  index: number;
}

const FacebookPostCardComponent = ({ post, user, index }: FacebookPostCardProps) => {
  console.log("FacebookPostCard - Rendering post:", {
    postId: post.id,
    content: post.content?.substring(0, 50),
    userFirstName: post.profiles?.first_name,
    index
  });

  const {
    isLiked,
    isSubmitting,
    isDisabled,
    likeCount,
    toggleLike
  } = useFacebookLike({
    postId: post.id,
    userId: user?.id
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown time";
    }
  };

  const handleCommentClick = () => {
    // Scroll to comments section or focus comment input
    console.log("Comment clicked for post:", post.id);
  };

  return (
    <div className="bg-white border-b border-gray-200 w-full">
      <div className="p-4">
        {/* Post Header */}
        <div className="flex items-start space-x-3 mb-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(post.profiles?.first_name, post.profiles?.last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {post.profiles?.first_name} {post.profiles?.last_name}
              </h3>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatTimeAgo(post.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        {post.content && (
          <div className="mb-4">
            <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>
        )}

        {/* Media Content */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mb-4">
            <div className="grid gap-2">
              {post.media_urls.map((url, mediaIndex) => (
                <img
                  key={`${post.id}-media-${mediaIndex}`}
                  src={url}
                  alt={`Post media ${mediaIndex + 1}`}
                  className="w-full rounded-lg object-cover max-h-96"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Failed to load image:", url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <FacebookActionBar 
          postId={post.id}
          isLiked={isLiked}
          isSubmitting={isSubmitting}
          isDisabled={isDisabled}
          onLikeClick={toggleLike}
          onCommentClick={handleCommentClick}
          user={user}
          likeCount={likeCount}
        />

        {/* Comments Section */}
        <FacebookComments 
          postId={post.id} 
          user={user} 
        />
      </div>
    </div>
  );
};

export const FacebookPostCard = memo(FacebookPostCardComponent);
