
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface UseMemoryUsageOptions {
  enabled?: boolean;
  intervalMs?: number;
  sampleSize?: number;
  alertThreshold?: number;
}

export const useMemoryUsage = (options: UseMemoryUsageOptions = {}) => {
  const { 
    enabled = true, 
    intervalMs = 5000, 
    sampleSize = 10,
    alertThreshold = 80 
  } = options;
  
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isHighUsage, setIsHighUsage] = useState(false);
  const samplesRef = useRef<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  const { isEnabled: contextEnabled, updateMemoryMetrics } = usePerformanceContext();
  const isTrackingEnabled = enabled && contextEnabled;

  useEffect(() => {
    const supported = 'memory' in performance;
    setIsSupported(supported);
    
    if (!supported && isTrackingEnabled) {
      console.warn('Performance.memory API not supported in this browser');
    }
  }, [isTrackingEnabled]);

  const getMemoryInfo = useCallback((): MemoryInfo | null => {
    if (!isSupported || !('memory' in performance)) return null;

    const memory = (performance as any).memory;
    const usedPercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    
    samplesRef.current.push(usedPercentage);
    if (samplesRef.current.length > sampleSize) {
      samplesRef.current.shift();
    }

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (samplesRef.current.length >= 3) {
      const recent = samplesRef.current.slice(-3);
      const avgChange = (recent[2] - recent[0]) / 2;
      if (avgChange > 1) trend = 'increasing';
      else if (avgChange < -1) trend = 'decreasing';
    }

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedPercentage,
      trend
    };
  }, [isSupported, sampleSize]);

  useEffect(() => {
    if (!isTrackingEnabled || !isSupported) return;

    const monitor = () => {
      const info = getMemoryInfo();
      if (info) {
        setMemoryInfo(info);
        setIsHighUsage(info.usedPercentage > alertThreshold);
        
        // Update context with memory metrics
        updateMemoryMetrics(info);
        
        if (info.usedPercentage > alertThreshold) {
          console.warn(`High memory usage detected: ${info.usedPercentage.toFixed(1)}%`, {
            used: `${(info.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
            limit: `${(info.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
            trend: info.trend
          });
        }
      }
    };

    monitor();
    intervalRef.current = setInterval(monitor, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTrackingEnabled, isSupported, intervalMs, alertThreshold, getMemoryInfo, updateMemoryMetrics]);

  const forceGarbageCollection = useCallback(() => {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
      console.log('Manual garbage collection triggered');
    } else {
      console.warn('Manual garbage collection not available');
    }
  }, []);

  const clearSamples = useCallback(() => {
    samplesRef.current = [];
  }, []);

  return {
    memoryInfo,
    isSupported,
    isHighUsage,
    forceGarbageCollection,
    clearSamples,
    samples: samplesRef.current
  };
};
