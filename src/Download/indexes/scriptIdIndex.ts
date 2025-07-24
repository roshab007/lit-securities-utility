import { TIndexHandler } from '../../TYPES/IndexHandler'
import {
  MASTER_DATA_SEGMENTS,
  TMasterDataDerivatives,
  TMasterDataDerivativesScript,
  TMasterDataEquity,
  TMasterDataUnderlying,
  TScriptIdIndex,
  TScriptIdIndexValue
} from '../../TYPES/Store'

/**
 * Handles indexing of script IDs by associating them with metadata such as segment keys,
 * item indices, and derivative item indices (if applicable). This allows quick lookup
 * of script metadata based on their IDs.
 *
 * @returns {TIndexHandler<TScriptIdIndex>} An object containing methods to add rows to the index
 * and retrieve the indexed data.
 */
export const scriptIdIndexHandler = (): TIndexHandler<TScriptIdIndex> => {
  const index: TScriptIdIndex = {}

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
    let item:
      | TMasterDataEquity
      | TMasterDataUnderlying
      | TMasterDataDerivativesScript =
      (derivativeItem && derivativeItem) ||
      (itemData as TMasterDataEquity | TMasterDataUnderlying)

    const scriptId = item[0]

    const map: TScriptIdIndexValue = [segmentKey, itemIndex]

    if (derivativeItemIndex) {
      map.push(3, derivativeItemIndex)
    }

    index[scriptId] = map
  }

  const getIndex = () => index

  return {
    addRow,
    getIndex
  }
}
