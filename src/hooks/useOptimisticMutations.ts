
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

export const useOptimisticMutations = () => {
  const queryClient = useQueryClient();

  // Optimistic post reaction update
  const updatePostReactionOptimistically = (
    postId: string,
    reactionType: 'thumbsup' | 'thumbsdown' | 'heart',
    isActive: boolean,
    countChange: number
  ) => {
    // Update the specific post's reactions in all relevant queries
    queryClient.setQueriesData(
      { queryKey: queryKeys.posts.all },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        // Handle both single posts and arrays of posts
        if (Array.isArray(oldData)) {
          return oldData.map((post: any) => {
            if (post.id === postId) {
              return {
                ...post,
                [`${reactionType}_count`]: Math.max(0, (post[`${reactionType}_count`] || 0) + countChange),
                [`user_${reactionType}`]: isActive
              };
            }
            return post;
          });
        } else if (oldData.id === postId) {
          return {
            ...oldData,
            [`${reactionType}_count`]: Math.max(0, (oldData[`${reactionType}_count`] || 0) + countChange),
            [`user_${reactionType}`]: isActive
          };
        }
        
        return oldData;
      }
    );
  };

  // Optimistic comment reaction update
  const updateCommentReactionOptimistically = (
    commentId: string,
    reactionType: 'thumbsup' | 'thumbsdown',
    isActive: boolean,
    countChange: number
  ) => {
    queryClient.setQueriesData(
      { queryKey: queryKeys.comments.all },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (Array.isArray(oldData)) {
          return oldData.map((comment: any) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                [`${reactionType}_count`]: Math.max(0, (comment[`${reactionType}_count`] || 0) + countChange),
                [`user_${reactionType}`]: isActive
              };
            }
            return comment;
          });
        }
        
        return oldData;
      }
    );
  };

  // Optimistic group membership update
  const updateGroupMembershipOptimistically = (
    groupId: string,
    isMember: boolean,
    memberCountChange: number
  ) => {
    // Update groups list
    queryClient.setQueriesData(
      { queryKey: queryKeys.groups.all },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (Array.isArray(oldData)) {
          return oldData.map((group: any) => {
            if (group.id === groupId) {
              return {
                ...group,
                isMember,
                member_count: Math.max(0, (group.member_count || 0) + memberCountChange)
              };
            }
            return group;
          });
        }
        
        return oldData;
      }
    );

    // Update specific group detail
    queryClient.setQueryData(
      queryKeys.groups.detail(groupId),
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          isMember,
          member_count: Math.max(0, (oldData.member_count || 0) + memberCountChange)
        };
      }
    );
  };

  // Optimistic profile update
  const updateProfileOptimistically = (
    userId: string,
    updates: Record<string, any>
  ) => {
    queryClient.setQueryData(
      queryKeys.profile.detail(userId),
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          ...updates
        };
      }
    );
  };

  // Rollback function for failed mutations
  const rollbackOptimisticUpdate = (queryKey: any[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    updatePostReactionOptimistically,
    updateCommentReactionOptimistically,
    updateGroupMembershipOptimistically,
    updateProfileOptimistically,
    rollbackOptimisticUpdate
  };
};
