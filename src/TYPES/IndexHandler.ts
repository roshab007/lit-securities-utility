import {
  MASTER_DATA_SEGMENTS,
  TMasterDataEquity,
  TMasterDataDerivatives,
  TMasterDataUnderlying,
  TMasterDataDerivativesScript,
  TDerivativesIndex,
  TIsinCodeIndex,
  TScriptIdIndex,
  TSearchStringIndex
} from './Store'

/**
 * A generic type for handling index operations. This type defines methods
 * for adding rows of data to the index and retrieving the current index state.
 *
 * @template I - The type of the index (e.g., `TScriptIdIndex`, `TIsinCodeIndex`, etc.)
 */
export type TIndexHandler<I> = {
  /**
   * Adds a row of data to the index.
   *
   * @param segmentKey - The segment key to categorize the data.
   * @param itemIndex - The index of the item being added.
   * @param itemData - The data to be added to the index, which could be one of
   *                   the following types: `TMasterDataEquity`, `TMasterDataDerivatives`,
   *                   or `TMasterDataUnderlying`.
   * @param derivativeItemIndex - Optional index for derivative items if applicable.
   * @param derivativeItem - Optional derivative item data if the item is related to derivatives.
   */
  addRow: (
    segmentKey: MASTER_DATA_SEGMENTS,
    itemIndex: number,
    itemData:
      | TMasterDataEquity
      | TMasterDataDerivatives
      | TMasterDataUnderlying,
    derivativeItemIndex?: number,
    derivativeItem?: TMasterDataDerivativesScript
  ) => void
  /**
   * Retrieves the current state of the index.
   *
   * @returns The current index data of type `I`.
   */
  getIndex: () => I
}

/**
 * A collection of index handlers, where each handler corresponds to a different index type.
 * The handlers manage operations for script IDs, ISIN codes, derivatives, and search strings.
 *
 * The fourth handler for `TSearchStringIndex` is optional.
 */
export type TIndexHandlers =
  | [
      TIndexHandler<TScriptIdIndex>,
      TIndexHandler<TIsinCodeIndex>,
      TIndexHandler<TDerivativesIndex>,
      TIndexHandler<TSearchStringIndex>?
    ]
