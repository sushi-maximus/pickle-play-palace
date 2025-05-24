
import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface ComponentMetrics {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
  timestamp: number;
}

interface PerformanceContextType {
  isEnabled: boolean;
  componentMetrics: ComponentMetrics[];
  togglePerformanceTracking: () => void;
  addComponentMetrics: (metrics: ComponentMetrics) => void;
  clearMetrics: () => void;
  getSlowComponents: (threshold?: number) => ComponentMetrics[];
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const PerformanceProvider = ({ children, enabled = false }: PerformanceProviderProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [componentMetrics, setComponentMetrics] = useState<ComponentMetrics[]>([]);

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

  const clearMetrics = useCallback(() => {
    setComponentMetrics([]);
    console.log('Performance metrics cleared');
  }, []);

  const getSlowComponents = useCallback((threshold = 16) => {
    return componentMetrics.filter(metric => metric.averageRenderTime > threshold);
  }, [componentMetrics]);

  const value = {
    isEnabled,
    componentMetrics,
    togglePerformanceTracking,
    addComponentMetrics,
    clearMetrics,
    getSlowComponents
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
