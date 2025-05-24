
export { usePerformanceMetrics } from './usePerformanceMetrics';
export { useRenderTracker } from './useRenderTracker';
export { useMemoryUsage } from './useMemoryUsage';
export { useMemoryLeakDetector } from './useMemoryLeakDetector';
export { useMemoryPressure } from './useMemoryPressure';
export { usePerformanceMonitoring } from './usePerformanceMonitoring';
export { usePerformanceOptimization } from './usePerformanceOptimization';
export { usePerformanceTesting } from './usePerformanceTesting';
export { usePerformanceBenchmark } from './usePerformanceBenchmark';
export { usePerformanceValidation } from './usePerformanceValidation';
export { PerformanceProvider, usePerformanceContext } from '../../contexts/PerformanceContext';

// Re-export dashboard components for convenience
export { 
  PerformanceDashboard,
  MetricsChart,
  ComponentMetricsTable,
  MemoryPressureIndicator,
  PerformanceOptimizationPanel,
  PerformanceTestingPanel
} from '../../components/performance';
