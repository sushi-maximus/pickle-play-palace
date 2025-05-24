
import { useRef, useCallback, useState } from 'react';

interface BenchmarkTest {
  id: string;
  name: string;
  description: string;
  iterations: number;
  testFn: () => void | Promise<void>;
}

interface BenchmarkResult {
  testId: string;
  name: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  opsPerSecond: number;
  timestamp: number;
}

interface UsePerformanceBenchmarkOptions {
  enabled?: boolean;
  defaultIterations?: number;
}

export const usePerformanceBenchmark = (options: UsePerformanceBenchmarkOptions = {}) => {
  const { enabled = true, defaultIterations = 1000 } = options;
  
  const [benchmarks, setBenchmarks] = useState<BenchmarkTest[]>([]);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const addBenchmark = useCallback((benchmark: Omit<BenchmarkTest, 'id'>) => {
    if (!enabled) return;
    
    const newBenchmark: BenchmarkTest = {
      ...benchmark,
      id: `bench-${Date.now()}-${Math.random()}`,
      iterations: benchmark.iterations || defaultIterations
    };
    
    setBenchmarks(prev => [...prev, newBenchmark]);
  }, [enabled, defaultIterations]);

  const runBenchmark = useCallback(async (benchmark: BenchmarkTest): Promise<BenchmarkResult> => {
    const times: number[] = [];
    setCurrentTest(benchmark.name);

    // Warm up
    for (let i = 0; i < 10; i++) {
      await benchmark.testFn();
    }

    // Run benchmark
    for (let i = 0; i < benchmark.iterations; i++) {
      const start = performance.now();
      await benchmark.testFn();
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((acc, time) => acc + time, 0);
    const averageTime = totalTime / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const opsPerSecond = 1000 / averageTime;

    setCurrentTest(null);

    return {
      testId: benchmark.id,
      name: benchmark.name,
      iterations: benchmark.iterations,
      totalTime,
      averageTime,
      minTime,
      maxTime,
      opsPerSecond,
      timestamp: Date.now()
    };
  }, []);

  const runAllBenchmarks = useCallback(async () => {
    if (!enabled || isRunning) return;
    
    setIsRunning(true);
    const benchmarkResults: BenchmarkResult[] = [];

    for (const benchmark of benchmarks) {
      try {
        const result = await runBenchmark(benchmark);
        benchmarkResults.push(result);
        
        console.log(`Benchmark: ${result.name}`);
        console.log(`  Average: ${result.averageTime.toFixed(3)}ms`);
        console.log(`  Ops/sec: ${result.opsPerSecond.toFixed(0)}`);
        console.log(`  Range: ${result.minTime.toFixed(3)}ms - ${result.maxTime.toFixed(3)}ms`);
      } catch (error) {
        console.error(`Benchmark failed: ${benchmark.name}`, error);
      }
    }

    setResults(prev => [...benchmarkResults, ...prev].slice(0, 50));
    setIsRunning(false);
    
    return benchmarkResults;
  }, [enabled, isRunning, benchmarks, runBenchmark]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const removeBenchmark = useCallback((benchmarkId: string) => {
    setBenchmarks(prev => prev.filter(b => b.id !== benchmarkId));
  }, []);

  // Built-in benchmarks
  const addBuiltInBenchmarks = useCallback(() => {
    // DOM manipulation benchmark
    addBenchmark({
      name: 'DOM Manipulation',
      description: 'Measures DOM element creation and manipulation speed',
      iterations: 1000,
      testFn: () => {
        const div = document.createElement('div');
        div.className = 'test-element';
        div.textContent = 'Benchmark test';
        document.body.appendChild(div);
        document.body.removeChild(div);
      }
    });

    // Array operations benchmark
    addBenchmark({
      name: 'Array Operations',
      description: 'Measures array creation and manipulation speed',
      iterations: 10000,
      testFn: () => {
        const arr = Array.from({ length: 100 }, (_, i) => i);
        arr.map(x => x * 2).filter(x => x > 50).reduce((acc, x) => acc + x, 0);
      }
    });

    // Object operations benchmark
    addBenchmark({
      name: 'Object Operations',
      description: 'Measures object creation and property access speed',
      iterations: 10000,
      testFn: () => {
        const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
        Object.keys(obj).forEach(key => obj[key] * 2);
      }
    });
  }, [addBenchmark]);

  return {
    benchmarks,
    results,
    isRunning,
    currentTest,
    addBenchmark,
    runBenchmark,
    runAllBenchmarks,
    clearResults,
    removeBenchmark,
    addBuiltInBenchmarks,
    isEnabled: enabled
  };
};
