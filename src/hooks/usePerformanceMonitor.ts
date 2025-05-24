
import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  timestamp: number;
}

interface NavigationTiming {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [navigationTiming, setNavigationTiming] = useState<NavigationTiming | null>(null);

  const recordMetric = useCallback((metric: Omit<PerformanceMetrics, 'timestamp'>) => {
    setMetrics(prev => [
      { ...metric, timestamp: Date.now() },
      ...prev.slice(0, 49) // Keep last 50 metrics
    ]);
  }, []);

  const getNavigationTiming = useCallback(() => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const timing: NavigationTiming = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
      
      setNavigationTiming(timing);
      return timing;
    }
    return null;
  }, []);

  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
      };
    }
    return null;
  }, []);

  const measureRenderTime = useCallback((componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    
    recordMetric({
      loadTime: 0,
      renderTime: end - start,
      memoryUsage: getMemoryUsage()?.percentage || 0,
      cacheHitRate: 0 // Would be calculated based on cache hits/misses
    });
    
    console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
  }, [recordMetric, getMemoryUsage]);

  useEffect(() => {
    getNavigationTiming();
    
    // Monitor memory usage periodically
    const memoryInterval = setInterval(() => {
      const memory = getMemoryUsage();
      if (memory && memory.percentage > 80) {
        console.warn(`High memory usage: ${memory.percentage.toFixed(1)}%`);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(memoryInterval);
  }, [getNavigationTiming, getMemoryUsage]);

  return {
    metrics,
    navigationTiming,
    recordMetric,
    measureRenderTime,
    getMemoryUsage,
    getNavigationTiming
  };
};
