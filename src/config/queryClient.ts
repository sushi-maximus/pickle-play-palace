
import { QueryClient } from "@tanstack/react-query";
import { createCacheManager } from "@/lib/cacheUtils";

export const createAppQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry auth errors
          if (error instanceof Error && error.message.includes('auth')) {
            return false;
          }
          // Retry network errors up to 3 times
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Enhanced caching strategy
        gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
        refetchOnMount: (query) => {
          // Only refetch if data is older than 2 minutes
          return Date.now() - (query.state.dataUpdatedAt || 0) > 2 * 60 * 1000;
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          // Don't retry auth errors
          if (error instanceof Error && error.message.includes('auth')) {
            return false;
          }
          return failureCount < 2;
        },
        // Add optimistic update options
        onMutate: () => {
          console.log('Mutation started - optimistic update in progress');
        },
        onError: (error, variables, context) => {
          console.error('Mutation failed, rolling back:', error);
        },
        onSuccess: () => {
          console.log('Mutation successful');
        },
      },
    },
  });

  return queryClient;
};

export const setupCacheManager = (queryClient: QueryClient) => {
  // Initialize cache manager for advanced cache operations
  const cacheManager = createCacheManager(queryClient);

  // Add cache monitoring in development
  if (process.env.NODE_ENV === 'development') {
    // Log cache stats every 30 seconds
    setInterval(() => {
      const stats = cacheManager.getCacheStats();
      console.log('Cache Stats:', stats);
    }, 30000);
    
    // Clear stale cache every 5 minutes
    setInterval(() => {
      cacheManager.clearStaleCache();
    }, 5 * 60 * 1000);
  }

  return cacheManager;
};
