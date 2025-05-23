
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupPostCard } from "./GroupPostCard";
import { CreatePostForm } from "./CreatePostForm";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupPostsFeedProps {
  groupId: string;
  user: any;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
}

export const GroupPostsFeed = ({ groupId, user, membershipStatus }: GroupPostsFeedProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Get posts for this group
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          user:user_id (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // If no posts, return early
      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Get reactions counts for these posts
      const postsWithCounts = await Promise.all(
        postsData.map(async (post) => {
          // Count total reactions
          const { count: reactionsCount, error: reactionsError } = await supabase
            .from("reactions")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          // Count comments
          const { count: commentsCount, error: commentsError } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          // Check if current user has reacted to this post
          const { data: userReaction, error: userReactionError } = await supabase
            .from("reactions")
            .select("*")
            .eq("post_id", post.id)
            .eq("user_id", user?.id || '')
            .maybeSingle();

          if (reactionsError || commentsError || userReactionError) {
            console.error("Error fetching post metadata", {
              reactionsError,
              commentsError,
              userReactionError
            });
          }

          return {
            ...post,
            reactions_count: reactionsCount || 0,
            comments_count: commentsCount || 0,
            user_has_reacted: !!userReaction
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchPosts();
    }
  }, [groupId]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleReactionToggle = async (postId: string) => {
    if (!user) return;

    try {
      // Check if user already reacted to this post
      const { data: existingReaction } = await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingReaction) {
        // If reaction exists, delete it
        await supabase
          .from("reactions")
          .delete()
          .eq("id", existingReaction.id);
      } else {
        // If no reaction, create one
        await supabase
          .from("reactions")
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: "like"
          });
      }
    } catch (err) {
      console.error("Error toggling reaction:", err);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      {membershipStatus.isMember && (
        <CreatePostForm 
          groupId={groupId} 
          user={user}
          onPostCreated={handlePostCreated}
        />
      )}
      
      {posts.length === 0 ? (
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            {membershipStatus.isMember 
              ? "Be the first to create a post in this group!" 
              : "No posts available in this group yet."}
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <GroupPostCard 
              key={post.id} 
              post={post} 
              onReactionToggle={handleReactionToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
