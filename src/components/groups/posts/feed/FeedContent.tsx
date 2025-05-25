
import { CreatePostForm2 } from "../CreatePostForm2";
import { MobilePostCard2 } from "../../mobile/MobilePostCard2";
import { GroupPostsEmpty } from "../GroupPostsEmpty";
import { MobilePostsLoading } from "../../mobile/MobilePostsLoading";
import { RefreshProgressIndicator } from "./RefreshProgressIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GroupPost, Profile } from "../hooks/types/groupPostTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FeedContentProps {
  loading: boolean;
  refreshing?: boolean;
  error: string | null;
  posts: GroupPost[];
  user: Profile | null;
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

  // Log refresh state changes for debugging
  useEffect(() => {
    console.log("FeedContent - refreshing state changed:", refreshing);
  }, [refreshing]);

  // Update displayed posts with transition when posts change
  useEffect(() => {
    if (posts.length > 0 && !loading) {
      // Only apply transition when we're refreshing (not on initial load)
      if (refreshing && displayedPosts.length > 0) {
        // Start transition
        setIsTransitioning(true);
        console.log("FeedContent - starting transition for updated posts");
        
        // Wait for fade out animation to complete before updating posts
        const timer = setTimeout(() => {
          setDisplayedPosts(posts);
          setIsTransitioning(false);
          console.log("FeedContent - transition complete, posts updated");
        }, 300); // Match this with the CSS transition duration
        
        return () => clearTimeout(timer);
      } else {
        // For initial load or non-refreshing updates, just update immediately
        console.log("FeedContent - updating posts immediately (initial load or non-refreshing update)");
        setDisplayedPosts(posts);
      }
    }
  }, [posts, refreshing, loading]);

  // Only show loading state on initial load
  // For refreshes, we'll keep displaying the existing content
  if (loading && !refreshing && displayedPosts.length === 0) {
    return (
      <>
        <RefreshProgressIndicator refreshing={refreshing} />
        <MobilePostsLoading />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <RefreshProgressIndicator refreshing={refreshing} />
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button variant="outline" onClick={refreshPosts}>Try Again</Button>
        </div>
      </>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Always render the progress indicator at the top of the feed */}
      <RefreshProgressIndicator refreshing={refreshing} />
      
      {membershipStatus.isMember && (
        <div className="flex-shrink-0 px-3 md:px-6">
          <CreatePostForm2 
            groupId={groupId} 
            user={user}
            onPostCreated={onPostCreated}
          />
        </div>
      )}
      
      {displayedPosts.length === 0 ? (
        <GroupPostsEmpty isMember={membershipStatus.isMember} />
      ) : (
        <ScrollArea className="flex-1 px-3 md:px-6">
          <div 
            className={cn(
              "space-y-6 pb-6", 
              isTransitioning ? "opacity-50 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"
            )}
          >
            {displayedPosts.map((post) => {
              // Debug log to see the post data structure
              console.log("FeedContent - Processing post:", {
                postId: post.id,
                postProfiles: post.profiles,
                userFirstName: post.profiles?.first_name,
                userLastName: post.profiles?.last_name
              });

              // Transform GroupPost to match MobilePostCard2 expected format
              const transformedPost = {
                id: post.id,
                content: post.content,
                created_at: post.created_at,
                user_id: post.user_id,
                media_urls: post.media_urls,
                profiles: {
                  first_name: post.profiles?.first_name || '',
                  last_name: post.profiles?.last_name || '',
                  avatar_url: post.profiles?.avatar_url
                }
              };

              console.log("FeedContent - Transformed post:", transformedPost);

              return (
                <MobilePostCard2 
                  key={post.id} 
                  post={transformedPost}
                  user={user}
                  isEditing={false}
                  currentPostId={null}
                  editableContent=""
                  setEditableContent={() => {}}
                  isEditSubmitting={false}
                  onStartEditing={() => {}}
                  onCancelEditing={() => {}}
                  onSaveEditing={() => {}}
                  onDeleteClick={() => {}}
                />
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
