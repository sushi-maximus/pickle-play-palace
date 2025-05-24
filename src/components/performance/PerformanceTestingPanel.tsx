
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  TestTube, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { usePerformanceTesting } from '@/hooks/performance/usePerformanceTesting';
import { usePerformanceBenchmark } from '@/hooks/performance/usePerformanceBenchmark';
import { usePerformanceValidation } from '@/hooks/performance/usePerformanceValidation';

interface PerformanceTestingPanelProps {
  className?: string;
}

export const PerformanceTestingPanel = ({ className = '' }: PerformanceTestingPanelProps) => {
  const {
    tests,
    results: testResults,
    isRunning: testsRunning,
    runAllTests,
    addBuiltInTests,
    clearResults: clearTestResults,
    totalTests,
    passedTests,
    failedTests,
    averageTestTime
  } = usePerformanceTesting({ logResults: true });

  const {
    benchmarks,
    results: benchmarkResults,
    isRunning: benchmarksRunning,
    currentTest,
    runAllBenchmarks,
    addBuiltInBenchmarks,
    clearResults: clearBenchmarkResults
  } = usePerformanceBenchmark();

  const {
    rules,
    reports,
    isValidating,
    runValidation,
    addBuiltInRules,
    clearReports,
    latestReport,
    validationScore
  } = usePerformanceValidation();

  // Initialize built-in tests on mount
  useEffect(() => {
    if (tests.length === 0) {
      addBuiltInTests();
    }
    if (benchmarks.length === 0) {
      addBuiltInBenchmarks();
    }
    if (rules.length === 0) {
      addBuiltInRules();
    }
  }, [tests.length, benchmarks.length, rules.length, addBuiltInTests, addBuiltInBenchmarks, addBuiltInRules]);

  const runAllTestSuites = async () => {
    await runAllTests();
    await runAllBenchmarks();
    await runValidation();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Performance Testing & Validation
          </h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive testing suite for performance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runAllTestSuites}
            disabled={testsRunning || benchmarksRunning || isValidating}
          >
            {(testsRunning || benchmarksRunning || isValidating) ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Test Suite Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Unit Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <div className="text-xs text-muted-foreground">
              {passedTests} passed, {failedTests} failed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benchmarks.length}</div>
            <div className="text-xs text-muted-foreground">
              {benchmarkResults.length} results
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validationScore}</div>
            <div className="text-xs text-muted-foreground">
              Performance Score
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageTestTime.toFixed(1)}ms
            </div>
            <div className="text-xs text-muted-foreground">
              Test execution
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Test Status */}
      {(testsRunning || benchmarksRunning || isValidating || currentTest) && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>
            {testsRunning && 'Running performance tests...'}
            {benchmarksRunning && currentTest && `Running benchmark: ${currentTest}`}
            {isValidating && 'Running validation rules...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Latest test execution results
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearTestResults}>
              Clear Results
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No test results yet</p>
          ) : (
            <div className="space-y-2">
              {testResults.slice(0, 10).map((result) => (
                <div key={`${result.testId}-${result.timestamp}`} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{result.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {result.duration.toFixed(2)}ms
                    </span>
                    {result.error && (
                      <Badge variant="destructive" className="text-xs">
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benchmark Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Benchmark Results</CardTitle>
              <CardDescription>
                Performance benchmarking results
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearBenchmarkResults}>
              Clear Results
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {benchmarkResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No benchmark results yet</p>
          ) : (
            <div className="space-y-4">
              {benchmarkResults.slice(0, 5).map((result) => (
                <div key={`${result.testId}-${result.timestamp}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.name}</span>
                    <Badge variant="outline">
                      {result.opsPerSecond.toFixed(0)} ops/sec
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>Avg: {result.averageTime.toFixed(3)}ms</div>
                    <div>Min: {result.minTime.toFixed(3)}ms</div>
                    <div>Max: {result.maxTime.toFixed(3)}ms</div>
                  </div>
                  <Progress 
                    value={(result.opsPerSecond / 10000) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Validation Report</CardTitle>
              <CardDescription>
                Performance validation rules and results
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={validationScore >= 80 ? "default" : "destructive"}>
                Score: {validationScore}/100
              </Badge>
              <Button variant="outline" size="sm" onClick={clearReports}>
                Clear Reports
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!latestReport ? (
            <p className="text-muted-foreground text-center py-4">No validation reports yet</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {latestReport.passedRules}
                  </div>
                  <div className="text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {latestReport.failedRules}
                  </div>
                  <div className="text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {latestReport.totalRules}
                  </div>
                  <div className="text-muted-foreground">Total</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                {latestReport.results.map(({ rule, result }, index) => (
                  <div key={index} className="flex items-start justify-between p-2 border rounded">
                    <div className="flex items-start gap-2">
                      {result.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-sm">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{result.message}</div>
                        {result.suggestion && (
                          <div className="text-xs text-blue-600 mt-1">💡 {result.suggestion}</div>
                        )}
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(rule.severity) as any}>
                      {rule.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
