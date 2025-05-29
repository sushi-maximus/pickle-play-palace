
import { useRef } from 'react';
import { useDashboardPullToRefresh } from './useDashboardPullToRefresh';

interface UseConditionalPullToRefreshProps {
  enabled: boolean;
}

export const useConditionalPullToRefresh = ({ enabled }: UseConditionalPullToRefreshProps) => {
  // ALWAYS call the hook to maintain consistent hook order
  const hookResult = useDashboardPullToRefresh();
  
  const defaultReturn = {
    pullDistance: 0,
    isRefreshing: false,
    isPulling: false,
    bindToElement: () => {},
  };

  // Return the hook result if enabled, otherwise return default values
  return enabled ? hookResult : defaultReturn;
};
