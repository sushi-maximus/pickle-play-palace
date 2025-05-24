
export { usePerformanceMetrics } from './usePerformanceMetrics';
export { useRenderTracker } from './useRenderTracker';
export { useMemoryUsage } from './useMemoryUsage';
export { useMemoryLeakDetector } from './useMemoryLeakDetector';
export { useMemoryPressure } from './useMemoryPressure';
export { PerformanceProvider, usePerformanceContext } from '../../contexts/PerformanceContext';

// Re-export dashboard components for convenience
export { 
  PerformanceDashboard,
  MetricsChart,
  ComponentMetricsTable,
  MemoryPressureIndicator 
} from '../../components/performance';
