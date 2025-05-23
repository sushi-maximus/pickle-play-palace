import { CreatePostForm } from "./CreatePostForm";
import { GroupPostCard } from "./GroupPostCard";
import { GroupPostsLoading } from "./GroupPostsLoading";
import { GroupPostsEmpty } from "./GroupPostsEmpty";
import { useGroupPosts } from "./hooks/useGroupPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface GroupPostsFeedProps {
  groupId: string;
  user: any;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  standalone?: boolean;
}

export const GroupPostsFeed = ({ 
  groupId, 
  user, 
  membershipStatus,
  standalone = false
}: GroupPostsFeedProps) => {
  const { 
    posts, 
    loading, 
    error, 
    groupName, 
    refreshPosts 
  } = useGroupPosts({ 
    groupId, 
    userId: user?.id 
  });

  const handlePostCreated = () => {
    refreshPosts();
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
      
      // Refresh posts to update reactions
      refreshPosts();
    } catch (err) {
      console.error("Error toggling reaction:", err);
    }
  };

  const renderContent = () => {
    // Loading state
    if (loading) {
      return <GroupPostsLoading />;
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
          <GroupPostsEmpty isMember={membershipStatus.isMember} />
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

  // If standalone, wrap in a card
  if (standalone) {
    return (
      <Card className="w-full mb-6 overflow-hidden bg-gradient-to-r from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle>Posts{groupName ? ` - ${groupName}` : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  // Otherwise, return just the content (for tabs)
  return renderContent();
};
