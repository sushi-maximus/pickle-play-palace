
import { useAuth } from "@/contexts/AuthContext";
import { CreatePostForm2 } from "../posts/CreatePostForm2";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

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
  const { 
    posts, 
    loading, 
    refreshing,
    refreshPosts 
  } = useGroupPosts({ 
    groupId, 
    userId: user?.id 
  });

  const handlePostCreated = () => {
    refreshPosts();
    onPostCreated?.();
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
        {posts.map((post) => (
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
              
              <div className="bg-slate-100 rounded-lg px-3 py-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
