import { useRef, useEffect, useState, useCallback } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

interface OptimizationSuggestion {
  id: string;
  type: 'memoization' | 'bundle' | 'render' | 'memory';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  issue: string;
  suggestion: string;
  impact: string;
  timestamp: number;
}

interface BundleAnalysis {
  estimatedSize: number;
  componentsCount: number;
  hooksCount: number;
  importsCount: number;
  lastAnalyzed: number;
}

interface UsePerformanceOptimizationOptions {
  enabled?: boolean;
  analysisInterval?: number;
  suggestionThreshold?: number;
}

export const usePerformanceOptimization = (
  options: UsePerformanceOptimizationOptions = {}
) => {
  const {
    enabled = process.env.NODE_ENV === 'development',
    analysisInterval = 10000,
    suggestionThreshold = 16
  } = options;

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [bundleAnalysis, setBundleAnalysis] = useState<BundleAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { componentMetrics, memoryMetrics } = usePerformanceContext();
  const analysisRef = useRef<NodeJS.Timeout>();

  const generateSuggestions = useCallback(() => {
    if (!enabled) return;

    const newSuggestions: OptimizationSuggestion[] = [];

    // Analyze slow components
    componentMetrics.forEach(metric => {
      if (metric.averageRenderTime > suggestionThreshold) {
        const severity = metric.averageRenderTime > 50 ? 'critical' : 
                        metric.averageRenderTime > 32 ? 'high' : 'medium';

        newSuggestions.push({
          id: `render-${metric.componentName}-${Date.now()}`,
          type: 'render',
          severity,
          component: metric.componentName,
          issue: `Component renders in ${metric.averageRenderTime.toFixed(2)}ms`,
          suggestion: 'Consider using React.memo() or useMemo() for expensive computations',
          impact: `Could improve render time by 20-40%`,
          timestamp: Date.now()
        });
      }

      // Check for excessive re-renders
      if (metric.renderCount > 50) {
        newSuggestions.push({
          id: `rerender-${metric.componentName}-${Date.now()}`,
          type: 'memoization',
          severity: 'medium',
          component: metric.componentName,
          issue: `Component has re-rendered ${metric.renderCount} times`,
          suggestion: 'Check props dependencies and consider useCallback/useMemo',
          impact: 'Reduce unnecessary re-renders',
          timestamp: Date.now()
        });
      }
    });

    // Analyze memory usage
    const latestMemory = memoryMetrics[0];
    if (latestMemory && latestMemory.usedPercentage > 80) {
      newSuggestions.push({
        id: `memory-${Date.now()}`,
        type: 'memory',
        severity: latestMemory.usedPercentage > 90 ? 'critical' : 'high',
        component: 'Global',
        issue: `High memory usage: ${latestMemory.usedPercentage.toFixed(1)}%`,
        suggestion: 'Consider implementing lazy loading or component cleanup',
        impact: 'Reduce memory pressure and improve performance',
        timestamp: Date.now()
      });
    }

    // Bundle size analysis
    const componentCount = componentMetrics.length;
    if (componentCount > 20) {
      newSuggestions.push({
        id: `bundle-${Date.now()}`,
        type: 'bundle',
        severity: 'medium',
        component: 'Application',
        issue: `High number of tracked components: ${componentCount}`,
        suggestion: 'Consider code splitting and lazy loading for route components',
        impact: 'Reduce initial bundle size',
        timestamp: Date.now()
      });
    }

    setSuggestions(prev => {
      // Keep only recent suggestions (last 10)
      const recent = [...newSuggestions, ...prev].slice(0, 10);
      return recent;
    });
  }, [componentMetrics, memoryMetrics, enabled, suggestionThreshold]);

  const analyzeBundleSize = useCallback(() => {
    if (!enabled) return;

    setIsAnalyzing(true);

    // Simulate bundle analysis (in a real app, this would use webpack-bundle-analyzer data)
    setTimeout(() => {
      const analysis: BundleAnalysis = {
        estimatedSize: componentMetrics.length * 5 + Math.random() * 100, // KB estimate
        componentsCount: componentMetrics.length,
        hooksCount: componentMetrics.length * 2, // Estimate
        importsCount: componentMetrics.length * 3, // Estimate
        lastAnalyzed: Date.now()
      };

      setBundleAnalysis(analysis);
      setIsAnalyzing(false);
    }, 2000);
  }, [componentMetrics, enabled]);

  const dismissSuggestion = useCallback((id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearAllSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Auto-generate suggestions periodically
  useEffect(() => {
    if (!enabled) return;

    analysisRef.current = setInterval(generateSuggestions, analysisInterval);

    return () => {
      if (analysisRef.current) {
        clearInterval(analysisRef.current);
      }
    };
  }, [generateSuggestions, analysisInterval, enabled]);

  // Initial analysis
  useEffect(() => {
    if (enabled && componentMetrics.length > 0) {
      generateSuggestions();
    }
  }, [generateSuggestions, componentMetrics.length, enabled]);

  return {
    suggestions,
    bundleAnalysis,
    isAnalyzing,
    generateSuggestions,
    analyzeBundleSize,
    dismissSuggestion,
    clearAllSuggestions,
    isEnabled: enabled
  };
};
