
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { GroupPost } from "../posts/hooks/types/groupPostTypes";
import { formatDistanceToNow } from "date-fns";

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
    <div className="flex-1 px-4 py-6 overflow-y-auto">
      {refreshing && (
        <div className="text-center py-2">
          <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author_avatar_url || ""} />
              <AvatarFallback>
                {post.author_name?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{post.author_name}</span>
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
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-slate-500 hover:text-red-500"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs">{post.reactions?.like || 0}</span>
                </Button>
                
                <span className="text-xs text-slate-500">
                  {post.comments_count || 0} comments
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
