import { useDashboardPullToRefresh } from './useDashboardPullToRefresh';

interface UseConditionalPullToRefreshProps {
  enabled: boolean;
}

export const useConditionalPullToRefresh = ({ enabled }: UseConditionalPullToRefreshProps) => {
  // ALWAYS call the hook to maintain consistent hook order
  const hookResult = useDashboardPullToRefresh();
  
  // If not enabled, return disabled state but keep the same structure
  if (!enabled) {
    return {
      pullDistance: 0,
      isRefreshing: false,
      isPulling: false,
      bindToElement: () => {}, // No-op function when disabled
    };
  }

  // Return the actual hook result when enabled
  return hookResult;
};
