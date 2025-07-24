import { SECURITY_MASTER_INITIALIZED } from '../Constants/EVENTS'
import { addStore, setSecurityMasterInitializationStatus } from '../store'
import { IConfig } from '../TYPES/Config'
import DownloadWorker from './DownloadWorker.ts?worker&inline'

// TODO: move this to another file
/**
 * Type representing the structure of messages received from the worker.
 *
 * This type defines the structure of the messages that the main thread receives from the web worker.
 * It includes an `action` string that identifies the type of message, and an optional `data` field
 * which contains additional information related to the action. The shape of `data` depends on the specific action.
 *
 * @typedef {Object} TMessageEvent
 * @property {string} action - The type of message or action being communicated from the worker.
 * @property {any} [data] - Optional data associated with the action. The structure of the data depends on the action.
 */
type TMessageEvent = {
  action: string
  data?: any
}

/**
 * Class responsible for managing the download and processing of security master data.
 *
 * This class uses a web worker to handle downloading and processing data in the background.
 * It sends messages to the worker to initialize the process, and handles messages back from the worker
 * to update the application's store and trigger necessary events when the download is complete.
 *
 * @class DownloadManager
 */
export default class DownloadManager {
  /**
   * Web Worker instance responsible for downloading and processing security master data
   *
   * @private
   * @type {Worker}
   * Handles background tasks including data fetching and processing without blocking the main thread
   */
  worker: Worker
  onsuccess?: () => void
  onerror?: (error?: any) => void
  /**
   * Creates an instance of DownloadManager.
   *
   * @param {string} secMasterURL - The URL to fetch the security master data from. Must be a valid URL.
   * @param {IConfig} config - Configuration object defining the worker's behavior.
   * @throws Will throw an error if the worker cannot be initialized due to invalid arguments or browser restrictions.
   */
  constructor(secMasterURL: string, config: IConfig) {
    this.worker = new DownloadWorker()

    this.worker.postMessage({ action: 'INIT', data: { config, secMasterURL } })
    this.worker.onmessage = this.onMessage
    this.worker.onerror = this.onError
    this.onsuccess = config.onsuccess
    this.onerror = config.onerror
  }

  /**
   * Handles messages received from the worker.
   *
   * @param {MessageEvent<TMessageEvent>} event - The event object containing the message data from the worker.
   * Processes the 'INDEXES_CREATED' action to:
   * - Add the processed security master data with indexes to the application's store.
   * - Update the security master initialization status in the application's state.
   * - Dispatch the `SECURITY_MASTER_INITIALIZED` event to notify the system.
   *
   */
  onMessage = (event: MessageEvent<TMessageEvent>) => {
    const { action } = event.data
    if (action === 'INDEXES_CREATED') {
      const masterDataWithIndexes = event.data?.data
      // TODO: kept this for initial debug - remove it later
      addStore(masterDataWithIndexes)
      setSecurityMasterInitializationStatus()
      dispatchEvent(new Event(SECURITY_MASTER_INITIALIZED))
      this.onsuccess?.()
    }
  }

  /**
   * Handles errors from the worker.
   *
   * Logs the error and provides a grouped console output for easier debugging.
   * Developers should monitor for this in case of unexpected worker behavior.
   *
   */
  onError = (e: any) => {
    this.onerror?.(e)
  }
}
