
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOptimizedPullToRefresh } from '@/hooks/useOptimizedPullToRefresh';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardPullToRefresh = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleRefresh = useCallback(async () => {
    if (!user?.id) return;
    
    // Only refresh the registered events query (as per user decision A10)
    await queryClient.invalidateQueries({
      queryKey: ['userRegisteredEvents', user.id]
    });
  }, [queryClient, user?.id]);

  return useOptimizedPullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5,
  });
};
