import {
  CONTENT_HASH_HEADER_KEY_NAME,
  DEFAULT_CACHE_EXPIRATION_TIME,
  DEFAULT_CACHE_NAME
} from '../../Constants/DOWNLOAD'
import { TMasterData } from '../../TYPES/Store'

/**
 * Sets contenthash received from headers for sec master file in cache
 *
 * @param value
 * @param [cacheExpirationTime=DEFAULT_CACHE_EXPIRATION_TIME]
 * @returns
 */
export async function setCacheContentHash(
  value: string,
  cacheExpirationTime: number = DEFAULT_CACHE_EXPIRATION_TIME
) {
  const responseOptions = {
    headers: new Headers({
      'Cache-Control': `max-age=${cacheExpirationTime}`
    })
  }

  const key = new URL('/lastContentHash', self.location.origin).toString()
  const cache = await caches.open(DEFAULT_CACHE_NAME)
  const cacheResponse = new Response(value, responseOptions)
  await cache.put(key, cacheResponse)
}

/**
 * Retrieves the last cached content hash stored in the cache.
 *
 * @returns
 */
export async function getLastCachedContentHash() {
  const key = new URL('/lastContentHash', self.location.origin).toString()
  const cache = await caches.open(DEFAULT_CACHE_NAME)
  const cacheResponse = await cache.match(key)
  const value = await cacheResponse?.text()

  return value
}

/**
 * Compares the provided content hash with the one stored in the cache.
 *
 * @param {string} contentHash - The content hash to compare.
 * @returns {Promise<boolean>} True if the content hash matches the cached value, otherwise false.
 */
export async function checkIfContentHashIsSame(contentHash: string) {
  const oldContentHash = await getLastCachedContentHash()
  return oldContentHash === contentHash
}

/**
 * Extracts the content hash from the given headers.
 *
 * @param headers
 * @returns
 */
export function getContentHashFromHeaders(headers: any) {
  if (headers) return headers[CONTENT_HASH_HEADER_KEY_NAME]

  return ''
}

/**
 * Retrieves the cached response for a given URL if it exists.
 *
 * @param {string} secMasterURL - The URL for which to fetch the cached response.
 * @returns {Promise<any | undefined>} The cached response data, or undefined if not found.
 */
export async function getCacheResponse(secMasterURL: string) {
  const cache = await caches.open(DEFAULT_CACHE_NAME)
  const cacheResponse = await cache.match(secMasterURL)
  if (cacheResponse) {
    return await cacheResponse.json()
  }
}

/**
 * Stores the provided data in the cache for a given URL.
 *
 * @param {string} secMasterURL - The URL to associate with the cached data.
 * @param {TMasterData} SEC_MASTER_ARRAY - The data to be stored in the cache.
 * @returns {Promise<void>}
 */
export async function setCacheResponse(
  secMasterURL: string,
  SEC_MASTER_ARRAY: TMasterData
) {
  const cache = await caches.open(DEFAULT_CACHE_NAME)

  const responseOptions = {
    headers: new Headers({
      'Cache-Control': `max-age=${DEFAULT_CACHE_EXPIRATION_TIME}`
    })
  }

  const cacheResponse = new Response(
    JSON.stringify(SEC_MASTER_ARRAY),
    responseOptions
  )
  await cache.put(secMasterURL, cacheResponse)
}
