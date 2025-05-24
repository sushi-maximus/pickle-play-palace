
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  HardDrive, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  TestTube
} from 'lucide-react';
import { usePerformanceContext } from '@/contexts/PerformanceContext';
import { MetricsChart } from './MetricsChart';
import { ComponentMetricsTable } from './ComponentMetricsTable';
import { MemoryPressureIndicator } from './MemoryPressureIndicator';
import { PerformanceOptimizationPanel } from './PerformanceOptimizationPanel';
import { PerformanceTestingPanel } from './PerformanceTestingPanel';

interface PerformanceDashboardProps {
  className?: string;
}

export const PerformanceDashboard = ({ className = '' }: PerformanceDashboardProps) => {
  const {
    isEnabled,
    componentMetrics,
    memoryMetrics,
    togglePerformanceTracking,
    clearMetrics,
    getSlowComponents,
    getHighMemoryComponents
  } = usePerformanceContext();

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const slowComponents = getSlowComponents(16); // 16ms threshold
  const highMemoryComponents = getHighMemoryComponents(75); // 75% threshold
  const latestMemory = memoryMetrics[0];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isEnabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitoring
          </CardTitle>
          <CardDescription>
            Performance tracking is currently disabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={togglePerformanceTracking}>
            Enable Performance Tracking
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor component renders and memory usage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={clearMetrics}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={togglePerformanceTracking}>
            Disable Tracking
          </Button>
        </div>
      </div>

      {/* Alert for Performance Issues */}
      {(slowComponents.length > 0 || highMemoryComponents.length > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Performance issues detected: {slowComponents.length} slow components, {highMemoryComponents.length} high memory usage components
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Components Tracked</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{componentMetrics.length}</div>
            <p className="text-xs text-muted-foreground">
              Active components
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Render Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {componentMetrics.length > 0
                ? (componentMetrics.reduce((acc, m) => acc + m.averageRenderTime, 0) / componentMetrics.length).toFixed(1)
                : '0'}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Across all components
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMemory ? `${latestMemory.usedPercentage.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {latestMemory && getTrendIcon(latestMemory.trend)}
              <span>{latestMemory?.trend || 'No data'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {slowComponents.length + highMemoryComponents.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Performance warnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <ComponentMetricsTable 
            metrics={componentMetrics} 
            slowComponents={slowComponents}
            key={refreshKey}
          />
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Memory Pressure</CardTitle>
                <CardDescription>Current memory usage and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <MemoryPressureIndicator memoryMetrics={memoryMetrics} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High Memory Components</CardTitle>
                <CardDescription>Components with high memory usage</CardDescription>
              </CardHeader>
              <CardContent>
                {highMemoryComponents.length === 0 ? (
                  <p className="text-muted-foreground">No high memory usage detected</p>
                ) : (
                  <div className="space-y-2">
                    {highMemoryComponents.slice(0, 5).map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{metric.componentName}</span>
                        <Badge variant="destructive">
                          {metric.usedPercentage.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <MetricsChart 
            componentMetrics={componentMetrics}
            memoryMetrics={memoryMetrics}
            key={refreshKey}
          />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <PerformanceOptimizationPanel />
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <PerformanceTestingPanel />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Tracking Settings</CardTitle>
              <CardDescription>Configure performance monitoring options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Performance Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Monitor component renders and memory usage
                  </p>
                </div>
                <Badge variant={isEnabled ? "default" : "secondary"}>
                  {isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Points</p>
                  <p className="text-sm text-muted-foreground">
                    Components: {componentMetrics.length}, Memory samples: {memoryMetrics.length}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={clearMetrics}>
                  Clear All Data
                </Button>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Performance tracking is only active in development mode. 
                  It will be automatically disabled in production builds.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
