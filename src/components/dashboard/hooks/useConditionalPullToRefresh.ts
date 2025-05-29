
import { useRef } from 'react';
import { useDashboardPullToRefresh } from './useDashboardPullToRefresh';

interface UseConditionalPullToRefreshProps {
  enabled: boolean;
}

export const useConditionalPullToRefresh = ({ enabled }: UseConditionalPullToRefreshProps) => {
  const defaultReturn = {
    pullDistance: 0,
    isRefreshing: false,
    isPulling: false,
    bindToElement: () => {},
  };

  // Only call the actual hook when enabled (user is authenticated)
  const actualHook = enabled ? useDashboardPullToRefresh() : defaultReturn;
  
  return actualHook;
};
