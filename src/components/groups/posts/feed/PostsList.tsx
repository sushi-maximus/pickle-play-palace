
import { MobilePostCard2 } from "../../mobile/MobilePostCard2";
import { cn } from "@/lib/utils";
import type { GroupPost, Profile } from "../hooks/types/groupPostTypes";
import { useMemo } from "react";

interface PostsListProps {
  posts: GroupPost[];
  user: Profile | null;
  isTransitioning: boolean;
  contentTransform: React.CSSProperties;
}

export const PostsList = ({ 
  posts, 
  user, 
  isTransitioning, 
  contentTransform 
}: PostsListProps) => {
  const transformedPosts = useMemo(() => {
    return posts.map((post) => {
      console.log("PostsList - Processing post:", {
        postId: post.id,
        postProfiles: post.profiles,
        userFirstName: post.profiles?.first_name,
        userLastName: post.profiles?.last_name
      });

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

      console.log("PostsList - Transformed post:", transformedPost);
      return transformedPost;
    });
  }, [posts]);

  return (
    <div 
      className={cn(
        "space-y-6 pb-6 transition-opacity duration-300", 
        isTransitioning ? "opacity-50" : "opacity-100"
      )}
      style={contentTransform}
    >
      {transformedPosts.map((post) => (
        <MobilePostCard2 
          key={post.id} 
          post={post}
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
      ))}
    </div>
  );
};
