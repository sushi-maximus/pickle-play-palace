
import { useRef, useEffect, useState, useCallback } from 'react';

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

  // Start timing at the beginning of render
  if (enabled) {
    renderStartTime.current = performance.now();
  }

  useEffect(() => {
    if (!enabled) return;

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
    isEnabled: enabled
  };
};
