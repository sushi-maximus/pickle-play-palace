
import { CreatePostForm } from "../CreatePostForm";
import { GroupPostCard } from "../GroupPostCard";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { GroupPostsLoading } from "../GroupPostsLoading";
import { RefreshProgressIndicator } from "./RefreshProgressIndicator";
import type { GroupPost } from "../hooks/useGroupPosts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FeedContentProps {
  loading: boolean;
  refreshing?: boolean;
  error: string | null;
  posts: GroupPost[];
  user: any;
  groupId: string;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  refreshPosts: () => void;
  onPostCreated: () => void;
  onPostUpdated: () => void;
  onPostDeleted: () => void;
}

export const FeedContent = ({ 
  loading, 
  refreshing = false,
  error, 
  posts, 
  user,
  groupId,
  membershipStatus,
  refreshPosts,
  onPostCreated,
  onPostUpdated,
  onPostDeleted
}: FeedContentProps) => {
  // Track previous posts to enable smooth transitions
  const [displayedPosts, setDisplayedPosts] = useState<GroupPost[]>(posts);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update displayed posts with transition when posts change
  useEffect(() => {
    if (posts.length > 0 && !loading) {
      // Only apply transition when we're refreshing (not on initial load)
      if (refreshing && displayedPosts.length > 0) {
        // Start transition
        setIsTransitioning(true);
        
        // Wait for fade out animation to complete before updating posts
        const timer = setTimeout(() => {
          setDisplayedPosts(posts);
          setIsTransitioning(false);
        }, 300); // Match this with the CSS transition duration
        
        return () => clearTimeout(timer);
      } else {
        // For initial load or non-refreshing updates, just update immediately
        setDisplayedPosts(posts);
      }
    }
  }, [posts, refreshing, loading]);

  // Only show loading state on initial load
  // For refreshes, we'll keep displaying the existing content
  if (loading && !refreshing && displayedPosts.length === 0) {
    return <GroupPostsLoading />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button variant="outline" onClick={refreshPosts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add the progress indicator at the top */}
      <RefreshProgressIndicator refreshing={refreshing} />
      
      {membershipStatus.isMember && (
        <CreatePostForm 
          groupId={groupId} 
          user={user}
          onPostCreated={onPostCreated}
          refreshing={refreshing}
        />
      )}
      
      {displayedPosts.length === 0 ? (
        <GroupPostsEmpty isMember={membershipStatus.isMember} />
      ) : (
        <div 
          className={cn(
            "space-y-6", 
            isTransitioning ? "opacity-50 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"
          )}
        >
          {displayedPosts.map((post) => (
            <GroupPostCard 
              key={post.id} 
              post={post}
              currentUserId={user?.id}
              onPostUpdated={onPostUpdated}
              onPostDeleted={onPostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};
