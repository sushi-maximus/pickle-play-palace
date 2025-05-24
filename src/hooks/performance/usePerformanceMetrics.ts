
import { useRef, useEffect, useState, useCallback } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
  componentName?: string;
}

interface UsePerformanceMetricsOptions {
  componentName?: string;
  enabled?: boolean;
  logToConsole?: boolean;
}

export const usePerformanceMetrics = (options: UsePerformanceMetricsOptions = {}) => {
  const { componentName = 'Unknown', enabled = true, logToConsole = false } = options;
  
  const renderStartTime = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
    componentName
  });

  const { isEnabled: contextEnabled, registerComponent, updateComponentMetrics } = usePerformanceContext();
  const isTrackingEnabled = enabled && contextEnabled;

  // Register component with context
  useEffect(() => {
    if (isTrackingEnabled) {
      registerComponent(componentName);
    }
  }, [isTrackingEnabled, componentName, registerComponent]);

  // Start timing at the beginning of render
  if (isTrackingEnabled) {
    renderStartTime.current = performance.now();
  }

  useEffect(() => {
    if (!isTrackingEnabled) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    setMetrics(prev => {
      const newRenderCount = prev.renderCount + 1;
      const newTotalTime = prev.totalRenderTime + renderTime;
      const newAverageTime = newTotalTime / newRenderCount;

      const newMetrics = {
        renderCount: newRenderCount,
        lastRenderTime: renderTime,
        averageRenderTime: newAverageTime,
        totalRenderTime: newTotalTime,
        componentName
      };

      // Update context with new metrics
      updateComponentMetrics(componentName, renderTime);

      if (logToConsole) {
        console.log(`Performance [${componentName}]:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          avgTime: `${newAverageTime.toFixed(2)}ms`,
          renders: newRenderCount
        });
      }

      return newMetrics;
    });
  });

  const resetMetrics = useCallback(() => {
    setMetrics({
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      totalRenderTime: 0,
      componentName
    });
  }, [componentName]);

  return {
    metrics,
    resetMetrics,
    isEnabled: isTrackingEnabled
  };
};
