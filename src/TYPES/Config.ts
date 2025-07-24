/**
 * Configuration interface for modules required in the application.
 * This interface allows defining which modules should be included or required
 * based on the needs of the application.
 *
 * @interface IConfig
 * @property {boolean} requireSearchModule - Flag indicating if the search module should be included.
 * If true, the search module will be included in the application, otherwise it will be excluded.
 * @property {boolean} requireSocketModule - Flag indicating if the socket module should be included.
 * If true, the socket module will be included in the application, otherwise it will be excluded.
 */
export interface IConfig {
  /**
   * Indicates whether the search module should be included in the application.
   * If true, the application will load and enable the search module's functionality.
   *
   * @type {?boolean}
   */
  requireSearchModule?: boolean
  /**
   * Indicates whether the socket module should be included in the application.
   * If true, the application will initialize and enable socket-based communication.
   *
   * @type {?boolean}
   */
  requireSocketModule?: boolean
  onsuccess?: () => void
  onerror?: (error?: any) => void
}
