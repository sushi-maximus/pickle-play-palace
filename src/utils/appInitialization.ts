
import { routePreloader } from './routePreloader';
import { bundleAnalyzer } from './bundleAnalyzer';
import { smartCache } from './smartCacheManager';

export const initializeApp = () => {
  console.log('🚀 Initializing PicklePlay app...');

  // Start route preloading for critical paths
  routePreloader.preloadCritical();

  // Analyze initial bundle
  const initialMetrics = bundleAnalyzer.analyzeBundle();
  console.log('📊 Initial bundle metrics:', initialMetrics);

  // Set up periodic cleanup
  setInterval(() => {
    routePreloader.cleanup();
    
    // Clear stale cache entries
    const stats = smartCache.getStats();
    if (stats.size > 50) {
      console.log('🧹 Cleaning up cache, current size:', stats.size);
    }
  }, 5 * 60 * 1000); // Every 5 minutes

  // Monitor performance
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        console.log(`⚡ App loaded in ${loadTime.toFixed(2)}ms`);
        bundleAnalyzer.correlateWithPerformance(loadTime);
      }, 100);
    });
  }

  console.log('✅ App initialization complete');
};
