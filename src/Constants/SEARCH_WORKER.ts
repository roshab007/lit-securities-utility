import { IWorkerConstantsOptions } from '../TYPES/SearchWorker'

/**
 * @ignore
 *
 * Worker chunk configuration for equity data processing
 *
 * Defines the range and index for processing equity data (1-25000)
 */
export const WORKER_CHUNK_ONE = { min: 1, max: 25000, chunkIndex: 0 } // EQUITY

/**
 * @ignore
 *
 * Worker chunk configuration for futures data processing
 *
 * Defines the range and index for processing futures data (25001-125000)
 */
export const WORKER_CHUNK_TWO = { min: 25001, max: 125000, chunkIndex: 1 } // FUTURE

/**
 * @ignore
 *
 * Worker chunk configuration for options data processing
 *
 * Defines the range and index for processing options data (125001-150000)
 */
export const WORKER_CHUNK_THREE = { min: 125001, max: 150000, chunkIndex: 2 } // OPTIONS

/**
 * @ignore
 *
 * Worker chunk configuration for underlying data processing
 *
 * Defines the range and index for processing underlying data (150001-199999)
 */
export const WORKER_CHUNK_FOUR = { min: 150001, max: 199999, chunkIndex: 3 } // UNDERLYING

/**
 * @ignore
 *
 * Collection of all worker chunk configurations
 * Array containing all worker chunk configurations for managing different data processing ranges
 */
export const WORKER_CHUNK_META = [
  WORKER_CHUNK_ONE,
  WORKER_CHUNK_TWO,
  WORKER_CHUNK_THREE,
  WORKER_CHUNK_FOUR
]

/**
 * @ignore
 *
 * Default priority value for chunk processing
 * Used when no explicit priority is provided for a chunk
 */
const DEFAULT_CHUNK_PRIORITY = 100

/**
 * @ignore
 *
 * Determines the appropriate chunk index based on priority value
 * @param {number | null} priority - The priority value to evaluate
 * @returns {number} The chunk index that corresponds to the priority range
 * Maps a priority value to its corresponding chunk index for worker assignment
 */
export function getChunkIndex(priority: number | null) {
  const searchPriority = priority || DEFAULT_CHUNK_PRIORITY

  if (
    searchPriority >= WORKER_CHUNK_ONE.min &&
    searchPriority <= WORKER_CHUNK_ONE.max
  ) {
    return WORKER_CHUNK_ONE.chunkIndex
  } else if (
    searchPriority >= WORKER_CHUNK_TWO.min &&
    searchPriority <= WORKER_CHUNK_TWO.max
  ) {
    return WORKER_CHUNK_TWO.chunkIndex
  } else if (
    searchPriority >= WORKER_CHUNK_THREE.min &&
    searchPriority <= WORKER_CHUNK_THREE.max
  ) {
    return WORKER_CHUNK_THREE.chunkIndex
  } else {
    return WORKER_CHUNK_FOUR.chunkIndex
  }
}

/**
 * @ignore
 *
 * Maximum size limit for search chunks
 * Defines the maximum number of records that can be processed in a single search operation
 */
export const MAX_FUSE_CHUNK_SIZE = 20000

/**
 * @ignore
 *
 * Search configuration settings
 * Configuration object defining search behavior and result scoring
 *
 * @property {string[]} keys - Fields to search within
 * @property {number} limit - Maximum number of results to return
 * @property {number} threshold - Minimum score threshold for results
 * @property {Function} scoreFn - Custom scoring function for search results
 */
export const SEARCH_OPTIONS = {
  keys: ['searchString', 'exchangeSymbol'],
  limit: 40, // don't return more results than you need!
  threshold: -9999, // don't return bad results,
  scoreFn: (a: any) => {
    const searchStringScore = (a[0] ? a[0].score : -10000) * 0.1
    const exchangeSymbolScore = (a[1] ? a[1].score : -10000) * 0.9
    return searchStringScore + exchangeSymbolScore
  }
}

/**
 * @ignore
 *
 * Worker lifecycle command options
 * Defines the available commands for controlling worker lifecycle
 */
export const WORKER_CONSTANTS_OPTIONS: IWorkerConstantsOptions = {
  init: 'INITIALIZE',
  start: 'START',
  search: 'SEARCH',
  terminate: 'TERMINATE'
}
