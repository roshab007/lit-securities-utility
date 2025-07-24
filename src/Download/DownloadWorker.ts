import {
  setCacheResponse,
  getCacheResponse,
  setCacheContentHash,
  checkIfContentHashIsSame,
  getContentHashFromHeaders
} from '../Utils/Cache/UtilCache'

import { INDEXES_CREATED } from '../Constants/EVENTS'
import { SEC_SEGMENTS } from '../Constants/SECURITY_MASTER'

import {
  TMasterData,
  TMasterDataDerivatives,
  TScriptIdIndex,
  TIsinCodeIndex,
  TDerivativesIndex,
  TSearchStringIndex,
  MASTER_DATA_SEGMENTS
} from '../TYPES/Store'
import {
  derivativesIndexHandler,
  isinCodeIndexHandler,
  scriptIdIndexHandler,
  searchStringIndexHandler
} from './indexes'
import { TIndexHandler, TIndexHandlers } from '../TYPES/IndexHandler'
import { STORE_KEYS } from '../Constants/STORE_KEYS'
import { IConfig } from '../TYPES/Config'

/**
 * Fetches the headers from the provided security master URL without retrieving the entire file.
 *
 * This function uses a 'HEAD' request to fetch only the headers of the file. It helps in
 * checking if the file has been modified or not by comparing the content hash from the headers.
 *
 * @param secMasterURL The URL of the security master data.
 * @returns The headers of the response, or null if an error occurs.
 */
export const fetchOnlyHeaders = async (secMasterURL: string) => {
  try {
    const response = await fetch(secMasterURL, {
      method: 'HEAD',
      mode: 'no-cors',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })

    if (response) {
      return response?.headers
    }
  } catch (err) {
    console.log(err, 'header errors')
  }
  return null
}

/**
 * Fetches the security master data from the provided URL, checks the file's content hash,
 * and updates the cache if the file content has changed.
 *
 * If the content hash is the same and the response is already cached, it returns the cached response.
 * Otherwise, it fetches the new data, updates the cache, creates indexes, and sends the data back to the main thread.
 *
 * @param secMasterURL The URL to fetch the security master data.
 * @param config Configuration options for indexing and handling the data.
 * @returns Void
 */
export const fetchSecurityMaster = async (
  secMasterURL: string,
  config: IConfig
) => {
  const headers = await fetchOnlyHeaders(secMasterURL)
  const contentHash = getContentHashFromHeaders(headers)

  // NOTE: variable to check if the file content is updated or same
  const isContentHashSame = await checkIfContentHashIsSame(contentHash)

  // check if response is cached
  const cacheResponse = await getCacheResponse(secMasterURL)

  if (isContentHashSame && cacheResponse) {
    generateIndexesAndPostMessage(cacheResponse, config)
    return
  }

  const response = await fetch(secMasterURL, {
    method: 'GET'
  })

  const { headers: currentHeaders = {} } = response
  const currentContentHash = getContentHashFromHeaders(currentHeaders)

  const SEC_MASTER_ARRAY: TMasterData = await response.json()
  setCacheResponse(secMasterURL, SEC_MASTER_ARRAY)
  setCacheContentHash(currentContentHash)

  generateIndexesAndPostMessage(SEC_MASTER_ARRAY, config)
}

/**
 * Generates indexes for the security master data and posts the data to the main thread.
 *
 * @param masterData The security master data to index.
 * @param config Configuration options for indexing.
 */
function generateIndexesAndPostMessage(
  masterData: TMasterData,
  config?: IConfig
) {
  const indexes = createIndexes(masterData, config)
  const dataToPost = {
    [STORE_KEYS.MASTER_DATA]: masterData,
    [STORE_KEYS.SCRIPT_ID_INDEX]: indexes.scriptIdIndex,
    [STORE_KEYS.DERIVATIVES_INDEX]: indexes.derivativesIndex,
    [STORE_KEYS.ISIN_CODE_INDEX]: indexes.isinCodeIndex,
    [STORE_KEYS.SEARCH_STRING_INDEX]: indexes.searchStringIndex
  }

  self.postMessage({
    action: INDEXES_CREATED,
    data: dataToPost
  })
}

/**
 * Creates indexes for different segments of the security master data based on configuration options.
 *
 * This function creates various indexes like `scriptIdIndex`, `isinCodeIndex`, `derivativesIndex`,
 * and optionally `searchStringIndex`, depending on the `requireSearchModule` flag in the configuration.
 * It loops through the segments of the security master data, processes each item, and adds it to the corresponding index.
 *
 * @param masterData The security master data to index.
 * @param options Configuration options for index creation.
 * @returns An object containing the created indexes.
 */
const createIndexes = (
  masterData: TMasterData,
  options?: IConfig
): {
  scriptIdIndex: TScriptIdIndex
  isinCodeIndex: TIsinCodeIndex
  derivativesIndex: TDerivativesIndex
  searchStringIndex?: TSearchStringIndex
} => {
  let indexHandlers: TIndexHandlers = [
    scriptIdIndexHandler(),
    isinCodeIndexHandler(),
    derivativesIndexHandler()
  ]

  if (options && options.requireSearchModule) {
    indexHandlers.push(
      searchStringIndexHandler() as TIndexHandler<TSearchStringIndex>
    )
  }

  for (const SEC_SEGMENT of SEC_SEGMENTS) {
    const secMasterSegmentKey = SEC_SEGMENT.name as MASTER_DATA_SEGMENTS
    const segmentData = masterData[secMasterSegmentKey]

    if (!segmentData) continue

    if (
      SEC_SEGMENT.type === 'FLAT_EQUITY' ||
      SEC_SEGMENT.type === 'FLAT_UNDERLYING'
    ) {
      const totalData = segmentData.length
      for (let itemIndex = 0; itemIndex < totalData; itemIndex++) {
        const itemData = segmentData[itemIndex]
        indexHandlers.map(indexHandler =>
          indexHandler?.addRow(secMasterSegmentKey, itemIndex, itemData)
        )
      }
    } else {
      const totalData = segmentData.length
      for (let itemIndex = 0; itemIndex < totalData; itemIndex++) {
        const itemData = segmentData[itemIndex] as TMasterDataDerivatives
        const derivativeItems = itemData[3]
        const derivativeItemsLength = derivativeItems.length

        for (
          let derivativeItemIndex = 0;
          derivativeItemIndex < derivativeItemsLength;
          derivativeItemIndex++
        ) {
          const derivativeItem = derivativeItems[derivativeItemIndex]
          indexHandlers.map(indexHandler =>
            indexHandler?.addRow(
              secMasterSegmentKey,
              itemIndex,
              itemData,
              derivativeItemIndex,
              derivativeItem
            )
          )
        }
      }
    }
  }

  const indexesArray = indexHandlers.map(indexHandler =>
    indexHandler?.getIndex()
  )
  const scriptIdIndex = indexesArray[0] as TScriptIdIndex
  const isinCodeIndex = indexesArray[1] as TIsinCodeIndex
  const derivativesIndex = indexesArray[2] as TDerivativesIndex
  const searchStringIndex = indexesArray[3] as TSearchStringIndex | undefined

  const indexes = {
    scriptIdIndex,
    isinCodeIndex,
    derivativesIndex,
    searchStringIndex
  }

  return indexes
}

self.onmessage = (event: MessageEvent) => {
  const { action, data } = event.data
  if (action === 'INIT') {
    const { config, secMasterURL } = data
    fetchSecurityMaster(secMasterURL, config)
  }
}
