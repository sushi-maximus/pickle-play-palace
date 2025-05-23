
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
        user: userData,
        reactions: reactionCounts,
        comments_count: commentsCount,
        user_reactions: userReactions
      };
    })
  );
};
