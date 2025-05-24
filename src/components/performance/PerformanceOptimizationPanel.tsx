
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  X, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Package,
  Zap,
  TrendingDown,
  Clock
} from 'lucide-react';
import { usePerformanceOptimization } from '@/hooks/performance/usePerformanceOptimization';

interface PerformanceOptimizationPanelProps {
  className?: string;
}

export const PerformanceOptimizationPanel = ({ className = '' }: PerformanceOptimizationPanelProps) => {
  const {
    suggestions,
    bundleAnalysis,
    isAnalyzing,
    generateSuggestions,
    analyzeBundleSize,
    dismissSuggestion,
    clearAllSuggestions,
    isEnabled
  } = usePerformanceOptimization();

  if (!isEnabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Performance Optimization
          </CardTitle>
          <CardDescription>
            Optimization suggestions are only available in development mode
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bundle': return <Package className="h-4 w-4" />;
      case 'render': return <Clock className="h-4 w-4" />;
      case 'memory': return <TrendingDown className="h-4 w-4" />;
      case 'memoization': return <Zap className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Performance Optimization
          </h3>
          <p className="text-sm text-muted-foreground">
            AI-powered suggestions to improve your app's performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={generateSuggestions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Analyze
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={analyzeBundleSize}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Package className="h-4 w-4 mr-2" />
            )}
            Bundle Analysis
          </Button>
        </div>
      </div>

      {/* Bundle Analysis */}
      {bundleAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Bundle Analysis
            </CardTitle>
            <CardDescription>
              Analyzed {new Date(bundleAnalysis.lastAnalyzed).toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {bundleAnalysis.estimatedSize.toFixed(1)}KB
                </p>
                <p className="text-xs text-muted-foreground">Estimated Size</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {bundleAnalysis.componentsCount}
                </p>
                <p className="text-xs text-muted-foreground">Components</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {bundleAnalysis.hooksCount}
                </p>
                <p className="text-xs text-muted-foreground">Hooks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {bundleAnalysis.importsCount}
                </p>
                <p className="text-xs text-muted-foreground">Imports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Score */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Score</CardTitle>
          <CardDescription>Based on current performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const criticalCount = suggestions.filter(s => s.severity === 'critical').length;
            const highCount = suggestions.filter(s => s.severity === 'high').length;
            const totalIssues = suggestions.length;
            
            let score = 100;
            score -= criticalCount * 25;
            score -= highCount * 15;
            score -= (totalIssues - criticalCount - highCount) * 5;
            score = Math.max(0, score);
            
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Performance Score</span>
                  <span className="text-2xl font-bold">{score}/100</span>
                </div>
                <Progress value={score} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {score >= 90 ? 'Excellent' : 
                   score >= 70 ? 'Good' : 
                   score >= 50 ? 'Needs Improvement' : 'Critical Issues'}
                </p>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Optimization Suggestions</CardTitle>
              <CardDescription>
                {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            {suggestions.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllSuggestions}>
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">No optimization suggestions at the moment</p>
              <p className="text-sm text-muted-foreground">Your app is performing well!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Alert key={suggestion.id} className="relative">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(suggestion.severity)}
                      {getTypeIcon(suggestion.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(suggestion.severity) as any}>
                            {suggestion.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{suggestion.component}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissSuggestion(suggestion.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <p className="font-medium">{suggestion.issue}</p>
                        <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                        <p className="text-xs text-green-600 mt-1">💡 {suggestion.impact}</p>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
