import fuzzysort from 'fuzzysort'

import {
  MAX_FUSE_CHUNK_SIZE,
  SEARCH_OPTIONS,
  WORKER_CHUNK_META,
  WORKER_CONSTANTS_OPTIONS
} from '../Constants/SEARCH_WORKER'

/**
 * @ignore
 */
/**
 * A worker-side class for handling fuzzy search operations.
 * Initializes chunked searchable datasets and runs fuzzysort on them.
 */
class SearchWorker {
  FUSES: any[] = []
  INDEX: number = 0

  /**
   * Constructor for the SearchWorker class.
   * Chunks the input data based on search priority and prepares fuzzysort indexes.
   *
   * @param searchData - Array of searchable objects
   * @param index - Index of the worker
   */
  constructor(searchData: any[], index: number) {
    this.INDEX = index
    // _getChunks call
    const chunks = this._getChunks(searchData)
    // loop over chunks and createFuseIndex, initialize Fuse with sortFun Passing
    chunks.forEach((chunk, index) => {
      this.FUSES[index] = chunk
      fuzzysort.go('', chunk, SEARCH_OPTIONS)
    })
  }

  /**
   * Performs fuzzy search across all chunked indexes and returns ranked results.
   *
   * @param searchString - The input string to search
   * @returns Array of sorted search results
   */
  search = (searchString: string) => {
    let searchResult: any[] = []

    // loop over this.FUSES and call search method
    console.time(`fuseSearch ${this.INDEX}`)
    // const sResult = new Promise.all()
    this.FUSES.forEach((fuseInstance: any) => {
      // const result = fuseInstance.search(searchString, { limit: 40 })
      let results = fuzzysort.go(searchString, fuseInstance, SEARCH_OPTIONS)

      searchResult = [...searchResult, ...results]
    })

    searchResult
      .sort((a, b) => {
        return a.obj.searchPriority - b.obj.searchPriority
      })
      .sort((a, b) => b.score - a.score)
    console.timeEnd(`fuseSearch ${this.INDEX}`)
    return searchResult
  }

  /**
   * Splits input data into multiple chunks based on `searchPriority` range.
   * Chunking is guided by `WORKER_CHUNK_META`.
   *
   * @param searchData - Raw input array to chunk
   * @returns Priority-based chunked data arrays
   */
  _getChunks = (searchData: any[]) => {
    let chunks: any[] = []
    if (searchData.length <= MAX_FUSE_CHUNK_SIZE) {
      chunks = [searchData]
      return chunks
    }

    // WORKER_CHUNK_META[INDEX].max = 15
    // WORKER_CHUNK_META[INDEX].min = 8

    const CHUNK_META: [any, any] = [[], []]
    const priorityDiff = Math.ceil(
      (WORKER_CHUNK_META[this.INDEX].max - WORKER_CHUNK_META[this.INDEX].min) /
        CHUNK_META.length
    ) // 4

    CHUNK_META.forEach((_, index) => {
      CHUNK_META[index] = {
        min: WORKER_CHUNK_META[this.INDEX].min + priorityDiff * index,
        max: WORKER_CHUNK_META[this.INDEX].min + priorityDiff * (index + 1),
        index
      }
    })

    searchData.forEach(data => {
      const { searchPriority } = data
      CHUNK_META.forEach(CHUNK => {
        if (searchPriority >= CHUNK.min && searchPriority <= CHUNK.max) {
          if (!chunks[CHUNK.index]) {
            chunks[CHUNK.index] = []
          }
          chunks[CHUNK.index].push(data)
        }
      })
    })

    return chunks
  }
}

// Global instance of SearchWorker inside the Web Worker scope
let searchWorker: SearchWorker

/**
 * Web Worker message handler to support `init` and `search` commands.
 * Initializes the worker with chunked data or performs a search and responds with results.
 */
self.onmessage = (event: MessageEvent) => {
  const { data } = event
  const { actionType = '' } = data

  switch (actionType) {
    case WORKER_CONSTANTS_OPTIONS.init: {
      searchWorker = new SearchWorker(data.payload, data.index)
      break
    }
    case WORKER_CONSTANTS_OPTIONS.search: {
      const searchResult = searchWorker.search(data.searchString)
      self.postMessage({ searchResult, workerIndex: searchWorker.INDEX })
      break
    }

    default:
      break
  }
}
