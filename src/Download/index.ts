import { IConfig } from '../TYPES/Config'
import DownloadManager from './DownloadManager'

/**
 * Default configuration values for the module
 */
const DEFAULT_VALUES = { requireSearchModule: false }

/**
 * Initializes the download process by creating an instance of DownloadManager.
 *
 * @param {string} secMasterURL - The URL of the sec master file to be downloaded.
 * @param {IConfig} [config=DEFAULT_VALUES] - Optional configuration for the download manager.
 * Defaults to `{ requireSearchModule: false }` if not provided.
 * @returns {void}
 */
export function initializeDownload(
  secMasterURL: string,
  config: IConfig = DEFAULT_VALUES
) {
  new DownloadManager(secMasterURL, config)
}
