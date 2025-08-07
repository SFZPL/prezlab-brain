// src/services/cacheService.js - Frontend caching service
class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Maximum number of cached items
    this.defaultTTL = 3600000; // 1 hour in milliseconds
  }

  /**
   * Generate a cache key from file content
   */
  generateCacheKey(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const array = new Uint8Array(e.target.result);
        const hash = this.hashCode(array);
        resolve(`${file.name}_${file.size}_${hash}`);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Simple hash function for file content
   */
  hashCode(array) {
    let hash = 0;
    for (let i = 0; i < array.length; i++) {
      const char = array[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Set a cache entry
   */
  set(key, value, ttl = this.defaultTTL) {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const entry = {
      value,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, entry);
    
    // Also store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  /**
   * Get a cache entry
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (entry) {
      // Check if entry is still valid
      if (Date.now() - entry.timestamp < entry.ttl) {
        return entry.value;
      } else {
        // Remove expired entry
        this.cache.delete(key);
      }
    }

    // Try to get from localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const entry = JSON.parse(stored);
        if (Date.now() - entry.timestamp < entry.ttl) {
          // Restore to memory cache
          this.cache.set(key, entry);
          return entry.value;
        } else {
          // Remove expired entry
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }

    return null;
  }

  /**
   * Check if a key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Remove a cache entry
   */
  delete(key) {
    this.cache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn('Could not remove from localStorage:', e);
    }
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    try {
      // Clear all cache entries from localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));

    // If still too many entries, remove oldest
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.maxSize + 1);
      toRemove.forEach(([_key]) => this.cache.delete(_key));
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * Estimate memory usage
   */
  getMemoryUsage() {
    let totalSize = 0;
    for (const [key, entry] of this.cache.entries()) {
      totalSize += JSON.stringify(entry).length;
    }
    return totalSize;
  }
}

// Export singleton instance
const cacheService = new CacheService();
export default cacheService;
