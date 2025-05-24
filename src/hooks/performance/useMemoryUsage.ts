
import { useState, useEffect, useCallback, useRef } from 'react';

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
  alertThreshold?: number; // Percentage threshold for memory alerts
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

  // Check if performance.memory is supported
  useEffect(() => {
    const supported = 'memory' in performance;
    setIsSupported(supported);
    
    if (!supported && enabled) {
      console.warn('Performance.memory API not supported in this browser');
    }
  }, [enabled]);

  const getMemoryInfo = useCallback((): MemoryInfo | null => {
    if (!isSupported || !('memory' in performance)) return null;

    const memory = (performance as any).memory;
    const usedPercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    
    // Update samples for trend analysis
    samplesRef.current.push(usedPercentage);
    if (samplesRef.current.length > sampleSize) {
      samplesRef.current.shift();
    }

    // Calculate trend
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

  // Start memory monitoring
  useEffect(() => {
    if (!enabled || !isSupported) return;

    const monitor = () => {
      const info = getMemoryInfo();
      if (info) {
        setMemoryInfo(info);
        setIsHighUsage(info.usedPercentage > alertThreshold);
        
        // Log memory pressure warnings
        if (info.usedPercentage > alertThreshold) {
          console.warn(`High memory usage detected: ${info.usedPercentage.toFixed(1)}%`, {
            used: `${(info.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
            limit: `${(info.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
            trend: info.trend
          });
        }
      }
    };

    // Initial measurement
    monitor();
    
    // Set up interval
    intervalRef.current = setInterval(monitor, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isSupported, intervalMs, alertThreshold, getMemoryInfo]);

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
