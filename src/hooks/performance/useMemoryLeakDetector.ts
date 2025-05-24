
import { useEffect, useRef, useCallback } from 'react';

interface LeakDetectionOptions {
  enabled?: boolean;
  componentName?: string;
  trackObjects?: boolean;
  alertThreshold?: number; // Number of retained objects to trigger alert
}

interface LeakInfo {
  componentName: string;
  retainedObjects: number;
  timestamp: number;
  potential: boolean;
}

// Check if WeakRef is supported
const isWeakRefSupported = typeof WeakRef !== 'undefined';

export const useMemoryLeakDetector = (options: LeakDetectionOptions = {}) => {
  const { 
    enabled = true, 
    componentName = 'Unknown',
    trackObjects = true,
    alertThreshold = 10
  } = options;
  
  const objectsRef = useRef<any[]>([]);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);
  const mountTimeRef = useRef<number>(Date.now());

  // Register an object for leak tracking
  const trackObject = useCallback((obj: object, name?: string) => {
    if (!enabled || !trackObjects || !isWeakRefSupported) return;
    
    try {
      const weakRef = new (window as any).WeakRef(obj);
      objectsRef.current.push(weakRef);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Tracking object ${name || 'unnamed'} in ${componentName}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('WeakRef not supported, skipping object tracking');
      }
    }
  }, [enabled, trackObjects, componentName]);

  // Register a cleanup function
  const registerCleanup = useCallback((cleanupFn: () => void) => {
    if (!enabled) return;
    cleanupFunctionsRef.current.push(cleanupFn);
  }, [enabled]);

  // Check for potential memory leaks
  const checkForLeaks = useCallback((): LeakInfo => {
    const now = Date.now();
    let retainedCount = 0;
    
    if (isWeakRefSupported) {
      const aliveObjects = objectsRef.current.filter(ref => {
        try {
          return ref.deref() !== undefined;
        } catch {
          return false;
        }
      });
      retainedCount = aliveObjects.length;
    }
    
    const leakInfo: LeakInfo = {
      componentName,
      retainedObjects: retainedCount,
      timestamp: now,
      potential: retainedCount > alertThreshold
    };

    if (leakInfo.potential) {
      console.warn(`Potential memory leak detected in ${componentName}:`, {
        retainedObjects: retainedCount,
        threshold: alertThreshold,
        componentAge: `${((now - mountTimeRef.current) / 1000).toFixed(1)}s`
      });
    }

    return leakInfo;
  }, [componentName, alertThreshold]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!enabled) return;

      // Execute all registered cleanup functions
      cleanupFunctionsRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error(`Cleanup function failed in ${componentName}:`, error);
        }
      });

      // Check for leaks one final time
      setTimeout(() => {
        const finalCheck = checkForLeaks();
        if (finalCheck.potential) {
          console.warn(`Component ${componentName} unmounted with potential memory leaks`);
        }
      }, 1000); // Allow time for garbage collection
    };
  }, [enabled, componentName, checkForLeaks]);

  // Periodic leak checking while mounted
  useEffect(() => {
    if (!enabled || !isWeakRefSupported) return;

    const interval = setInterval(() => {
      checkForLeaks();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [enabled, checkForLeaks]);

  return {
    trackObject,
    registerCleanup,
    checkForLeaks,
    isEnabled: enabled,
    isSupported: isWeakRefSupported
  };
};
