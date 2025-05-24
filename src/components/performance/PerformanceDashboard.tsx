
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { bundleAnalyzer } from "@/utils/bundleAnalyzer";
import { smartCache } from "@/utils/smartCacheManager";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const PerformanceDashboard = () => {
  const { metrics, navigationTiming, getMemoryUsage } = usePerformanceMonitor();
  const [bundleMetrics, setBundleMetrics] = useState(bundleAnalyzer.getMetrics());
  const [cacheStats, setCacheStats] = useState(smartCache.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setBundleMetrics(bundleAnalyzer.getMetrics());
      setCacheStats(smartCache.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAnalyzeBundle = () => {
    const newMetrics = bundleAnalyzer.analyzeBundle();
    setBundleMetrics(bundleAnalyzer.getMetrics());
    console.log('Bundle analysis completed:', newMetrics);
  };

  const latestBundle = bundleMetrics[bundleMetrics.length - 1];
  const memoryUsage = getMemoryUsage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Navigation Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Load Performance</CardTitle>
            <CardDescription>Initial page load metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {navigationTiming ? (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DOM Content Loaded:</span>
                  <Badge variant="outline">{navigationTiming.domContentLoaded.toFixed(0)}ms</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Load Complete:</span>
                  <Badge variant="outline">{navigationTiming.loadComplete.toFixed(0)}ms</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">First Paint:</span>
                  <Badge variant="outline">{navigationTiming.firstPaint.toFixed(0)}ms</Badge>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Loading metrics...</p>
            )}
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Memory Usage</CardTitle>
            <CardDescription>Current memory consumption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {memoryUsage ? (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Used:</span>
                  <Badge variant={memoryUsage.percentage > 80 ? "destructive" : "outline"}>
                    {memoryUsage.percentage.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Heap Size:</span>
                  <Badge variant="outline">{(memoryUsage.used / 1024 / 1024).toFixed(1)}MB</Badge>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Memory info not available</p>
            )}
          </CardContent>
        </Card>

        {/* Bundle Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bundle Size</CardTitle>
            <CardDescription>App bundle metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestBundle ? (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Size:</span>
                  <Badge variant={latestBundle.estimatedSize > 400 ? "destructive" : "outline"}>
                    {latestBundle.estimatedSize}KB
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Components:</span>
                  <Badge variant="outline">{latestBundle.componentCount}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Chunks:</span>
                  <Badge variant="outline">{latestBundle.chunkCount}</Badge>
                </div>
                <Button onClick={handleAnalyzeBundle} size="sm" className="w-full">
                  Re-analyze
                </Button>
              </>
            ) : (
              <Button onClick={handleAnalyzeBundle} size="sm" className="w-full">
                Analyze Bundle
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Cache Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cache Performance</CardTitle>
            <CardDescription>Smart cache statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cache Size:</span>
              <Badge variant="outline">{cacheStats.size} entries</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Hits:</span>
              <Badge variant="outline">{cacheStats.totalHits}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Age:</span>
              <Badge variant="outline">{cacheStats.averageAge.toFixed(1)}s</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Render Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Render Performance</CardTitle>
            <CardDescription>Component render times</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Render:</span>
                  <Badge variant="outline">
                    {(metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length).toFixed(2)}ms
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Samples:</span>
                  <Badge variant="outline">{metrics.length}</Badge>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No render data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimization Tips</CardTitle>
            <CardDescription>Performance recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bundleAnalyzer.getSizeRecommendations().map((rec, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {rec}
                </p>
              ))}
              {bundleAnalyzer.getSizeRecommendations().length === 0 && (
                <p className="text-sm text-green-600">All metrics look good! 🎉</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
