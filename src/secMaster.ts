import {
  getDerivativeIndex,
  getIsinIndex,
  getMasterData,
  getScripIndex
} from './store/index'
import { IScript, TScriptPopulate } from './TYPES/Script'
import {
  MASTER_DATA_SEGMENTS,
  TMasterDataDerivatives,
  TMasterDataEquity,
  TMasterDataUnderlying,
  TScriptIdIndexValue
} from './TYPES/Store'
import { memoize } from './Utils/memoized'

/**
 * Retrieves a script object by its `scriptId`, optionally populating additional properties.
 *
 *  @param scriptId - The unique identifier of the script to retrieve.
 * @param [populate] - An optional array of properties to include in the returned object.
 * @returns - The script object or `undefined` if not found.
 */
const _getScripByScripId = (
  scriptId: IScript['scriptId'],
  populate?: TScriptPopulate
) => {
  const scriptIdIndex = getScripIndex()

  if (!scriptIdIndex) {
    // TODO: Beautify
    console.warn('ScriptIdIndex not found in store')
    return
  }

  const locations = scriptIdIndex[scriptId]

  if (!locations) {
    return
  }

  return getScriptByScriptIdIndexValue(locations, populate)
}

/**
 * Memoized version of `_getScripByScripId` for optimized retrieval.
 */
export const getScripByScripId = memoize(_getScripByScripId, 100)

/**
 * Retrieves multiple scripts by their `scriptId`s, optionally populating additional properties.
 *
 * @param scriptIds - An array of `scriptId`s to retrieve.
 * @param [populate] - An optional array of properties to include in the returned objects.
 * @returns An array of script objects.
 */
export const getScripsByScripIds = (
  scriptIds: IScript['scriptId'][],
  populate?: TScriptPopulate
) => {
  if (!scriptIds) {
    return []
  }

  const scripts = scriptIds
    .map(scriptId => getScripByScripId(scriptId, populate))
    .filter(script => script !== undefined)
  return scripts
}

/**
 * Retrieves scripts by their ISIN code, optionally populating additional properties.
 *
 * @param isinCode - The ISIN code to search for.
 * @param [populate] - An optional array of properties to include in the returned objects.
 * @returns An array of script objects or an empty array if none are found.
 */
export const getScripsByIsinCode = (
  isinCode: IScript['isinCode'],
  populate?: TScriptPopulate
) => {
  const isinCodeIndex = getIsinIndex()

  if (!isinCode) {
    return []
  }

  if (!isinCodeIndex) {
    // TODO: Beautify
    console.warn('isinCodeIndex not found in store')
    return
  }

  const scriptIds = isinCodeIndex[isinCode]
  return getScripsByScripIds(scriptIds, populate)
}

/**
 * Retrieves derivative scripts associated with a specific `scriptId`, filtered by derivative type.
 *
 * @param scriptId - The unique identifier of the script to retrieve derivatives for.
 * @param [derivativeType="BOTH"] - The type of derivatives to retrieve: `FUTURES`, `OPTIONS`, or `BOTH`.
 * @param [populate] - An optional array of properties to include in the returned objects.
 * @returns An object containing arrays of derivative scripts by type, or an empty object if none are found.
 */
export const getDerivativeScripsByScripId = (
  scriptId: IScript['scriptId'],
  derivativeType: 'FUTURES' | 'OPTIONS' | 'BOTH' = 'BOTH',
  populate?: TScriptPopulate
) => {
  const script = getScripByScripId(scriptId, populate)

  if (!script) {
    return {}
  }

  const { underlying, isinCode, exchange, instrumentType } = script

  let underlyingId: IScript['underlying'] = underlying
  if (!underlyingId) {
    if (exchange === 'NSE' && instrumentType === 'EQUITY') {
      underlyingId = scriptId
    }

    if (!isinCode) {
      return {}
    }

    const isinCodeIndex = getIsinIndex()
    if (!isinCodeIndex) {
      // TODO: Beautify
      console.warn('isinCodeIndex not found in store')
      return {}
    }

    if (exchange === 'BSE') {
      const scriptIds = isinCodeIndex && isinCodeIndex[isinCode]
      const nseScriptId = scriptIds.filter(
        scriptIdentifier => scriptIdentifier !== scriptId
      )[0]
      underlyingId = nseScriptId
    }
  }

  const derivativesIndex = getDerivativeIndex()
  if (!derivativesIndex) {
    // TODO: Beautify
    console.warn('derivativesIndex not found in store')
    return {}
  }

  const derivativesScriptIdsObj =
    (underlyingId && derivativesIndex[underlyingId]) || null

  if (derivativesScriptIdsObj) {
    if (derivativeType === 'BOTH') {
      return {
        FUTURES: getScripsByScripIds(derivativesScriptIdsObj.FUTURES, populate),
        OPTIONS: getScripsByScripIds(derivativesScriptIdsObj.OPTIONS, populate)
      }
    } else if (derivativeType === 'FUTURES') {
      return {
        FUTURES: getScripsByScripIds(derivativesScriptIdsObj.FUTURES, populate)
      }
    } else {
      return {
        OPTIONS: getScripsByScripIds(derivativesScriptIdsObj.OPTIONS, populate)
      }
    }
  }
}

