/**
 * Represents any function with any number of arguments and return type.
 */
type AnyFunction = (...args: any[]) => any

/**
 * @ignore
 * Memoizes a function by caching its results based on the arguments provided.
 * Improves performance for functions with expensive computations by avoiding redundant calculations for the same inputs.
 *
 * The cache uses a least recently used (LRU) strategy, where the least recently accessed item is evicted when the cache exceeds its size limit.
 *
 * @template T - The type of the function to be memoized.
 * @param {T} fn - The function to be memoized.
 * @param {number} [cacheLimit=100] - The maximum number of cached results. Defaults to 100.
 * @returns {T} - The memoized version of the input function.
 */
export function memoize<T extends AnyFunction>(
  fn: T,
  cacheLimit: number = 100
): T {
  const cache = new Map<string, ReturnType<T>>()

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      // If the key exists, move it to the end to mark it as recently used
      const value = cache.get(key) as ReturnType<T>
      cache.delete(key)
      cache.set(key, value)
      return value
    }

    // If the key doesn't exist, compute the result
    const result = fn(...args)
    cache.set(key, result)

    // Evict the least recently used (first inserted) item if the cache exceeds the limit
    if (cache.size > cacheLimit) {
      const firstKey = cache.keys().next().value
      if (firstKey) cache.delete(firstKey)
    }

    return result
  } as T
}
