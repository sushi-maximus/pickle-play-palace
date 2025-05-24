
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ComponentMetrics {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
  timestamp: number;
}

interface MemoryMetrics {
  componentName: string;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: number;
}

interface MetricsChartProps {
  componentMetrics: ComponentMetrics[];
  memoryMetrics: MemoryMetrics[];
}

export const MetricsChart = ({ componentMetrics, memoryMetrics }: MetricsChartProps) => {
  // Prepare render time data
  const renderTimeData = componentMetrics
    .sort((a, b) => a.averageRenderTime - b.averageRenderTime)
    .map(metric => ({
      name: metric.componentName,
      avgTime: Number(metric.averageRenderTime.toFixed(2)),
      renders: metric.renderCount
    }));

  // Prepare memory usage data over time
  const memoryTimeData = memoryMetrics
    .slice(0, 20) // Last 20 data points
    .reverse() // Most recent first
    .map((metric, index) => ({
      time: `T-${memoryMetrics.length - index}`,
      usage: Number(metric.usedPercentage.toFixed(1)),
      timestamp: metric.timestamp
    }));

  if (componentMetrics.length === 0 && memoryMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Charts</CardTitle>
          <CardDescription>No performance data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Start using the application to see performance metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Render Time Chart */}
      {renderTimeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Component Render Times</CardTitle>
            <CardDescription>Average render time per component</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={renderTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'avgTime' ? `${value}ms` : value,
                    name === 'avgTime' ? 'Avg Render Time' : 'Render Count'
                  ]}
                />
                <Bar 
                  dataKey="avgTime" 
                  fill="#8884d8" 
                  name="Avg Render Time"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Memory Usage Over Time */}
      {memoryTimeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage Over Time</CardTitle>
            <CardDescription>Heap memory usage percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memoryTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: 'Usage (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Memory Usage']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key metrics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {componentMetrics.length}
              </p>
              <p className="text-sm text-muted-foreground">Components Tracked</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {componentMetrics.reduce((acc, m) => acc + m.renderCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Renders</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {memoryTimeData.length > 0 
                  ? `${memoryTimeData[memoryTimeData.length - 1]?.usage}%`
                  : 'N/A'
                }
              </p>
              <p className="text-sm text-muted-foreground">Current Memory</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
