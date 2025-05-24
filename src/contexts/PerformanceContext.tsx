import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

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
    setComponentMetrics(prev => {
      // Update existing component or add new one
      const existingIndex = prev.findIndex(m => m.componentName === metrics.componentName);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = metrics;
        return updated;
      }
      return [...prev, metrics];
    });
  }, []);

  const addMemoryMetrics = useCallback((metrics: MemoryMetrics) => {
    setMemoryMetrics(prev => {
      // Keep only the last 50 memory metrics to prevent memory buildup
      const updated = [metrics, ...prev].slice(0, 50);
      return updated;
    });
  }, []);

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

  const value = {
    isEnabled,
    componentMetrics,
    memoryMetrics,
    togglePerformanceTracking,
    addComponentMetrics,
    addMemoryMetrics,
    clearMetrics,
    getSlowComponents,
    getHighMemoryComponents
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
