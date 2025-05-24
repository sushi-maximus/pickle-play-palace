
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, TrendingUp, Clock, RefreshCw } from 'lucide-react';

interface ComponentMetrics {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
  timestamp: number;
}

interface ComponentMetricsTableProps {
  metrics: ComponentMetrics[];
  slowComponents: ComponentMetrics[];
}

export const ComponentMetricsTable = ({ metrics, slowComponents }: ComponentMetricsTableProps) => {
  const formatTime = (time: number) => `${time.toFixed(2)}ms`;
  const formatTimestamp = (timestamp: number) => new Date(timestamp).toLocaleTimeString();

  const getPerformanceBadge = (avgTime: number) => {
    if (avgTime > 50) return <Badge variant="destructive">Slow</Badge>;
    if (avgTime > 16) return <Badge variant="secondary">Warning</Badge>;
    return <Badge variant="default">Good</Badge>;
  };

  const isSlowComponent = (componentName: string) => {
    return slowComponents.some(comp => comp.componentName === componentName);
  };

  if (metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Component Performance</CardTitle>
          <CardDescription>No component metrics available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Component metrics will appear here as you navigate the application
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by average render time (slowest first)
  const sortedMetrics = [...metrics].sort((a, b) => b.averageRenderTime - a.averageRenderTime);

  return (
    <div className="space-y-4">
      {/* Performance Alerts */}
      {slowComponents.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Performance Alerts
            </CardTitle>
            <CardDescription>
              {slowComponents.length} component{slowComponents.length > 1 ? 's' : ''} 
              {slowComponents.length > 1 ? ' are' : ' is'} rendering slower than 16ms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {slowComponents.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-destructive/5 rounded">
                  <span className="text-sm font-medium">{component.componentName}</span>
                  <Badge variant="destructive">
                    {formatTime(component.averageRenderTime)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Component Performance Metrics
          </CardTitle>
          <CardDescription>
            Detailed performance metrics for all tracked components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Renders</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
                <TableHead className="text-right">Last Time</TableHead>
                <TableHead className="text-right">Total Time</TableHead>
                <TableHead className="text-right">Last Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMetrics.map((metric, index) => (
                <TableRow 
                  key={index}
                  className={isSlowComponent(metric.componentName) ? 'bg-destructive/5' : ''}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {isSlowComponent(metric.componentName) && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                      {metric.componentName}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getPerformanceBadge(metric.averageRenderTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <RefreshCw className="h-3 w-3 text-muted-foreground" />
                      {metric.renderCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatTime(metric.averageRenderTime)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatTime(metric.lastRenderTime)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatTime(metric.totalRenderTime)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(metric.timestamp)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
