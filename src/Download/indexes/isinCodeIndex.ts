import { TIndexHandler } from '../../TYPES/IndexHandler'
import {
  MASTER_DATA_SEGMENTS,
  TIsinCodeIndex,
  TMasterDataDerivatives,
  TMasterDataDerivativesScript,
  TMasterDataEquity,
  TMasterDataUnderlying
} from '../../TYPES/Store'

/**
 * Handles indexing of ISIN codes by associating them with their corresponding
 * script IDs. This index is specifically designed for equity data and excludes
 * derivatives and underlying segments.
 *
 * @returns {TIndexHandler<TIsinCodeIndex>} An object containing methods to add rows to the index
 * and retrieve the indexed data.
 */
export const isinCodeIndexHandler = (): TIndexHandler<TIsinCodeIndex> => {
  const index: TIsinCodeIndex = {}

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
    // Derivative & Unerlying does not have isincode
    if (derivativeItem || segmentKey.includes('UNDERLYING')) {
      return
    }

    let item: TMasterDataEquity = itemData as TMasterDataEquity

    const scriptId = item[0]
    const isAslAllowed = item[3]
    const isinCode = item[6]
    const isValidIsincode = isinCode && isinCode !== '0'

    // if script is not allowed don't add to any index
    if (isAslAllowed === 'N' || !isValidIsincode) {
      return
    }

    if (!index[isinCode]) {
      index[isinCode] = []
    }

    index[isinCode].push(scriptId)
  }

  const getIndex = () => index

  return {
    addRow,
    getIndex
  }
}
