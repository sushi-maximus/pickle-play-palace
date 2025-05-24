
// Bundle analysis utilities for performance monitoring

interface PerformanceNavigationEntry extends PerformanceEntry {
  transferSize?: number;
  encodedBodySize?: number;
  decodedBodySize?: number;
}

interface BundleStats {
  totalSize: number;
  gzippedSize: number;
  componentCount: number;
  routeCount: number;
}

// Get bundle size information from performance API
export const getBundleSize = (): number => {
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationEntry;
    
    // Use transferSize if available, fallback to encodedBodySize or 0
    return navigation?.transferSize || navigation?.encodedBodySize || 0;
  } catch (error) {
    console.warn('Could not get bundle size:', error);
    return 0;
  }
};

// Analyze resource loading performance
export const analyzeResourceLoading = () => {
  const resources = performance.getEntriesByType('resource');
  
  return resources.map(resource => {
    const navResource = resource as PerformanceNavigationEntry;
    return {
      name: resource.name,
      size: navResource?.transferSize || navResource?.encodedBodySize || 0,
      duration: resource.duration,
      startTime: resource.startTime
    };
  });
};

// Get comprehensive bundle statistics
export const getBundleStats = (): BundleStats => {
  const bundleSize = getBundleSize();
  const resources = analyzeResourceLoading();
  
  const jsResources = resources.filter(r => r.name.endsWith('.js'));
  const totalSize = jsResources.reduce((sum, r) => sum + r.size, 0);
  
  return {
    totalSize,
    gzippedSize: bundleSize,
    componentCount: jsResources.length,
    routeCount: jsResources.filter(r => r.name.includes('pages')).length
  };
};

// Log bundle analysis in development
export const logBundleAnalysis = () => {
  if (process.env.NODE_ENV === 'development') {
    const stats = getBundleStats();
    console.group('📦 Bundle Analysis');
    console.log('Total Size:', `${(stats.totalSize / 1024).toFixed(2)} KB`);
    console.log('Gzipped Size:', `${(stats.gzippedSize / 1024).toFixed(2)} KB`);
    console.log('Component Count:', stats.componentCount);
    console.log('Route Count:', stats.routeCount);
    console.groupEnd();
  }
};

// Monitor chunk loading performance
export const monitorChunkLoading = () => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('chunk') || entry.name.includes('lazy')) {
        console.log('🔄 Lazy chunk loaded:', {
          name: entry.name,
          duration: `${entry.duration.toFixed(2)}ms`,
          size: (entry as PerformanceNavigationEntry)?.transferSize || 'unknown'
        });
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
  
  // Cleanup after 30 seconds
  setTimeout(() => observer.disconnect(), 30000);
};
