
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';

interface ComponentMetrics {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
  timestamp: number;
}

interface MemoryMetrics {
  componentName: string;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: number;
}

interface PerformanceContextType {
  isEnabled: boolean;
  componentMetrics: ComponentMetrics[];
  memoryMetrics: MemoryMetrics[];
  togglePerformanceTracking: () => void;
  addComponentMetrics: (metrics: ComponentMetrics) => void;
  addMemoryMetrics: (metrics: MemoryMetrics) => void;
  clearMetrics: () => void;
  getSlowComponents: (threshold?: number) => ComponentMetrics[];
  getHighMemoryComponents: (threshold?: number) => MemoryMetrics[];
  // New methods for hook integration
  registerComponent: (componentName: string) => void;
  updateComponentMetrics: (componentName: string, renderTime: number) => void;
  updateMemoryMetrics: (memoryInfo: any) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const PerformanceProvider = ({ children, enabled = false }: PerformanceProviderProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [componentMetrics, setComponentMetrics] = useState<ComponentMetrics[]>([]);
  const [memoryMetrics, setMemoryMetrics] = useState<MemoryMetrics[]>([]);

  const togglePerformanceTracking = useCallback(() => {
    setIsEnabled(prev => !prev);
    console.log(`Performance tracking ${!isEnabled ? 'enabled' : 'disabled'}`);
  }, [isEnabled]);

  const addComponentMetrics = useCallback((metrics: ComponentMetrics) => {
    if (!isEnabled) return;
    
    setComponentMetrics(prev => {
      const existingIndex = prev.findIndex(m => m.componentName === metrics.componentName);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = metrics;
        return updated;
      }
      return [...prev, metrics];
    });
  }, [isEnabled]);

  const addMemoryMetrics = useCallback((metrics: MemoryMetrics) => {
    if (!isEnabled) return;
    
    setMemoryMetrics(prev => {
      const updated = [metrics, ...prev].slice(0, 50);
      return updated;
    });
  }, [isEnabled]);

  const clearMetrics = useCallback(() => {
    setComponentMetrics([]);
    setMemoryMetrics([]);
    console.log('Performance metrics cleared');
  }, []);

  const getSlowComponents = useCallback((threshold = 16) => {
    return componentMetrics.filter(metric => metric.averageRenderTime > threshold);
  }, [componentMetrics]);

  const getHighMemoryComponents = useCallback((threshold = 80) => {
    return memoryMetrics.filter(metric => metric.usedPercentage > threshold);
  }, [memoryMetrics]);

  // New methods for hook integration
  const registerComponent = useCallback((componentName: string) => {
    if (!isEnabled) return;
    
    console.log(`Registering component for performance tracking: ${componentName}`);
  }, [isEnabled]);

  const updateComponentMetrics = useCallback((componentName: string, renderTime: number) => {
    if (!isEnabled) return;

    setComponentMetrics(prev => {
      const existing = prev.find(m => m.componentName === componentName);
      
      if (existing) {
        const newRenderCount = existing.renderCount + 1;
        const newTotalTime = existing.totalRenderTime + renderTime;
        const newAverageTime = newTotalTime / newRenderCount;

        const updated = {
          ...existing,
          renderCount: newRenderCount,
          lastRenderTime: renderTime,
          averageRenderTime: newAverageTime,
          totalRenderTime: newTotalTime,
          timestamp: Date.now()
        };

        return prev.map(m => m.componentName === componentName ? updated : m);
      } else {
        const newMetric: ComponentMetrics = {
          componentName,
          renderCount: 1,
          lastRenderTime: renderTime,
          averageRenderTime: renderTime,
          totalRenderTime: renderTime,
          timestamp: Date.now()
        };
        return [...prev, newMetric];
      }
    });
  }, [isEnabled]);

  const updateMemoryMetrics = useCallback((memoryInfo: any) => {
    if (!isEnabled || !memoryInfo) return;

    const metrics: MemoryMetrics = {
      componentName: 'Global',
      usedJSHeapSize: memoryInfo.usedJSHeapSize,
      totalJSHeapSize: memoryInfo.totalJSHeapSize,
      jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
      usedPercentage: memoryInfo.usedPercentage,
      trend: memoryInfo.trend,
      timestamp: Date.now()
    };

    addMemoryMetrics(metrics);
  }, [isEnabled, addMemoryMetrics]);

  // Global memory monitoring
  useEffect(() => {
    if (!isEnabled || !('memory' in performance)) return;

    const interval = setInterval(() => {
      try {
        const memory = (performance as any).memory;
        const usedPercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        updateMemoryMetrics({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          usedPercentage,
          trend: 'stable' // Simple implementation for now
        });
      } catch (error) {
        console.warn('Failed to collect memory metrics:', error);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [isEnabled, updateMemoryMetrics]);

  const value = {
    isEnabled,
    componentMetrics,
    memoryMetrics,
    togglePerformanceTracking,
    addComponentMetrics,
    addMemoryMetrics,
    clearMetrics,
    getSlowComponents,
    getHighMemoryComponents,
    registerComponent,
    updateComponentMetrics,
    updateMemoryMetrics
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformanceContext = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  return context;
};
