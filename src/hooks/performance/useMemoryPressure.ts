
import { useState, useEffect, useCallback, useRef } from 'react';

interface MemoryPressureInfo {
  level: 'low' | 'medium' | 'high' | 'critical';
  usagePercentage: number;
  recommendation: string;
  shouldCleanup: boolean;
}

interface UseMemoryPressureOptions {
  enabled?: boolean;
  checkIntervalMs?: number;
  thresholds?: {
    medium: number;
    high: number;
    critical: number;
  };
}

const DEFAULT_THRESHOLDS = {
  medium: 60,
  high: 75,
  critical: 90
};

export const useMemoryPressure = (options: UseMemoryPressureOptions = {}) => {
  const {
    enabled = true,
    checkIntervalMs = 10000,
    thresholds = DEFAULT_THRESHOLDS
  } = options;

  const [pressureInfo, setPressureInfo] = useState<MemoryPressureInfo>({
    level: 'low',
    usagePercentage: 0,
    recommendation: 'Memory usage is normal',
    shouldCleanup: false
  });

  const [isSupported, setIsSupported] = useState(false);
  const cleanupCallbacksRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    setIsSupported('memory' in performance);
  }, []);

  const assessMemoryPressure = useCallback((): MemoryPressureInfo => {
    if (!isSupported || !('memory' in performance)) {
      return {
        level: 'low',
        usagePercentage: 0,
        recommendation: 'Memory monitoring not supported',
        shouldCleanup: false
      };
    }

    const memory = (performance as any).memory;
    const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

    let level: MemoryPressureInfo['level'] = 'low';
    let recommendation = 'Memory usage is normal';
    let shouldCleanup = false;

    if (usagePercentage >= thresholds.critical) {
      level = 'critical';
      recommendation = 'Critical memory usage! Immediate cleanup required';
      shouldCleanup = true;
    } else if (usagePercentage >= thresholds.high) {
      level = 'high';
      recommendation = 'High memory usage. Consider cleanup operations';
      shouldCleanup = true;
    } else if (usagePercentage >= thresholds.medium) {
      level = 'medium';
      recommendation = 'Moderate memory usage. Monitor closely';
      shouldCleanup = false;
    }

    return {
      level,
      usagePercentage,
      recommendation,
      shouldCleanup
    };
  }, [isSupported, thresholds]);

  // Register cleanup callback
  const registerCleanupCallback = useCallback((callback: () => void) => {
    cleanupCallbacksRef.current.push(callback);
  }, []);

  // Execute cleanup callbacks
  const executeCleanup = useCallback(() => {
    console.log('Executing memory pressure cleanup callbacks');
    cleanupCallbacksRef.current.forEach((callback, index) => {
      try {
        callback();
      } catch (error) {
        console.error(`Cleanup callback ${index} failed:`, error);
      }
    });
  }, []);

  // Monitor memory pressure
  useEffect(() => {
    if (!enabled || !isSupported) return;

    const monitor = () => {
      const newPressureInfo = assessMemoryPressure();
      setPressureInfo(newPressureInfo);

      // Auto-execute cleanup if critical
      if (newPressureInfo.shouldCleanup && newPressureInfo.level === 'critical') {
        executeCleanup();
      }

      // Log pressure changes
      if (newPressureInfo.level !== 'low') {
        console.warn(`Memory pressure: ${newPressureInfo.level}`, {
          usage: `${newPressureInfo.usagePercentage.toFixed(1)}%`,
          recommendation: newPressureInfo.recommendation
        });
      }
    };

    // Initial check
    monitor();

    // Set up interval
    const interval = setInterval(monitor, checkIntervalMs);

    return () => clearInterval(interval);
  }, [enabled, isSupported, checkIntervalMs, assessMemoryPressure, executeCleanup]);

  return {
    pressureInfo,
    isSupported,
    registerCleanupCallback,
    executeCleanup,
    assessMemoryPressure
  };
};
