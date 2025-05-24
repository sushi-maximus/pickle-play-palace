
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
}

export const ComponentMetricsTable = ({ metrics }: ComponentMetricsTableProps) => {
  if (metrics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No component metrics available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Renders</TableHead>
            <TableHead>Avg Time</TableHead>
            <TableHead>Last Render</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{metric.componentName}</TableCell>
              <TableCell>{metric.renderCount}</TableCell>
              <TableCell>{metric.averageRenderTime.toFixed(2)}ms</TableCell>
              <TableCell>{metric.lastRenderTime.toFixed(2)}ms</TableCell>
              <TableCell>
                <Badge variant={metric.averageRenderTime > 16 ? "destructive" : "default"}>
                  {metric.averageRenderTime > 16 ? "Slow" : "Good"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
