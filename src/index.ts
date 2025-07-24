/**
 * @module SecurityUtility
 * Main module for security master initialization and data retrieval
 */
import { INVALID_SECURITY_MASTER_URL } from './Constants/ERROR_MESSAGE'
import { initializeDownload } from './Download/index'
import { getSecurityMasterInitializationStatus } from './store'
import { IConfig } from './TYPES/Config'

export {
  getScripByScripId,
  getDerivativeScripsByScripId,
  getScripsByIsinCode,
  getScripsByScripIds
} from './secMaster'

export * from './Search/SearchManager'

/** Configuration object defining the default values for system modules.
 * - `requireSearchModule`: Specifies whether the search module is required (default: `false`).
 * - `requireSocketModule`: Specifies whether the socket module is required (default: `false`).
 */
const DEFAULT_VALUES: IConfig = {
  requireSearchModule: false,
  requireSocketModule: false
}

/**
 * Initializes the system by setting up the security master download and preparing the required modules.
 *
 * @param {string} secMasterURL - The URL for the security master, used for downloading data and setting up indexes.
 * @param {IConfig} [config=DEFAULT_VALUES] - Configuration object to customize the initialization behavior.
 *   - `requireSearchModule` {boolean} - Specifies whether the search module is required (default: `false`).
 *   - `requireSocketModule` {boolean} - Specifies whether the socket module is required (default: `false`).
 *
 * @throws A warning if `secMasterURL` is invalid or not provided.
 */
export function initialize(
  secMasterURL: string,
  config: IConfig = DEFAULT_VALUES
) {
  if (secMasterURL) {
    // NOTE: initializing security master download and preparing indexes
    initializeDownload(secMasterURL, config)

    // TODO: initiate the socket worker setup here
    return
  }
  console.warn(INVALID_SECURITY_MASTER_URL)
}

/**
 * Checks if the security master has been successfully loaded and initialized.
 *
 * @returns {boolean} - `true` if the security master is initialized, otherwise `false`.
 */
export function isSecurityMasterLoaded(): boolean {
  return getSecurityMasterInitializationStatus()
}
