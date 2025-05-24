import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  HardDrive, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MemoryMetrics {
  componentName: string;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: number;
}

interface MemoryPressureIndicatorProps {
  memoryMetrics: MemoryMetrics[];
}

export const MemoryPressureIndicator = ({ memoryMetrics }: MemoryPressureIndicatorProps) => {
  if (memoryMetrics.length === 0) {
    return (
      <div className="text-center py-8">
        <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No memory data available</p>
        <p className="text-sm text-muted-foreground">
          Memory monitoring will start automatically
        </p>
      </div>
    );
  }

  const latestMetric = memoryMetrics[0];
  const { usedPercentage, trend, usedJSHeapSize, jsHeapSizeLimit } = latestMetric;

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getPressureLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'critical', color: 'destructive', icon: AlertTriangle };
    if (percentage >= 75) return { level: 'high', color: 'destructive', icon: AlertCircle };
    if (percentage >= 60) return { level: 'medium', color: 'secondary', icon: AlertCircle };
    return { level: 'low', color: 'default', icon: CheckCircle };
  };

  const getTrendIcon = (trendValue: string) => {
    switch (trendValue) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const pressure = getPressureLevel(usedPercentage);
  const PressureIcon = pressure.icon;

  return (
    <div className="space-y-4">
      {/* Current Memory Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Memory Usage</span>
          <div className="flex items-center gap-2">
            <Badge variant={pressure.color as any}>
              <PressureIcon className="h-3 w-3 mr-1" />
              {pressure.level.toUpperCase()}
            </Badge>
            <span className="text-sm font-mono">{usedPercentage.toFixed(1)}%</span>
          </div>
        </div>
        
        <Progress 
          value={usedPercentage} 
          className="h-3"
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatBytes(usedJSHeapSize)} used</span>
          <span>{formatBytes(jsHeapSizeLimit)} limit</span>
        </div>
      </div>

      {/* Memory Trend */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Trend</span>
          {getTrendIcon(trend)}
        </div>
        <span className="text-sm capitalize">{trend}</span>
      </div>

      {/* Memory Pressure Alerts */}
      {usedPercentage >= 75 && (
        <Alert variant={usedPercentage >= 90 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {usedPercentage >= 90 
              ? "Critical memory usage! Consider reducing memory-intensive operations."
              : "High memory usage detected. Monitor memory consumption closely."
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Memory History Summary */}
      {memoryMetrics.length > 1 && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Recent Samples</span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {memoryMetrics.slice(0, 6).map((metric, index) => (
              <div 
                key={index} 
                className="text-center p-2 bg-muted/30 rounded"
              >
                <div className="font-mono">{metric.usedPercentage.toFixed(1)}%</div>
                <div className="text-muted-foreground">
                  {new Date(metric.timestamp).toLocaleTimeString().slice(0, 5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
