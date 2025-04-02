// src/infrastructure/services/local-storage-cache-service.ts
import { CacheService } from '../../core/domain/ports/cache-service';

interface CacheItem<T> {
  value: T;
  expiry?: number;
}

export class LocalStorageCacheService implements CacheService {
  private readonly PREFIX = 'vocalearn_cache_';
  
  async get<T>(key: string): Promise<T | null> {
    const cacheKey = this.PREFIX + key;
    const item = localStorage.getItem(cacheKey);
    
    if (!item) {
      return null;
    }
    
    try {
      const cacheItem = JSON.parse(item) as CacheItem<T>;
      
      // Check if expired
      if (cacheItem.expiry && cacheItem.expiry < Date.now()) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return cacheItem.value;
    } catch (error) {
      console.error('Error parsing cache item:', error);
      return null;
    }
  }
  
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const cacheKey = this.PREFIX + key;
    const cacheItem: CacheItem<T> = {
      value
    };
    
    if (ttlSeconds) {
      cacheItem.expiry = Date.now() + (ttlSeconds * 1000);
    }
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  }
  
  async remove(key: string): Promise<void> {
    const cacheKey = this.PREFIX + key;
    localStorage.removeItem(cacheKey);
  }
  
  async clear(): Promise<void> {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}
