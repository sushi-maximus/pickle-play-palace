
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
  priority: 'high' | 'medium' | 'low';
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  priorities: {
    high: number;    // TTL in ms
    medium: number;
    low: number;
  };
}

class SmartCacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig = {
    maxSize: 100,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    priorities: {
      high: 10 * 60 * 1000,    // 10 minutes
      medium: 5 * 60 * 1000,   // 5 minutes
      low: 2 * 60 * 1000       // 2 minutes
    }
  };

  set<T>(key: string, data: T, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    // Evict if at capacity
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0,
      priority
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    const ttl = this.config.priorities[entry.priority];
    if (Date.now() - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    entry.hits++;
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const ttl = this.config.priorities[entry.priority];
    if (Date.now() - entry.timestamp > ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Prioritize by hits, then by age
      if (entry.hits < leastHits || 
          (entry.hits === leastHits && entry.timestamp < oldestTimestamp)) {
        leastUsedKey = key;
        leastHits = entry.hits;
        oldestTimestamp = entry.timestamp;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      hitRates: {
        high: entries.filter(e => e.priority === 'high').reduce((sum, e) => sum + e.hits, 0),
        medium: entries.filter(e => e.priority === 'medium').reduce((sum, e) => sum + e.hits, 0),
        low: entries.filter(e => e.priority === 'low').reduce((sum, e) => sum + e.hits, 0),
      },
      totalHits: entries.reduce((sum, e) => sum + e.hits, 0),
      averageAge: entries.length > 0 ? 
        (Date.now() - entries.reduce((sum, e) => sum + e.timestamp, 0) / entries.length) / 1000 : 0
    };
  }

  clear(): void {
    this.cache.clear();
  }
}

export const smartCache = new SmartCacheManager();
