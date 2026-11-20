// Lightweight In-Memory Cache with Auto-Invalidation (Zero Cost, No Redis Required)
class SimpleMemoryCache {
  private cache = new Map<string, { value: any; expiry: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  set(key: string, value: any, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000
    });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      console.log('[Cache] Invalidation: Complete public cache purged.');
      return;
    }
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`[Cache] Invalidation: Purged ${count} cached items matching "${pattern}".`);
  }
}

export const publicCache = new SimpleMemoryCache();
export default publicCache;
