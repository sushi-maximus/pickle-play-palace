
import { fetchUserData, fetchReactionCounts, fetchCommentsCount, fetchUserReactions } from "../services/postsFetchService";
import { GroupPost } from "../types/groupPostTypes";

export const enrichPostsWithCounts = async (
  posts: any[],
  userId?: string
): Promise<GroupPost[]> => {
  console.log(`🔄 ENRICHING ${posts.length} POSTS with reaction counts and user data`);
  console.log(`Current user ID: ${userId}`);

  const enrichedPosts = await Promise.all(
    posts.map(async (post) => {
      console.log(`📝 Processing post ${post.id}...`);

      try {
        // Fetch user profile data
        const userData = await fetchUserData(post.user_id);

        // Fetch reaction counts
        const reactionCounts = await fetchReactionCounts(post.id);
        console.log(`📊 Reaction counts for post ${post.id}:`, reactionCounts);

        // Fetch user's reactions for this post
        const userReactions = await fetchUserReactions(post.id, userId);
        console.log(`👤 User reactions for post ${post.id}:`, userReactions);

        // Fetch comments count
        const commentsCount = await fetchCommentsCount(post.id);

        const enrichedPost: GroupPost = {
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          updated_at: post.updated_at,
          user_id: post.user_id,
          group_id: post.group_id,
          media_urls: post.media_urls || [],
          pinned: post.pinned || false,

          // Reaction counts
          like_count: reactionCounts.like,
          thumbsup_count: reactionCounts.thumbsup,
          thumbsdown_count: reactionCounts.thumbsdown,
          heart_count: reactionCounts.heart,

          // User's reaction status
          user_like: userReactions.like,
          user_thumbsup: userReactions.thumbsup,
          user_thumbsdown: userReactions.thumbsdown,
          user_heart: userReactions.heart,

          // Comments count
          comments_count: commentsCount,

          // User profile data
          profiles: userData ? {
            first_name: userData.first_name,
            last_name: userData.last_name,
            avatar_url: userData.avatar_url
          } : null
        };

        console.log(`✅ Enriched post ${post.id} with data:`, {
          thumbsup_count: enrichedPost.thumbsup_count,
          thumbsdown_count: enrichedPost.thumbsdown_count,
          heart_count: enrichedPost.heart_count,
          user_thumbsup: enrichedPost.user_thumbsup,
          user_thumbsdown: enrichedPost.user_thumbsdown,
          user_heart: enrichedPost.user_heart
        });

        return enrichedPost;
      } catch (error) {
        console.error(`❌ Error enriching post ${post.id}:`, error);
        
        // Return a basic version of the post if enrichment fails
        return {
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          updated_at: post.updated_at,
          user_id: post.user_id,
          group_id: post.group_id,
          media_urls: post.media_urls || [],
          pinned: post.pinned || false,
          like_count: 0,
          thumbsup_count: 0,
          thumbsdown_count: 0,
          heart_count: 0,
          user_like: false,
          user_thumbsup: false,
          user_thumbsdown: false,
          user_heart: false,
          comments_count: 0,
          profiles: null
        };
      }
    })
  );

  console.log(`🎉 Successfully enriched ${enrichedPosts.length} posts`);
  return enrichedPosts;
};

// Export alias for the function name used in useGroupPosts
export const mapPostsWithDetails = enrichPostsWithCounts;
