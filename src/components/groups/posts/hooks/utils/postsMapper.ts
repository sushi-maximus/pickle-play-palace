
import { fetchUserData, fetchReactionCounts, fetchCommentsCount, fetchUserReactions } from "../services/postsFetchService";
import { GroupPost } from "../types/groupPostTypes";

export const enrichPostsWithCounts = async (
  posts: any[],
  userId?: string
): Promise<GroupPost[]> => {
  console.log(`🚀 === STARTING POST ENRICHMENT PROCESS ===`);
  console.log(`📊 Processing ${posts.length} posts`);
  console.log(`👤 Current user ID: ${userId}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);

  const enrichedPosts = await Promise.all(
    posts.map(async (post) => {
      console.log(`\n🔄 === ENRICHING POST ${post.id} ===`);
      console.log(`📝 Post content preview: "${post.content.substring(0, 50)}..."`);

      try {
        // Fetch user profile data
        console.log(`👤 Fetching user profile data for user ${post.user_id}...`);
        const userData = await fetchUserData(post.user_id);
        console.log(`✅ User data fetched:`, userData);

        // Fetch reaction counts
        console.log(`📊 Fetching reaction counts for post ${post.id}...`);
        const reactionCounts = await fetchReactionCounts(post.id);
        console.log(`✅ Reaction counts fetched:`, reactionCounts);

        // Fetch user's reactions for this post
        console.log(`🎯 Fetching user reactions for post ${post.id}...`);
        const userReactions = await fetchUserReactions(post.id, userId);
        console.log(`✅ User reactions fetched:`, userReactions);

        // Fetch comments count
        console.log(`💬 Fetching comments count for post ${post.id}...`);
        const commentsCount = await fetchCommentsCount(post.id);
        console.log(`✅ Comments count fetched: ${commentsCount}`);

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

        console.log(`🎉 === POST ${post.id} ENRICHMENT COMPLETE ===`);
        console.log(`📊 Final enriched data summary:`);
        console.log(`  - Heart count: ${enrichedPost.heart_count}`);
        console.log(`  - User heart status: ${enrichedPost.user_heart}`);
        console.log(`  - Thumbs up count: ${enrichedPost.thumbsup_count}`);
        console.log(`  - User thumbs up status: ${enrichedPost.user_thumbsup}`);
        console.log(`  - Thumbs down count: ${enrichedPost.thumbsdown_count}`);
        console.log(`  - User thumbs down status: ${enrichedPost.user_thumbsdown}`);

        return enrichedPost;
      } catch (error) {
        console.error(`💥 === ERROR ENRICHING POST ${post.id} ===`);
        console.error(`Error details:`, error);
        console.error(`Error message:`, error?.message);
        console.error(`Error stack:`, error?.stack);
        
        // Return a basic version of the post if enrichment fails
        const fallbackPost: GroupPost = {
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

        console.log(`🔄 Returning fallback post data for ${post.id}`);
        return fallbackPost;
      }
    })
  );

  console.log(`🏁 === POST ENRICHMENT PROCESS COMPLETE ===`);
  console.log(`✅ Successfully enriched ${enrichedPosts.length} posts`);
  console.log(`🕐 Completed at: ${new Date().toISOString()}`);
  
  // Log a summary of heart reactions for debugging
  enrichedPosts.forEach(post => {
    if (post.heart_count > 0 || post.user_heart) {
      console.log(`💖 Post ${post.id} heart summary: count=${post.heart_count}, user_active=${post.user_heart}`);
    }
  });

  return enrichedPosts;
};

// Export alias for the function name used in useGroupPosts
export const mapPostsWithDetails = enrichPostsWithCounts;
