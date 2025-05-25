
import { GroupPost } from "../types/groupPostTypes";
import { 
  fetchUserData,
  fetchReactionCounts,
  fetchCommentsCount,
  fetchUserReactions 
} from "../services/postsFetchService";

export const mapPostsWithDetails = async (
  postsData: any[], 
  userId?: string
): Promise<GroupPost[]> => {
  if (!postsData || postsData.length === 0) {
    return [];
  }

  return Promise.all(
    postsData.map(async (post) => {
      // Fetch user data
      const userData = await fetchUserData(post.user_id);
      
      // Get reaction counts
      const reactionCounts = await fetchReactionCounts(post.id);
      
      // Get comments count
      const commentsCount = await fetchCommentsCount(post.id);
      
      // Get user reactions
      const userReactions = await fetchUserReactions(post.id, userId);

      return {
        ...post,
        // Map the user data to profiles field to match expected format
        profiles: userData ? {
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          avatar_url: userData.avatar_url
        } : null,
        user: userData,
        reactions: reactionCounts,
        comments_count: commentsCount,
        user_reactions: userReactions
      };
    })
  );
};