/**
 * Retrieves a script object by its index value, optionally populating additional properties.
 *
 *
 * @param scriptIdIndexValue - The index value associated with the script.
 * @param [populate=[]] - An optional array of properties to include in the returned object.
 * @returns The script object or a partial object with populated properties, or `undefined` if not found.
 */
export const getScriptByScriptIdIndexValue = (
  scriptIdIndexValue: TScriptIdIndexValue,
  populate: TScriptPopulate = []
): IScript | undefined | Pick<IScript, TScriptPopulate[number]> => {
  const { instrumentType } = _getSegmentDetails(scriptIdIndexValue[0])

  let script: IScript | undefined
  if (instrumentType === 'EQUITY') {
    script = _mapFlattenEquityScriptToScript(scriptIdIndexValue)
  } else if (instrumentType === 'UNDERLYING') {
    script = _mapFlattenUnderlingScriptToScript(scriptIdIndexValue)
  } else {
    script = _mapFlattenDerivativeScriptToScript(scriptIdIndexValue)
  }

  if (populate.length && script) {
    const scriptObj = Object.fromEntries(
      populate.filter(key => key in script).map(key => [key, script[key]])
    ) as Pick<IScript, keyof IScript>
    return scriptObj
  }

  return script
}

/**
 * Parses and retrieves the segment details from a master data segment identifier.
 *
 * @param masterDataSegment - The segment identifier to parse.
 * @returns An object containing the segment, exchange, and instrument type.
 */
const _getSegmentDetails = (masterDataSegment: MASTER_DATA_SEGMENTS) => {
  const [exchange, segment, instrumentType] = masterDataSegment.split('_') as [
    IScript['exchange'],
    IScript['segment'],
    IScript['instrumentType']
  ]
  const scriptObj: Pick<IScript, 'segment' | 'exchange' | 'instrumentType'> = {
    segment,
    exchange,
    instrumentType
  }
  return scriptObj
}

/**
 * Maps and flattens equity script data to a script object.
 *
 * @param locations - The script index value to map.
 * @returns The script object or `undefined` if not found.
 */
const _mapFlattenEquityScriptToScript = (locations: TScriptIdIndexValue) => {
  const masterData = getMasterData()

  if (!masterData) {
    // TODO: Beautify
    console.warn('masterData not found in store')
    return
  }

  const [masterDataSegment, scriptIndex] = locations

  const { segment, exchange, instrumentType } =
    _getSegmentDetails(masterDataSegment)

  const segmentData = masterData[masterDataSegment] as TMasterDataEquity[]
  const flattenEquityScript = segmentData[scriptIndex]

  const [
    scriptId,
    odinTokenId,
    exchangeSecurityId,
    aslAllowed,
    exchangeSymbol,
    exchangeSeries,
    isinCode,
    coName,
    lotSize,
    tickSize,
    nriAllowed,
    closePrice,
    assetClass,
    searchable,
    searchPriority,
    yesterdayOpenInt,
    maxSingleOrderQty,
    underlying,
    asmFlag,
    odinLlfcSegmentId,
    cmotsCoCode,
    dprLow,
    dprHigh,
    fiftyTwoWeekLow,
    fiftyTwoWeekHigh
  ] = flattenEquityScript

  const scriptObj: IScript = {
    segment,
    exchange,
    instrumentType,
    scriptId,
    odinTokenId,
    exchangeSecurityId,
    aslAllowed,
    exchangeSymbol,
    exchangeSeries,
    isinCode,
    coName,
    lotSize,
    tickSize,
    nriAllowed,
    closePrice,
    assetClass,
    searchable,
    searchPriority,
    yesterdayOpenInt,
    maxSingleOrderQty,
    underlying,
    asmFlag,
    odinLlfcSegmentId,
    cmotsCoCode,
    dprLow,
    dprHigh,
    fiftyTwoWeekLow,
    fiftyTwoWeekHigh
  }

  return scriptObj
}

