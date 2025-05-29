
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOptimizedPullToRefresh } from '@/hooks/useOptimizedPullToRefresh';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardPullToRefresh = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleRefresh = useCallback(async () => {
    // Only refresh if user exists, but always define the callback
    if (user?.id) {
      await queryClient.invalidateQueries({
        queryKey: ['userRegisteredEvents', user.id]
      });
    }
  }, [queryClient, user?.id]);

  // ALWAYS call useOptimizedPullToRefresh to maintain hook order
  const pullToRefreshResult = useOptimizedPullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5,
  });

  // Return the result regardless of user state - the onRefresh callback handles the conditional logic
  return pullToRefreshResult;
};
