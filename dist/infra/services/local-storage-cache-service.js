export class LocalStorageCacheService {
    constructor() {
        this.PREFIX = 'vocalearn_cache_';
    }
    async get(key) {
        const cacheKey = this.PREFIX + key;
        const item = localStorage.getItem(cacheKey);
        if (!item) {
            return null;
        }
        try {
            const cacheItem = JSON.parse(item);
            // Check if expired
            if (cacheItem.expiry && cacheItem.expiry < Date.now()) {
                localStorage.removeItem(cacheKey);
                return null;
            }
            return cacheItem.value;
        }
        catch (error) {
            console.error('Error parsing cache item:', error);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        const cacheKey = this.PREFIX + key;
        const cacheItem = {
            value
        };
        if (ttlSeconds) {
            cacheItem.expiry = Date.now() + (ttlSeconds * 1000);
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    }
    async remove(key) {
        const cacheKey = this.PREFIX + key;
        localStorage.removeItem(cacheKey);
    }
    async clear() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}
