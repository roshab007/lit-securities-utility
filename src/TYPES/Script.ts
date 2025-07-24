/**
 * Represents the possible instrument types for financial assets.
 *
 * @type {TInstrumentType}
 * @enum
 */
export type TInstrumentType =
  | 'EQUITY'
  | 'FUTSTK'
  | 'FUTIDX'
  | 'OPTIDX'
  | 'OPTSTK'
  | 'FUTCUR'
  | 'OPTCUR'
  | 'OPTFUT'
  | 'FUTCOM'
  | 'UNDERLYING'

/**
 * Represents the possible exchanges where financial instruments can be traded.
 *
 * @type {TExchange}
 * @enum
 * @readonly
 */
export type TExchange = 'NSE' | 'BSE' | 'MCX' | 'NCDEX'

/**
 * Interface representing a financial script, which contains various details related to a specific instrument in a given exchange and segment.
 *
 * @interface IScript
 */
export interface IScript {
  /**
   * The segment identifier of the financial instrument, specifying its type and categorization within the market (e.g., NSE_EQ_EQUITY).
   *
   * @type {string}
   */
  segment: string
  /**
   * The exchange where the financial instrument is traded (e.g., NSE, BSE, MCX).
   *
   * @type {TExchange}
   */
  exchange: TExchange
  /**
   * The type of the financial instrument (e.g., EQUITY, FUTSTK, OPTIDX).
   *
   * @type {TInstrumentType}
   */
  instrumentType: TInstrumentType

  /**
   * The unique identifier for the script within the system.
   *
   * @type {number}
   */
  scriptId: number // TODO: Change spelling in our code
  /**
   * The identifier used for mapping the script within the Odin trading system.
   *
   * @type {number}
   */
  odinTokenId: number
  /**
   * Indicates if additional surveillance measures are applicable to this script.
   *
   * @type {string}
   */
  aslAllowed: string
  /**
   * The company name associated with the financial instrument.
   *
   * @type {string}
   */
  coName: string // TODO: Change spelling in our code
  /**
   * Indicates if the instrument is available for Non-Resident Indian (NRI) investors.
   *
   * @type {(string | null)}
   */
  nriAllowed: string | null
  /**
   * The symbol used to represent the instrument on the exchange.
   *
   * @type {(string | null)}
   */
  exchangeSymbol: string | null
  /**
   * The classification of the instrument's asset type (e.g., Equity, Derivatives, Commodities).
   *
   * @type {(string | null)}
   */
  assetClass: string | null
  /**
   * The priority value assigned to this instrument for search results, with lower numbers indicating higher priority.
   *
   * @type {(number | null)}
   */
  searchPriority: number | null

  /**
   * The unique identifier for the instrument as defined by the exchange.
   *
   * @type {number}
   */
  exchangeSecurityId: number
  /**
   * The standard trading lot size for the instrument.
   *
   * @type {(number | null)}
   */
  lotSize: number | null // TODO: Change spelling in our code
  /**
   * The minimum price movement allowed for the instrument.
   *
   * @type {(number | null)}
   */
  tickSize: number | null // TODO: Change spelling in our code
  /**
   * The closing price of the instrument from the previous trading day.
   *
   * @type {(number | null)}
   */
  closePrice: number | null // TODO: Change spelling in our code
  /**
   * A string value used for indexing and searching the instrument.
   *
   * @type {string}
   */
  searchable: string
  /**
   * The open interest value for the instrument from the previous trading day.
   *
   * @type {(number | null)}
   */
  yesterdayOpenInt: number | null
  /**
   * The identifier for the underlying asset associated with the instrument, if applicable.
   *
   * @type {(number | null)}
   */
  underlying: number | null // TODO: Change spelling in our code
  /**
   * Indicates if the instrument is subject to additional surveillance measures.
   *
   * @type {(string | null)}
   */
  asmFlag: string | null // TODO: Change spelling in our code
  /**
   * The Odin-specific identifier for the segment to which the instrument belongs.
   *
   * @type {number}
   */
  odinLlfcSegmentId: number // TODO: Change spelling in our code
  /**
   * The identifier for the company in the CMOTS system.
   *
   * @type {number}
   */
  cmotsCoCode: number // TODO: Change spelling in our code
  /**
   * The lower limit of the daily price range for the instrument.
   *
   * @type {number}
   */
  dprLow: number // TODO: Change spelling in our code
  /**
   * The upper limit of the daily price range for the instrument.
   *
   * @type {number}
   */
  dprHigh: number // TODO: Change spelling in our code
  /**
   * The lowest price of the instrument in the last 52 weeks.
   *
   * @type {number}
   */
  fiftyTwoWeekLow: number // TODO: Change spelling in our code
  /**
   * The highest price of the instrument in the last 52 weeks.
   *
   * @type {number}
   */
  fiftyTwoWeekHigh: number // TODO: Change spelling in our code

  // Equity & Derivatives Extra fields
  /**
   * The maximum quantity allowed for a single order of this instrument.
   *
   * @type {?(number | null)}
   */
  maxSingleOrderQty?: number | null

  // Equity Extra fields
  /**
   * The series code of the instrument on the exchange (e.g., EQ, BE).
   *
   * @type {?string}
   */
  exchangeSeries?: string
  /**
   * The International Securities Identification Number (ISIN) for the instrument.
   *
   * @type {?(string | null)}
   */
  isinCode?: string | null

  // Derivatives Extra fields
  /**
   * The expiration date of the derivative contract.
   *
   * @type {?string}
   */
  expiryDate?: string
  /**
   * The strike price for the derivative contract, applicable to options.
   *
   * @type {?number}
   */
  strikePrice?: number
  /**
   * The type of option (e.g., CALL, PUT) for the derivative contract.
   *
   * @type {?string}
   */
  optionType?: string
}

/**
 * A type representing the keys of the IScript interface that are used to populate or extract specific fields of a script.
 *
 * @type {TScriptPopulate}
 * @example
 * const fieldsToPopulate: TScriptPopulate = ['segment', 'exchange', 'instrumentType'];
 */
export type TScriptPopulate = (keyof IScript)[]
