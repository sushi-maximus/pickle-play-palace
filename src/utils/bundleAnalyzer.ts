
// Bundle analysis utilities for development
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // Log performance metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.group('📊 Bundle Performance Metrics');
    console.log('🚀 DOM Content Loaded:', `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
    console.log('📦 Load Complete:', `${navigation.loadEventEnd - navigation.loadEventStart}ms`);
    console.log('🌐 DNS Lookup:', `${navigation.domainLookupEnd - navigation.domainLookupStart}ms`);
    console.log('🔗 Connection:', `${navigation.connectEnd - navigation.connectStart}ms`);
    console.log('📥 Response:', `${navigation.responseEnd - navigation.responseStart}ms`);
    console.groupEnd();

    // Monitor resource loading
    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && !resource.name.includes('node_modules')
    );
    
    console.group('📦 JavaScript Bundle Analysis');
    jsResources.forEach(resource => {
      console.log(`${resource.name}: ${(resource.transferSize / 1024).toFixed(2)}KB`);
    });
    console.groupEnd();
  }
};

// Call this after app loads
export const initBundleAnalysis = () => {
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(analyzeBundleSize, 1000);
    });
  }
};
