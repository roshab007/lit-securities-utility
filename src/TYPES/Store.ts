import { STORE_KEYS } from '../Constants/STORE_KEYS'
import { IScript } from './Script'

/**
 * Enum representing the different segments of master data for securities.
 * These segments correspond to various asset classes (equity, derivatives, etc.)
 * on different exchanges (NSE, BSE, MCX, NCDEX).
 *
 * @enum {string}
 * @readonly
 */
export enum MASTER_DATA_SEGMENTS {
  NSE_EQ_EQUITY = 'NSE_EQ_EQUITY',
  BSE_EQ_EQUITY = 'BSE_EQ_EQUITY',
  NSE_FO_FUTSTK = 'NSE_FO_FUTSTK',
  NSE_FO_FUTIDX = 'NSE_FO_FUTIDX',
  NSE_FO_OPTIDX = 'NSE_FO_OPTIDX',
  NSE_FO_OPTSTK = 'NSE_FO_OPTSTK',
  NSE_CURR_FUTCUR = 'NSE_CURR_FUTCUR',
  NSE_CURR_OPTCUR = 'NSE_CURR_OPTCUR',
  MCX_COMM_OPTFUT = 'MCX_COMM_OPTFUT',
  MCX_COMM_FUTCOM = 'MCX_COMM_FUTCOM',
  NCDEX_COMM_OPTFUT = 'NCDEX_COMM_OPTFUT',
  NCDEX_COMM_FUTCOM = 'NCDEX_COMM_FUTCOM',
  NSE_CURR_UNDERLYING = 'NSE_CURR_UNDERLYING',
  MCX_COMM_UNDERLYING = 'MCX_COMM_UNDERLYING',
  NCDEX_COMM_UNDERLYING = 'NCDEX_COMM_UNDERLYING',
  NSE_EQ_UNDERLYING = 'NSE_EQ_UNDERLYING',
  BSE_EQ_UNDERLYING = 'BSE_EQ_UNDERLYING'
}

/**
 * Type for the keys of the MASTER_DATA_SEGMENTS enum.
 * Represents the valid segment keys in the master data.
 *
 * @type {TMasterDataSegmentKeys}
 */
export type TMasterDataSegmentKeys = keyof typeof MASTER_DATA_SEGMENTS

/**
 * Type representing the script ID from the IScript interface.
 *
 * @type {TScriptId}
 */
type TScriptId = IScript['scriptId']

/**
 * Type representing the structure of master data for equity securities.
 * It contains various properties related to equity scripts such as scriptId, coName, lotSize, and more.
 *
 * @type {TMasterDataEquity}
 */
export type TMasterDataEquity = [
  TScriptId,
  IScript['odinTokenId'],
  IScript['exchangeSecurityId'],
  IScript['aslAllowed'],
  IScript['exchangeSymbol'],
  IScript['exchangeSeries'],
  IScript['isinCode'],
  IScript['coName'],
  IScript['lotSize'],
  IScript['tickSize'],
  IScript['nriAllowed'],
  IScript['closePrice'],
  IScript['assetClass'],
  IScript['searchable'],
  IScript['searchPriority'],
  IScript['yesterdayOpenInt'],
  IScript['maxSingleOrderQty'],
  IScript['underlying'],
  IScript['asmFlag'],
  IScript['odinLlfcSegmentId'],
  IScript['cmotsCoCode'],
  IScript['dprLow'],
  IScript['dprHigh'],
  IScript['fiftyTwoWeekLow'],
  IScript['fiftyTwoWeekHigh']
]

/**
 * Type representing the structure of master data for underlying securities.
 * It contains similar properties as equity but tailored for underlying securities.
 *
 * @type {TMasterDataUnderlying}
 */
export type TMasterDataUnderlying = [
  TScriptId,
  IScript['odinTokenId'],
  IScript['exchangeSecurityId'],
  IScript['aslAllowed'],
  IScript['exchangeSymbol'],
  IScript['coName'],
  IScript['lotSize'],
  IScript['tickSize'],
  IScript['nriAllowed'],
  IScript['closePrice'],
  IScript['assetClass'],
  IScript['searchable'],
  IScript['searchPriority'],
  IScript['yesterdayOpenInt'],
  IScript['underlying'],
  IScript['asmFlag'],
  IScript['odinLlfcSegmentId'],
  IScript['cmotsCoCode'],
  IScript['dprLow'],
  IScript['dprHigh'],
  IScript['fiftyTwoWeekLow'],
  IScript['fiftyTwoWeekHigh']
]

/**
 * Type representing the structure of master data for derivatives scripts.
 * Includes specific properties like expiryDate, strikePrice, and optionType for derivative instruments.
 *
 * @type {TMasterDataDerivativesScript}
 */
export type TMasterDataDerivativesScript = [
  TScriptId,
  IScript['odinTokenId'],
  IScript['exchangeSecurityId'],
  IScript['aslAllowed'],
  IScript['coName'],
  IScript['expiryDate'],
  IScript['strikePrice'],
  IScript['optionType'],
  IScript['lotSize'],
  IScript['tickSize'],
  IScript['nriAllowed'],
  IScript['closePrice'],
  IScript['searchable'],
  IScript['searchPriority'],
  IScript['yesterdayOpenInt'],
  IScript['maxSingleOrderQty'],
  IScript['underlying'],
  IScript['asmFlag'],
  IScript['odinLlfcSegmentId'],
  IScript['cmotsCoCode'],
  IScript['dprLow'],
  IScript['dprHigh'],
  IScript['fiftyTwoWeekLow'],
  IScript['fiftyTwoWeekHigh']
]

