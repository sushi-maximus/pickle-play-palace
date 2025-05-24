
import { useRef, useEffect } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

interface RenderInfo {
  componentName: string;
  renderTime: number;
  timestamp: number;
  props?: Record<string, any>;
}

interface UseRenderTrackerOptions {
  componentName: string;
  trackProps?: boolean;
  threshold?: number;
  enabled?: boolean;
}

export const useRenderTracker = (
  props: Record<string, any> = {},
  options: UseRenderTrackerOptions
) => {
  const { componentName, trackProps = false, threshold = 16, enabled = true } = options;
  const renderStartTime = useRef<number>(0);
  const previousProps = useRef<Record<string, any>>(props);
  const renderCount = useRef<number>(0);

  const { isEnabled: contextEnabled, updateComponentMetrics } = usePerformanceContext();
  const isTrackingEnabled = enabled && contextEnabled;

  // Start timing
  if (isTrackingEnabled) {
    renderStartTime.current = performance.now();
  }

  useEffect(() => {
    if (!isTrackingEnabled) return;

    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    renderCount.current += 1;

    // Update context with render metrics
    updateComponentMetrics(componentName, renderTime);

    // Only log if render time exceeds threshold
    if (renderTime > threshold) {
      const renderInfo: RenderInfo = {
        componentName,
        renderTime,
        timestamp: Date.now(),
        ...(trackProps && { props })
      };

      console.warn(`Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        threshold: `${threshold}ms`,
        ...(trackProps && { propsChanged: getChangedProps(previousProps.current, props) })
      });

      if ('performance' in window && 'mark' in performance) {
        performance.mark(`slow-render-${componentName}-${renderCount.current}`);
      }
    }

    previousProps.current = props;
  });

  return {
    renderCount: renderCount.current,
    componentName
  };
};

const getChangedProps = (prevProps: Record<string, any>, currentProps: Record<string, any>) => {
  const changes: Record<string, { prev: any; current: any }> = {};
  
  const allKeys = new Set([...Object.keys(prevProps), ...Object.keys(currentProps)]);
  
  allKeys.forEach(key => {
    if (prevProps[key] !== currentProps[key]) {
      changes[key] = {
        prev: prevProps[key],
        current: currentProps[key]
      };
    }
  });
  
  return Object.keys(changes).length > 0 ? changes : null;
};
