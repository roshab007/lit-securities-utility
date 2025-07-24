/**
 * Represents the possible segment types for different securities traded in various exchanges.
 * This type helps categorize securities based on their exchange, instrument type, and other related factors.
 *
 * @type {TSecSegmentTypes}
 * @enum
 * @readonly
 */
export type TSecSegmentTypes =
  | 'NSE_EQ_EQUITY'
  | 'BSE_EQ_EQUITY'
  | 'NSE_FO_FUTSTK'
  | 'NSE_FO_FUTIDX'
  | 'NSE_FO_OPTIDX'
  | 'NSE_FO_OPTSTK'
  | 'NSE_CURR_FUTCUR'
  | 'NSE_CURR_OPTCUR'
  | 'MCX_COMM_OPTFUT'
  | 'MCX_COMM_FUTCOM'
  | 'NCDEX_COMM_OPTFUT'
  | 'NCDEX_COMM_FUTCOM'
  | 'NSE_CURR_UNDERLYING'
  | 'MCX_COMM_UNDERLYING'
  | 'NCDEX_COMM_UNDERLYING'
  | 'NSE_EQ_UNDERLYING'
  | 'BSE_EQ_UNDERLYING'

/**
 * Represents the possible structure types of security segments, defining how the data is organized.
 * The structure type determines how the information for a specific security segment is represented.
 *
 * @type {TSecSegmentStructureType}
 * @enum
 * @readonly
 */
type TSecSegmentStructureType = 'FLAT_EQUITY' | 'FLAT_UNDERLYING' | 'NESTED'

/**
 * Interface representing the mapping of a security segment to its structure type.
 * This interface ties a specific security segment type (e.g., NSE_EQ_EQUITY) to a structure type
 * (e.g., FLAT_EQUITY, NESTED) to determine how the data for that segment is organized and represented.
 *
 * @interface ISecSegmentStructureMapType
 *
 * @property {TSecSegmentTypes} name - The security segment type (e.g., NSE_EQ_EQUITY, BSE_EQ_EQUITY).
 * @property {TSecSegmentStructureType} type - The structure type associated with the segment (e.g., FLAT_EQUITY, NESTED).
 */
export interface ISecSegmentStructureMapType {
  /**
   * The type of security segment, representing a category of securities traded in specific exchanges or markets.
   *
   * @type {TSecSegmentTypes}
   */
  name: TSecSegmentTypes
  /**
   * The structure type that defines how the data for the specified security segment is organized.
   *
   * @type {TSecSegmentStructureType}
   */
  type: TSecSegmentStructureType
}
