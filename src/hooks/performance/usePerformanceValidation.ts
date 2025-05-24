
import { useCallback, useState } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validator: (metrics: any) => ValidationResult;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

interface ValidationResult {
  passed: boolean;
  message: string;
  value?: number;
  expectedValue?: number;
  suggestion?: string;
}

interface ValidationReport {
  id: string;
  timestamp: number;
  totalRules: number;
  passedRules: number;
  failedRules: number;
  results: Array<{
    rule: ValidationRule;
    result: ValidationResult;
  }>;
  overallScore: number;
}

interface UsePerformanceValidationOptions {
  enabled?: boolean;
  autoValidate?: boolean;
  validationInterval?: number;
}

export const usePerformanceValidation = (options: UsePerformanceValidationOptions = {}) => {
  const { enabled = true, autoValidate = false, validationInterval = 30000 } = options;
  
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [reports, setReports] = useState<ValidationReport[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const { componentMetrics, memoryMetrics } = usePerformanceContext();

  const addRule = useCallback((rule: Omit<ValidationRule, 'id'>) => {
    if (!enabled) return;
    
    const newRule: ValidationRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random()}`
    };
    
    setRules(prev => [...prev, newRule]);
  }, [enabled]);

  const removeRule = useCallback((ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  }, []);

  const runValidation = useCallback(async (): Promise<ValidationReport> => {
    if (!enabled) {
      return {
        id: 'disabled',
        timestamp: Date.now(),
        totalRules: 0,
        passedRules: 0,
        failedRules: 0,
        results: [],
        overallScore: 100
      };
    }

    setIsValidating(true);

    const results: Array<{ rule: ValidationRule; result: ValidationResult }> = [];
    
    for (const rule of rules) {
      try {
        const result = rule.validator({ componentMetrics, memoryMetrics });
        results.push({ rule, result });
      } catch (error) {
        results.push({
          rule,
          result: {
            passed: false,
            message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            suggestion: 'Check the validation rule implementation'
          }
        });
      }
    }

    const passedRules = results.filter(r => r.result.passed).length;
    const failedRules = results.length - passedRules;
    
    // Calculate overall score based on severity
    let totalScore = 100;
    results.forEach(({ rule, result }) => {
      if (!result.passed) {
        switch (rule.severity) {
          case 'critical': totalScore -= 25; break;
          case 'error': totalScore -= 15; break;
          case 'warning': totalScore -= 8; break;
          case 'info': totalScore -= 3; break;
        }
      }
    });

    const report: ValidationReport = {
      id: `report-${Date.now()}`,
      timestamp: Date.now(),
      totalRules: rules.length,
      passedRules,
      failedRules,
      results,
      overallScore: Math.max(0, totalScore)
    };

    setReports(prev => [report, ...prev].slice(0, 20)); // Keep last 20 reports
    setIsValidating(false);

    return report;
  }, [enabled, rules, componentMetrics, memoryMetrics]);

  const clearReports = useCallback(() => {
    setReports([]);
  }, []);

  // Built-in validation rules
  const addBuiltInRules = useCallback(() => {
    // Render time validation
    addRule({
      name: 'Render Time Threshold',
      description: 'Components should render within 16ms for 60fps',
      severity: 'warning',
      validator: ({ componentMetrics }) => {
        const slowComponents = componentMetrics.filter((m: any) => m.averageRenderTime > 16);
        return {
          passed: slowComponents.length === 0,
          message: slowComponents.length === 0 
            ? 'All components render within acceptable time'
            : `${slowComponents.length} components exceed 16ms render time`,
          value: slowComponents.length,
          expectedValue: 0,
          suggestion: 'Consider using React.memo() or optimizing expensive computations'
        };
      }
    });

    // Memory usage validation
    addRule({
      name: 'Memory Usage Limit',
      description: 'Memory usage should stay below 75%',
      severity: 'error',
      validator: ({ memoryMetrics }) => {
        const latestMemory = memoryMetrics[0];
        const usage = latestMemory?.usedPercentage || 0;
        return {
          passed: usage < 75,
          message: usage < 75 
            ? 'Memory usage is within acceptable limits'
            : `Memory usage is high: ${usage.toFixed(1)}%`,
          value: usage,
          expectedValue: 75,
          suggestion: 'Consider implementing cleanup operations or lazy loading'
        };
      }
    });

    // Excessive re-renders validation
    addRule({
      name: 'Excessive Re-renders',
      description: 'Components should not re-render excessively',
      severity: 'warning',
      validator: ({ componentMetrics }) => {
        const excessiveComponents = componentMetrics.filter((m: any) => m.renderCount > 50);
        return {
          passed: excessiveComponents.length === 0,
          message: excessiveComponents.length === 0
            ? 'No excessive re-renders detected'
            : `${excessiveComponents.length} components have excessive re-renders`,
          value: excessiveComponents.length,
          expectedValue: 0,
          suggestion: 'Check prop dependencies and consider useCallback/useMemo'
        };
      }
    });

    // Memory trend validation
    addRule({
      name: 'Memory Trend',
      description: 'Memory usage should not consistently increase',
      severity: 'error',
      validator: ({ memoryMetrics }) => {
        if (memoryMetrics.length < 5) {
          return {
            passed: true,
            message: 'Insufficient data for trend analysis'
          };
        }
        
        const recentMetrics = memoryMetrics.slice(0, 5);
        const increasingCount = recentMetrics.filter((m: any) => m.trend === 'increasing').length;
        
        return {
          passed: increasingCount < 4,
          message: increasingCount < 4
            ? 'Memory trend is stable'
            : 'Memory usage is consistently increasing',
          value: increasingCount,
          expectedValue: 3,
          suggestion: 'Check for memory leaks and implement proper cleanup'
        };
      }
    });
  }, [addRule]);

  return {
    rules,
    reports,
    isValidating,
    addRule,
    removeRule,
    runValidation,
    clearReports,
    addBuiltInRules,
    isEnabled: enabled,
    // Latest report summary
    latestReport: reports[0] || null,
    validationScore: reports[0]?.overallScore || 100
  };
};
