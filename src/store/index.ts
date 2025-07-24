import { STORE_KEYS } from '../Constants/STORE_KEYS'
import { IStore } from '../TYPES/Store'

/**
 * Description placeholder
 *
 * @type {IStore}
 */
let store: IStore = {}

/**
 * Adds data to the store. It iterates over the keys of the input store and updates the store accordingly.
 * Each key corresponds to a specific type of data, and the function calls appropriate methods to update the store.
 *
 * @param {IStore} inputStore The store object containing the data to be added.
 */
export function addStore(inputStore: IStore) {
  if (!inputStore) return
  for (const key in inputStore) {
    if (Object.prototype.hasOwnProperty.call(inputStore, key)) {
      switch (key) {
        case STORE_KEYS.MASTER_DATA:
          addMasterData(inputStore[key] as IStore['MASTER_DATA'])
          break
        case STORE_KEYS.SCRIPT_ID_INDEX:
          addScripIdIndexes(inputStore[key] as IStore['SCRIPT_ID_INDEX'])
          break
        case STORE_KEYS.DERIVATIVES_INDEX:
          addDerivativeIndexes(inputStore[key] as IStore['DERIVATIVES_INDEX'])
          break
        case STORE_KEYS.SEARCH_STRING_INDEX:
          addSearchStringIndexes(
            inputStore[key] as IStore['SEARCH_STRING_INDEX']
          )
          break
        case STORE_KEYS.ISIN_CODE_INDEX:
          addIsinCodeIndexex(inputStore[key] as IStore['ISIN_CODE_INDEX'])
          break
        default:
          break
      }
    }
  }
}

/**
 * Adds master data to the store.
 *
 * @param {IStore["MASTER_DATA"]} data The master data to be added to the store.
 */
export function addMasterData(data: IStore['MASTER_DATA']) {
  store[STORE_KEYS.MASTER_DATA] = data
}

/**
 * Adds script ID index data to the store.
 *
 * @param {IStore["SCRIPT_ID_INDEX"]} data The script ID index data to be added to the store.
 */
export function addScripIdIndexes(data: IStore['SCRIPT_ID_INDEX']) {
  store[STORE_KEYS.SCRIPT_ID_INDEX] = data
}

/**
 * Adds derivatives index data to the store.
 *
 * @param {IStore["DERIVATIVES_INDEX"]} data The derivatives index data to be added to the store.
 */
export function addDerivativeIndexes(data: IStore['DERIVATIVES_INDEX']) {
  store[STORE_KEYS.DERIVATIVES_INDEX] = data
}

/**
 * Adds ISIN code index data to the store.
 *
 * @param {IStore["ISIN_CODE_INDEX"]} data The ISIN code index data to be added to the store.
 */
export function addIsinCodeIndexex(data: IStore['ISIN_CODE_INDEX']) {
  store[STORE_KEYS.ISIN_CODE_INDEX] = data
}
/**
 * Adds search string index data to the store.
 *
 * @param {IStore["SEARCH_STRING_INDEX"]} data The search string index data to be added to the store.
 */
export function addSearchStringIndexes(data: IStore['SEARCH_STRING_INDEX']) {
  store[STORE_KEYS.SEARCH_STRING_INDEX] = data
}

/**
 * Retrieves the master data from the store.
 *
 * @returns {TMasterData} The master data stored in the store.
 */
export function getMasterData() {
  return store[STORE_KEYS.MASTER_DATA] || {}
}

/**
 * Retrieves the script ID index data from the store.
 *
 * @returns {TScriptIdIndex} The script ID index data stored in the store.
 */
export function getScripIndex() {
  return store[STORE_KEYS.SCRIPT_ID_INDEX] || {}
}

/**
 * Retrieves the derivatives index data from the store.
 *
 * @returns {TDerivativesIndex} The derivatives index data stored in the store.
 */
export function getDerivativeIndex() {
  return store[STORE_KEYS.DERIVATIVES_INDEX] || {}
}

/**
 * Retrieves the search string index data from the store.
 *
 * @returns {TSearchStringIndex} The search string index data stored in the store.
 */
export function getSearchIndex() {
  return store[STORE_KEYS.SEARCH_STRING_INDEX] || {}
}

/**
 * Retrieves the ISIN code index data from the store.
 *
 * @returns {IIsinCodeIndex} The ISIN code index data stored in the store.
 */
export function getIsinIndex() {
  return store[STORE_KEYS.ISIN_CODE_INDEX] || {}
}

/**
 * Sets the security master initialization status in the store to true.
 *
 */
export function setSecurityMasterInitializationStatus() {
  store[STORE_KEYS.IS_SECURITY_MASTER_INITIALIZED] = true
}

/**
 * Retrieves the security master initialization status from the store.
 *
 * @returns {boolean} The security master initialization status.
 */
export function getSecurityMasterInitializationStatus(): boolean {
  return store[STORE_KEYS.IS_SECURITY_MASTER_INITIALIZED] as boolean
}

export default store
