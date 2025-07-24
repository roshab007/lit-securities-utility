/**
 * Manages search logic using Web Workers and Security Master initialization.
 *
 * It waits for the `SECURITY_MASTER_INITIALIZED` event and initializes workers for each search chunk.
 * It then delegates search operations to the workers and collects their results.
 */

import { SECURITY_MASTER_NOT_INITIALIZED } from '../Constants/ERROR_MESSAGE'
import { SECURITY_MASTER_INITIALIZED } from '../Constants/EVENTS'
import { WORKER_CONSTANTS_OPTIONS } from '../Constants/SEARCH_WORKER'
import { getScriptByScriptIdIndexValue } from '../secMaster'
import { getSearchIndex, getSecurityMasterInitializationStatus } from '../store'
import SearchWorker from './SearchWorker.ts?worker&inline'

class SearchManager {
  STATE: 'INIT' | 'READY' = 'INIT'
  WORKER: Worker[] = []
  constructor() {
    const IS_SECURITY_MASTER_LOADED = getSecurityMasterInitializationStatus()
    if (IS_SECURITY_MASTER_LOADED) {
      this.initialize()
    } else {
      addEventListener(SECURITY_MASTER_INITIALIZED, this.initialize)
    }
  }

  /**
   * Initializes the search manager:
   * - Changes state to READY
   * - Fetches chunked index data
   * - Spawns a Web Worker per chunk
   * - Sends the chunk data to each worker
   */
  initialize = () => {
    this.STATE = 'READY'

    // get Chunks from secmaster
    const chunks = getSearchIndex()

    if (chunks) {
      // loop on chunks and add workers to WORKER
      Object.values(chunks).forEach((chunk, index) => {
        const searchWorker = new SearchWorker()
        this.WORKER.push(searchWorker)
        // postmessage on workers to pass chunk data and index with initialize event
        searchWorker.postMessage({
          payload: chunk,
          index,
          actionType: WORKER_CONSTANTS_OPTIONS.init
        })
      })
    }
  }

  /**
   * Initiates a search by sending the search string to all workers.
   * Waits for all responses, then flattens and resolves the final search result.
   *
   * @param searchString - The term to search for
   * @returns Promise resolving to an array of matched search results
   */

  search = async (searchString: string) => {
    return new Promise(resolve => {
      if (!getSecurityMasterInitializationStatus()) {
        console.warn(SECURITY_MASTER_NOT_INITIALIZED)
        resolve([])
      }

      const workerResults: any[] = []
      let resultCount = 0
      // loop on workers and post message search event with search string
      this.WORKER.forEach(workerInstance => {
        workerInstance.postMessage({
          actionType: 'SEARCH',
          searchString
        })

        workerInstance.onmessage = (event: MessageEvent) => {
          const { data } = event
          ++resultCount
          const { workerIndex, searchResult } = data
          workerResults[workerIndex] = searchResult
          if (resultCount === this.WORKER.length) {
            const searchResult = this._flattenResult(workerResults)
            console.log(searchResult, 'searchResult')
            resolve(searchResult)
          }
        }
      })
    })
  }

  /**
   * Combines and enriches raw results from all workers into a single result array.
   *
   * @param workerResults - Raw result arrays from workers
   * @returns Flattened and enriched result array
   */
  _flattenResult = (workerResults: any[]) => {
    const searchResult: any[] = []

    workerResults.forEach(workerResult => {
      workerResult.forEach((resultItem: any) => {
        const script = getScriptByScriptIdIndexValue(resultItem.obj.data)
        searchResult.push({ ...script })
      })
    })
    return searchResult
  }
}

/**
 * Singleton instance of SearchManager exported for use across app.
 */
const searchManager = new SearchManager()
export { searchManager }
