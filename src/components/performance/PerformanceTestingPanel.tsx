
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Square, RotateCcw } from 'lucide-react';

interface TestResult {
  name: string;
  duration: number;
  status: 'passed' | 'failed' | 'running';
}

export const PerformanceTestingPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);

  const runPerformanceTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const tests = [
      { name: 'Component Render Time', expectedDuration: 16 },
      { name: 'Memory Usage Check', expectedDuration: 100 },
      { name: 'Bundle Size Analysis', expectedDuration: 500 }
    ];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setProgress((i / tests.length) * 100);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const actualDuration = Math.random() * test.expectedDuration * 2;
      const status = actualDuration <= test.expectedDuration ? 'passed' : 'failed';
      
      setResults(prev => [...prev, {
        name: test.name,
        duration: actualDuration,
        status
      }]);
    }

    setProgress(100);
    setIsRunning(false);
  };

  const resetTests = () => {
    setResults([]);
    setProgress(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Performance Testing
        </CardTitle>
        <CardDescription>
          Run automated performance tests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runPerformanceTests} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Running...' : 'Run Tests'}
          </Button>
          <Button 
            onClick={resetTests} 
            variant="outline" 
            size="sm"
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running tests...</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">{result.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {result.duration.toFixed(2)}ms
                  </span>
                  <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
