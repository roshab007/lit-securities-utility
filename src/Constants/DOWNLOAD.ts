/**
 * @ignore The default name used for caching ASL security master data.
 */
export const DEFAULT_CACHE_NAME = 'ASL_SEC_MASTER'

/**
 * @ignore The default expiration time for the cache, in seconds (3 days).
 */
export const DEFAULT_CACHE_EXPIRATION_TIME = 3 * (24 * 60 * 60)

/**
 * @ignore The name of the HTTP header used to store the MD5 content hash for validation.
 */
export const CONTENT_HASH_HEADER_KEY_NAME = 'x-amz-meta-md5'