/**
 * Represents the data structure for derivatives in the system.
 * This type includes information about the exchange symbol, underlying asset,
 * asset class, and an array of derivative scripts associated with the derivative.
 */
export type TMasterDataDerivatives = [
  IScript['exchangeSymbol'],
  IScript['underlying'],
  IScript['assetClass'],
  TMasterDataDerivativesScript[]
]

/**
 * Type representing master data for derivative instruments, including a list of derivative scripts.
 *
 * @type {TMasterDataDerivatives}
 */
export type TMasterData = {
  [MASTER_DATA_SEGMENTS.NSE_EQ_EQUITY]?: TMasterDataEquity[]
  [MASTER_DATA_SEGMENTS.BSE_EQ_EQUITY]?: TMasterDataEquity[]
  [MASTER_DATA_SEGMENTS.NSE_FO_FUTSTK]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NSE_FO_FUTIDX]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NSE_FO_OPTIDX]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NSE_FO_OPTSTK]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NSE_CURR_FUTCUR]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NSE_CURR_OPTCUR]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.MCX_COMM_OPTFUT]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.MCX_COMM_FUTCOM]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NCDEX_COMM_OPTFUT]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NCDEX_COMM_FUTCOM]?: TMasterDataDerivatives[]
  [MASTER_DATA_SEGMENTS.NSE_CURR_UNDERLYING]?: TMasterDataUnderlying[]
  [MASTER_DATA_SEGMENTS.MCX_COMM_UNDERLYING]?: TMasterDataUnderlying[]
  [MASTER_DATA_SEGMENTS.NCDEX_COMM_UNDERLYING]?: TMasterDataUnderlying[]
  [MASTER_DATA_SEGMENTS.NSE_EQ_UNDERLYING]?: TMasterDataUnderlying[]
  [MASTER_DATA_SEGMENTS.BSE_EQ_UNDERLYING]?: TMasterDataUnderlying[]
}

/**
 * Type representing the index for script IDs. This is used to store a reference to the master data segment
 * and the index value (could be a single or multi-level index).
 *
 * @type {TScriptIdIndexValue}
 */
export type TScriptIdIndexValue =
  | [MASTER_DATA_SEGMENTS, number]
  | [MASTER_DATA_SEGMENTS, number, number, number]

/**
 * Type representing an index of script IDs.
 * Maps each script ID to its corresponding index value.
 *
 * @type {TScriptIdIndex}
 */
export type TScriptIdIndex = {
  [key: TScriptId]: TScriptIdIndexValue
}

/**
 * Type representing an index for derivatives, including both futures and options.
 * It organizes derivative script IDs by type (FUTURES and OPTIONS).
 *
 * @type {TDerivativesIndex}
 */
export type TDerivativesIndex = {
  [key: TScriptId]: {
    FUTURES: TScriptId[]
    OPTIONS: TScriptId[]
  }
}

/**
 * Type representing a search chunk identifier.
 * This is used for efficient indexing and retrieval of search results.
 *
 * @type {TSearchChunkId}
 */
export type TSearchChunkId = number

/**
 * Type representing a searchable index for chunked data.
 * It maps each search chunk to its relevant search string, data, search priority, and exchange symbol.
 *
 * @type {TSearchStringIndex}
 */
export type TSearchStringIndex = {
  [key: TSearchChunkId]: {
    searchString: IScript['searchable']
    data: TScriptIdIndexValue
    searchPriority: IScript['searchPriority']
    exchangeSymbol: IScript['exchangeSymbol']
  }[]
}

/**
 * Type representing the ISIN code for a security.
 * This is used for indexing securities by their ISIN code.
 *
 * @type {TIsinCode}
 */
type TIsinCode = string // IScript['isinCode'] // TODO: Figure out typescript to remove undefined or null

/**
 * Type representing an index of ISIN codes.
 * Maps each ISIN code to a list of script IDs associated with it.
 *
 * @type {TIsinCodeIndex}
 */
export type TIsinCodeIndex = {
  [key: TIsinCode]: TScriptId[]
}

/**
 * Interface representing the store that holds various indices and master data.
 * This is used for efficient data access and retrieval.
 *
 * @interface IStore
 */
export interface IStore {
  /**
   * Represents the complete master data for all security segments, organized by the MASTER_DATA_SEGMENTS enum.
   *
   * @type {?TMasterData}
   */
  [STORE_KEYS.MASTER_DATA]?: TMasterData
  /**
   * Maps script IDs to their corresponding indices in the master data segments.
   *
   * @type {?TScriptIdIndex}
   */
  [STORE_KEYS.SCRIPT_ID_INDEX]?: TScriptIdIndex
  /**
   * Organizes derivative script IDs by type (futures or options) for efficient access.
   *
   * @type {?TDerivativesIndex}
   */
  [STORE_KEYS.DERIVATIVES_INDEX]?: TDerivativesIndex
  /**
   * Provides a searchable index for chunked master data, including search strings, priorities, and corresponding exchange symbols.
   *
   * @type {?TSearchStringIndex}
   */
  [STORE_KEYS.SEARCH_STRING_INDEX]?: TSearchStringIndex
  /**
   * Maps ISIN codes to their associated script IDs for efficient lookup.
   *
   * @type {?TIsinCodeIndex}
   */
  [STORE_KEYS.ISIN_CODE_INDEX]?: TIsinCodeIndex
  /**
   * Indicates whether the security master data has been fully initialized.
   *
   * @type {?boolean}
   */
  [STORE_KEYS.IS_SECURITY_MASTER_INITIALIZED]?: boolean
}
