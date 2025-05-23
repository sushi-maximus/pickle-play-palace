
export interface UseAutoRefreshProps {
  refreshFunction: () => Promise<void>;
  loading: boolean;
  interval?: number;
}

export interface UseAutoRefreshResult {
  isAutoRefreshEnabled: boolean;
  isRefreshing: boolean;
  lastAutoRefresh: Date | null;
  nextRefreshIn: number;
  toggleAutoRefresh: () => void;
  handleManualRefresh: () => Promise<void>;
}
