
interface PreloadedRoute {
  component: Promise<any>;
  timestamp: number;
}

class RoutePreloader {
  private cache = new Map<string, PreloadedRoute>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  preload(routeName: string, importFn: () => Promise<any>) {
    // Don't preload if already cached and fresh
    const cached = this.cache.get(routeName);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.component;
    }

    const component = importFn();
    this.cache.set(routeName, {
      component,
      timestamp: Date.now()
    });

    return component;
  }

  // Clean up stale cache entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  // Preload critical routes on app start
  preloadCritical() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preload('Dashboard', () => import('@/pages/Dashboard'));
        this.preload('Profile', () => import('@/pages/Profile'));
        this.preload('Groups', () => import('@/pages/Groups'));
      });
    } else {
      setTimeout(() => {
        this.preload('Dashboard', () => import('@/pages/Dashboard'));
        this.preload('Profile', () => import('@/pages/Profile'));
        this.preload('Groups', () => import('@/pages/Groups'));
      }, 100);
    }
  }
}

export const routePreloader = new RoutePreloader();
