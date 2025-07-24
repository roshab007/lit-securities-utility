import { getChunkIndex } from '../../Constants/SEARCH_WORKER'
import { TIndexHandler } from '../../TYPES/IndexHandler'
import { IScript } from '../../TYPES/Script'
import {
  MASTER_DATA_SEGMENTS,
  TMasterDataDerivatives,
  TMasterDataDerivativesScript,
  TMasterDataEquity,
  TMasterDataUnderlying,
  TScriptIdIndexValue,
  TSearchStringIndex
} from '../../TYPES/Store'

/**
 * Handles indexing of searchable strings for scripts, organizing them by
 * search priority into chunked groups. This is useful for efficient search
 * and retrieval operations.
 *
 * @returns {TIndexHandler<TSearchStringIndex>} An object containing methods to add rows to the index
 * and retrieve the indexed data.
 */
export const searchStringIndexHandler =
  (): TIndexHandler<TSearchStringIndex> => {
    const index: TSearchStringIndex = {}

    const addRow = (
      segmentKey: MASTER_DATA_SEGMENTS,
      itemIndex: number,
      itemData:
        | TMasterDataEquity
        | TMasterDataDerivatives
        | TMasterDataUnderlying,
      derivativeItemIndex?: number,
      derivativeItem?: TMasterDataDerivativesScript
    ) => {
      let exchangeSymbol: IScript['exchangeSymbol']
      let searchString: IScript['searchable']
      let searchPriority: IScript['searchPriority']
      let map: TScriptIdIndexValue
      let isAslAllowed: IScript['aslAllowed']

      if (segmentKey.includes('EQUITY')) {
        const item = itemData as TMasterDataEquity
        exchangeSymbol = item[4]
        isAslAllowed = item[3]
        searchString = item[13]
        searchPriority = item[14]
        map = [segmentKey, itemIndex]
      } else if (segmentKey.includes('UNDERLYING')) {
        const item = itemData as TMasterDataUnderlying
        exchangeSymbol = item[4]
        isAslAllowed = item[3]
        searchString = item[11]
        searchPriority = item[12]
        map = [segmentKey, itemIndex]
      } else {
        const item = itemData as TMasterDataDerivatives
        exchangeSymbol = item[0]
        isAslAllowed = derivativeItem![3]
        searchString = derivativeItem![12]
        searchPriority = derivativeItem![13]
        map = [segmentKey, itemIndex, 3, derivativeItemIndex!]
      }

      if (isAslAllowed === 'N') return

      const searchObj = {
        exchangeSymbol,
        searchString,
        searchPriority,
        data: map
      }

      const chunkIndex = getChunkIndex(searchPriority)
      if (!index[chunkIndex]) {
        index[chunkIndex] = []
      }
      index[chunkIndex].push(searchObj)
    }

    const getIndex = () => index

    return {
      addRow,
      getIndex
    }
  }
