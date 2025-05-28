
import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export class CacheManager {
  constructor(private queryClient: QueryClient) {}

  // Invalidate related caches efficiently
  invalidateGroupCaches(groupId?: string) {
    if (groupId) {
      // Invalidate specific group
      this.queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
      this.queryClient.invalidateQueries({ queryKey: queryKeys.posts.list(groupId) });
    } else {
      // Invalidate all group-related caches
      this.queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
    }
  }

  invalidatePostCaches(postId?: string, groupId?: string) {
    if (postId) {
      this.queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      this.queryClient.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
    }
    
    if (groupId) {
      this.queryClient.invalidateQueries({ queryKey: queryKeys.posts.list(groupId) });
    }
  }

  invalidateProfileCaches(userId?: string) {
    if (userId) {
      this.queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail(userId) });
    } else {
      this.queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    }
  }

  // Prefetch commonly accessed data
  async prefetchGroupDetails(groupId: string) {
    // Only prefetch if not already cached
    const cached = this.queryClient.getQueryData(queryKeys.groups.detail(groupId));
    if (!cached) {
      // This would be implemented with actual fetch logic
      console.log(`Prefetching group ${groupId} details`);
    }
  }

  async prefetchUserGroups(userId: string) {
    const cached = this.queryClient.getQueryData(queryKeys.groups.myGroups(userId));
    if (!cached) {
      console.log(`Prefetching user ${userId} groups`);
    }
  }

  // Cache performance monitoring
  getCacheStats() {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.isActive()).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
    };
  }

  // Clear stale cache entries
  clearStaleCache() {
    const cache = this.queryClient.getQueryCache();
    const staleQueries = cache.getAll().filter(q => q.isStale());
    
    staleQueries.forEach(query => {
      this.queryClient.removeQueries({ queryKey: query.queryKey });
    });
    
    console.log(`Cleared ${staleQueries.length} stale cache entries`);
  }
}

// Utility function to create cache manager instance
export const createCacheManager = (queryClient: QueryClient) => {
  return new CacheManager(queryClient);
};
