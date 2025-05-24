
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Gauge } from 'lucide-react';

interface OptimizationSuggestion {
  type: 'memory' | 'render' | 'bundle';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  action?: string;
}

interface PerformanceOptimizationPanelProps {
  suggestions?: OptimizationSuggestion[];
}

export const PerformanceOptimizationPanel = ({ 
  suggestions = [] 
}: PerformanceOptimizationPanelProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory': return <Gauge className="h-4 w-4" />;
      case 'render': return <TrendingUp className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance Optimization
        </CardTitle>
        <CardDescription>
          Suggestions to improve application performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-6">
            <Zap className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-600 font-medium">All optimizations look good!</p>
            <p className="text-sm text-muted-foreground">No performance issues detected</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium">{suggestion.title}</span>
                  </div>
                  <Badge variant={getSeverityColor(suggestion.severity) as any}>
                    {suggestion.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
                {suggestion.action && (
                  <Button size="sm" variant="outline">
                    {suggestion.action}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
