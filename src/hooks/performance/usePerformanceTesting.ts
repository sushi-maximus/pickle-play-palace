
import { useRef, useCallback, useState } from 'react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';

interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  testFn: () => Promise<void> | void;
  expectedMaxTime?: number;
  expectedMinTime?: number;
}

interface TestResult {
  testId: string;
  name: string;
  duration: number;
  passed: boolean;
  error?: string;
  timestamp: number;
}

interface UsePerformanceTestingOptions {
  enabled?: boolean;
  autoRun?: boolean;
  logResults?: boolean;
}

export const usePerformanceTesting = (options: UsePerformanceTestingOptions = {}) => {
  const { enabled = true, autoRun = false, logResults = true } = options;
  
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const testsRef = useRef<PerformanceTest[]>([]);

  const { componentMetrics } = usePerformanceContext();

  const addTest = useCallback((test: PerformanceTest) => {
    if (!enabled) return;
    
    const newTest = { ...test, id: `test-${Date.now()}-${Math.random()}` };
    setTests(prev => [...prev, newTest]);
    testsRef.current = [...testsRef.current, newTest];
  }, [enabled]);

  const runTest = useCallback(async (test: PerformanceTest): Promise<TestResult> => {
    const startTime = performance.now();
    let passed = true;
    let error: string | undefined;

    try {
      await test.testFn();
      const duration = performance.now() - startTime;
      
      // Check duration constraints
      if (test.expectedMaxTime && duration > test.expectedMaxTime) {
        passed = false;
        error = `Test exceeded maximum time: ${duration.toFixed(2)}ms > ${test.expectedMaxTime}ms`;
      }
      
      if (test.expectedMinTime && duration < test.expectedMinTime) {
        passed = false;
        error = `Test completed too quickly: ${duration.toFixed(2)}ms < ${test.expectedMinTime}ms`;
      }

      return {
        testId: test.id,
        name: test.name,
        duration,
        passed,
        error,
        timestamp: Date.now()
      };
    } catch (err) {
      const duration = performance.now() - startTime;
      return {
        testId: test.id,
        name: test.name,
        duration,
        passed: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }, []);

  const runAllTests = useCallback(async () => {
    if (!enabled || isRunning) return;
    
    setIsRunning(true);
    const testResults: TestResult[] = [];

    for (const test of tests) {
      const result = await runTest(test);
      testResults.push(result);
      
      if (logResults) {
        const status = result.passed ? '✅' : '❌';
        console.log(`${status} ${result.name}: ${result.duration.toFixed(2)}ms`);
        if (result.error) {
          console.error(`   Error: ${result.error}`);
        }
      }
    }

    setResults(prev => [...testResults, ...prev].slice(0, 100)); // Keep last 100 results
    setIsRunning(false);
    
    return testResults;
  }, [enabled, isRunning, tests, runTest, logResults]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const removeTest = useCallback((testId: string) => {
    setTests(prev => prev.filter(t => t.id !== testId));
    testsRef.current = testsRef.current.filter(t => t.id !== testId);
  }, []);

  // Built-in performance tests
  const addBuiltInTests = useCallback(() => {
    // Component render performance test
    addTest({
      id: 'render-performance',
      name: 'Component Render Performance',
      description: 'Tests if all components render within acceptable time limits',
      expectedMaxTime: 50,
      testFn: () => {
        const slowComponents = componentMetrics.filter(m => m.averageRenderTime > 50);
        if (slowComponents.length > 0) {
          throw new Error(`Found ${slowComponents.length} slow components`);
        }
      }
    });

    // Memory usage test
    addTest({
      id: 'memory-usage',
      name: 'Memory Usage Test',
      description: 'Tests if memory usage is within acceptable limits',
      testFn: () => {
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          if (usagePercent > 85) {
            throw new Error(`High memory usage: ${usagePercent.toFixed(1)}%`);
          }
        }
      }
    });

    // Render count test
    addTest({
      id: 'excessive-renders',
      name: 'Excessive Renders Test',
      description: 'Tests for components with too many renders',
      testFn: () => {
        const excessiveComponents = componentMetrics.filter(m => m.renderCount > 100);
        if (excessiveComponents.length > 0) {
          throw new Error(`Found ${excessiveComponents.length} components with excessive renders`);
        }
      }
    });
  }, [addTest, componentMetrics]);

  return {
    tests,
    results,
    isRunning,
    addTest,
    runTest,
    runAllTests,
    clearResults,
    removeTest,
    addBuiltInTests,
    isEnabled: enabled,
    // Statistics
    totalTests: tests.length,
    passedTests: results.filter(r => r.passed).length,
    failedTests: results.filter(r => !r.passed).length,
    averageTestTime: results.length > 0 ? results.reduce((acc, r) => acc + r.duration, 0) / results.length : 0
  };
};