/**
 * Maps and flattens underlying script data to a script object.
 *
 * @param locations - The script index value to map.
 * @returns The script object or `undefined` if not found.
 */
const _mapFlattenUnderlingScriptToScript = (locations: TScriptIdIndexValue) => {
  const masterData = getMasterData()

  if (!masterData) {
    // TODO: Beautify
    console.warn('masterData not found in store')
    return
  }

  const [masterDataSegment, scriptIndex] = locations

  const { segment, exchange, instrumentType } =
    _getSegmentDetails(masterDataSegment)

  const segmentData = masterData[masterDataSegment] as TMasterDataUnderlying[]
  const flattenEquityScript = segmentData[scriptIndex]

  const [
    scriptId,
    odinTokenId,
    exchangeSecurityId,
    aslAllowed,
    exchangeSymbol,
    coName,
    lotSize,
    tickSize,
    nriAllowed,
    closePrice,
    assetClass,
    searchable,
    searchPriority,
    yesterdayOpenInt,
    underlying,
    asmFlag,
    odinLlfcSegmentId,
    cmotsCoCode,
    dprLow,
    dprHigh,
    fiftyTwoWeekLow,
    fiftyTwoWeekHigh
  ] = flattenEquityScript

  const scriptObj: IScript = {
    segment,
    exchange,
    instrumentType,
    scriptId,
    odinTokenId,
    exchangeSecurityId,
    aslAllowed,
    exchangeSymbol,
    coName,
    lotSize,
    tickSize,
    nriAllowed,
    closePrice,
    assetClass,
    searchable,
    searchPriority,
    yesterdayOpenInt,
    underlying,
    asmFlag,
    odinLlfcSegmentId,
    cmotsCoCode,
    dprLow,
    dprHigh,
    fiftyTwoWeekLow,
    fiftyTwoWeekHigh
  }

  return scriptObj
}

/**
 * Maps and flattens derivative script data to a script object.
 *
 * @param locations - The script index value to map.
 * @returns The script object or `undefined` if not found.
 */
const _mapFlattenDerivativeScriptToScript = (
  locations: TScriptIdIndexValue
) => {
  const masterData = getMasterData()

  if (!masterData) {
    // TODO: Beautify
    console.warn('masterData not found in store')
    return
  }

  const [
    masterDataSegment,
    scriptIndex,
    derivativesIndex,
    derivativesScriptIndex
  ] = locations

  const { segment, exchange, instrumentType } =
    _getSegmentDetails(masterDataSegment)

  const segmentData = masterData[masterDataSegment] as TMasterDataDerivatives[]
  const flattenDerivative = segmentData[scriptIndex]
  const [exchangeSymbol, _, assetClass, flattenDerivativeScripts] =
    flattenDerivative
  const flattenDerivativeScript =
    flattenDerivativeScripts[derivativesScriptIndex!]

  if (flattenDerivativeScript) {
    const [
      scriptId,
      odinTokenId,
      exchangeSecurityId,
      aslAllowed,
      coName,
      expiryDate,
      strikePrice,
      optionType,
      lotSize,
      tickSize,
      nriAllowed,
      closePrice,
      searchable,
      searchPriority,
      yesterdayOpenInt,
      maxSingleOrderQty,
      underlying,
      asmFlag,
      odinLlfcSegmentId,
      cmotsCoCode,
      dprLow,
      dprHigh,
      fiftyTwoWeekLow,
      fiftyTwoWeekHigh
    ] = flattenDerivativeScript

    const scriptObj: IScript = {
      segment,
      exchange,
      instrumentType,
      exchangeSymbol,
      assetClass,
      scriptId,
      odinTokenId,
      exchangeSecurityId,
      aslAllowed,
      coName,
      expiryDate,
      strikePrice,
      optionType,
      lotSize,
      tickSize,
      nriAllowed,
      closePrice,
      searchable,
      searchPriority,
      yesterdayOpenInt,
      maxSingleOrderQty,
      underlying,
      asmFlag,
      odinLlfcSegmentId,
      cmotsCoCode,
      dprLow,
      dprHigh,
      fiftyTwoWeekLow,
      fiftyTwoWeekHigh
    }

    return scriptObj
  }
}
