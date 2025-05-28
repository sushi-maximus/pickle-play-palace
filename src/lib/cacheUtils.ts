
import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export class CacheManager {
  constructor(private queryClient: QueryClient) {}

  // Enhanced group cache invalidation with optimistic updates
  invalidateGroupCaches(groupId?: string, userId?: string) {
    console.log('CacheManager: Invalidating group caches', { groupId, userId });
    
    if (groupId) {
      // Invalidate specific group
      this.queryClient.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
      this.queryClient.invalidateQueries({ queryKey: queryKeys.groups.members(groupId) });
    } else {
      // Invalidate all group-related caches
      this.queryClient.invalidateQueries({ queryKey: queryKeys.groups.all });
    }

    // Invalidate user-specific caches
    if (userId) {
      this.queryClient.invalidateQueries({ queryKey: queryKeys.groups.myGroups(userId) });
      this.queryClient.invalidateQueries({ queryKey: queryKeys.groups.userMemberships(userId) });
    }
  }

  // Enhanced post cache invalidation
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

  // Enhanced prefetching with retry logic
  async prefetchGroupDetails(groupId: string) {
    const cached = this.queryClient.getQueryData(queryKeys.groups.detail(groupId));
    if (!cached) {
      console.log(`CacheManager: Prefetching group ${groupId} details`);
      try {
        await this.queryClient.prefetchQuery({
          queryKey: queryKeys.groups.detail(groupId),
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 2
        });
      } catch (error) {
        console.error(`CacheManager: Failed to prefetch group ${groupId}:`, error);
      }
    }
  }

  async prefetchUserGroups(userId: string) {
    const cached = this.queryClient.getQueryData(queryKeys.groups.myGroups(userId));
    if (!cached) {
      console.log(`CacheManager: Prefetching user ${userId} groups`);
      try {
        await this.queryClient.prefetchQuery({
          queryKey: queryKeys.groups.myGroups(userId),
          staleTime: 5 * 60 * 1000,
          retry: 2
        });
      } catch (error) {
        console.error(`CacheManager: Failed to prefetch user groups for ${userId}:`, error);
      }
    }
  }

  // Enhanced cache performance monitoring
  getCacheStats() {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const groupQueries = queries.filter(q => 
      Array.isArray(q.queryKey) && q.queryKey[0] === 'groups'
    );
    
    return {
      totalQueries: queries.length,
      groupQueries: groupQueries.length,
      activeQueries: queries.filter(q => q.isActive()).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      memoryUsage: this.estimateMemoryUsage(queries)
    };
  }

  // Estimate memory usage of cached data
  private estimateMemoryUsage(queries: any[]): string {
    try {
      const totalSize = queries.reduce((size, query) => {
        if (query.state.data) {
          return size + JSON.stringify(query.state.data).length;
        }
        return size;
      }, 0);
      
      if (totalSize < 1024) return `${totalSize} B`;
      if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(2)} KB`;
      return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
      return 'Unknown';
    }
  }

  // Enhanced stale cache clearing with priority
  clearStaleCache(priority: 'low' | 'high' = 'low') {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    let staleQueries = queries.filter(q => q.isStale());
    
    if (priority === 'high') {
      // Remove older stale queries first
      staleQueries = staleQueries.filter(q => {
        const staleTime = Date.now() - (q.state.dataUpdatedAt || 0);
        return staleTime > 10 * 60 * 1000; // Older than 10 minutes
      });
    }
    
    staleQueries.forEach(query => {
      this.queryClient.removeQueries({ queryKey: query.queryKey });
    });
    
    console.log(`CacheManager: Cleared ${staleQueries.length} stale cache entries (priority: ${priority})`);
    return staleQueries.length;
  }

  // Optimistic cache updates for better UX
  setOptimisticGroupData(groupId: string, updater: (prev: any) => any) {
    this.queryClient.setQueryData(
      queryKeys.groups.detail(groupId),
      updater
    );
  }

  // Batch cache operations for better performance
  async batchInvalidate(operations: Array<() => void>) {
    operations.forEach(op => op());
    await this.queryClient.refetchQueries({ type: 'active' });
  }
}

// Enhanced utility function to create cache manager instance
export const createCacheManager = (queryClient: QueryClient) => {
  return new CacheManager(queryClient);
};

// Export commonly used cache operations
export const cacheOperations = {
  invalidateGroups: (queryClient: QueryClient, groupId?: string, userId?: string) => {
    const manager = createCacheManager(queryClient);
    manager.invalidateGroupCaches(groupId, userId);
  },
  
  prefetchGroup: async (queryClient: QueryClient, groupId: string) => {
    const manager = createCacheManager(queryClient);
    await manager.prefetchGroupDetails(groupId);
  },
  
  clearStaleData: (queryClient: QueryClient, priority: 'low' | 'high' = 'low') => {
    const manager = createCacheManager(queryClient);
    return manager.clearStaleCache(priority);
  }
};
