
import { usePerformanceMetrics } from './usePerformanceMetrics';
import { useRenderTracker } from './useRenderTracker';
import { useMemoryUsage } from './useMemoryUsage';
import { useMemoryLeakDetector } from './useMemoryLeakDetector';
import { useMemoryPressure } from './useMemoryPressure';

interface UsePerformanceMonitoringOptions {
  componentName: string;
  enabled?: boolean;
  trackProps?: boolean;
  renderThreshold?: number;
  memoryAlertThreshold?: number;
  memoryInterval?: number;
  logToConsole?: boolean;
}

export const usePerformanceMonitoring = (
  props: Record<string, any> = {},
  options: UsePerformanceMonitoringOptions
) => {
  const {
    componentName,
    enabled = process.env.NODE_ENV === 'development',
    trackProps = false,
    renderThreshold = 16,
    memoryAlertThreshold = 75,
    memoryInterval = 5000,
    logToConsole = false
  } = options;

  // Component render performance
  const { metrics } = usePerformanceMetrics({
    componentName,
    enabled,
    logToConsole
  });

  // Render tracking with threshold alerts
  useRenderTracker(props, {
    componentName,
    trackProps,
    threshold: renderThreshold,
    enabled
  });

  // Memory usage monitoring
  const { memoryInfo, isHighUsage } = useMemoryUsage({
    enabled,
    intervalMs: memoryInterval,
    alertThreshold: memoryAlertThreshold
  });

  // Memory leak detection
  const { trackObject, registerCleanup } = useMemoryLeakDetector({
    enabled,
    componentName,
    trackObjects: true,
    alertThreshold: 5
  });

  // Memory pressure monitoring
  const { pressureInfo } = useMemoryPressure({
    enabled,
    checkIntervalMs: 10000,
    thresholds: {
      medium: 60,
      high: memoryAlertThreshold,
      critical: 90
    }
  });

  return {
    // Performance metrics
    metrics,
    
    // Memory information
    memoryInfo,
    isHighUsage,
    pressureInfo,
    
    // Utility functions
    trackObject,
    registerCleanup,
    
    // Status
    isEnabled: enabled
  };
};
