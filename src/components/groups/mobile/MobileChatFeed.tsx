
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { GroupPost } from "../posts/hooks/types/groupPostTypes";
import { formatDistanceToNow } from "date-fns";
import { usePostReactions } from "../posts/hooks/usePostReactions";
import { CommentsSection } from "../posts/CommentsSection";
import { useState } from "react";

interface MobileChatFeedProps {
  posts: GroupPost[];
  loading: boolean;
  refreshing: boolean;
  currentUserId?: string;
}

export const MobileChatFeed = ({ 
  posts, 
  loading, 
  refreshing,
  currentUserId 
}: MobileChatFeedProps) => {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

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

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto">
      {refreshing && (
        <div className="text-center py-2">
          <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="space-y-6">
        {posts.map((post) => {
          const PostReactionsComponent = ({ post }: { post: GroupPost }) => {
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

            return (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-0 h-auto text-slate-500 hover:text-red-500 ${userReactions.like ? "text-red-500" : ""}`}
                  onClick={() => toggleReaction("like")}
                  disabled={!currentUserId || isSubmitting.like}
                >
                  <Heart className={`h-4 w-4 mr-1 ${userReactions.like ? "fill-red-500" : ""}`} />
                  <span className="text-xs">{reactions.like || 0}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-0 h-auto text-slate-500 hover:text-blue-500 ${userReactions.thumbsup ? "text-blue-500" : ""}`}
                  onClick={() => toggleReaction("thumbsup")}
                  disabled={!currentUserId || isSubmitting.thumbsup}
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${userReactions.thumbsup ? "fill-blue-500" : ""}`} />
                  <span className="text-xs">{reactions.thumbsup || 0}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-0 h-auto text-slate-500 hover:text-red-500 ${userReactions.thumbsdown ? "text-red-500" : ""}`}
                  onClick={() => toggleReaction("thumbsdown")}
                  disabled={!currentUserId || isSubmitting.thumbsdown}
                >
                  <ThumbsDown className={`h-4 w-4 mr-1 ${userReactions.thumbsdown ? "fill-red-500" : ""}`} />
                  <span className="text-xs">{reactions.thumbsdown || 0}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-slate-500 hover:text-blue-500"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    {post.comments_count || 0} comments
                  </span>
                </Button>
              </div>
            );
          };

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
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {post.user?.first_name} {post.user?.last_name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="bg-slate-100 rounded-lg px-3 py-2 mb-2">
                  <p className="text-sm whitespace-pre-line">{post.content}</p>
                  
                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="mt-2 grid gap-2">
                      {post.media_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Post attachment ${index + 1}`}
                          className="rounded w-full max-w-xs"
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <PostReactionsComponent post={post} />
                
                {expandedComments[post.id] && (
                  <div className="mt-3">
                    <CommentsSection 
                      postId={post.id}
                      userId={currentUserId}
                      commentsCount={post.comments_count || 0}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
