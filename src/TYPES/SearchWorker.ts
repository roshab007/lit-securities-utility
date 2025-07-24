/**
 * Defines the structure of constants used to interact with a web worker.
 * Each property represents a specific action or lifecycle event for the worker.
 * These constants help ensure consistency when managing the worker's lifecycle
 * and communication with the main thread.
 *
 * @interface IWorkerConstantsOptions
 *
 * @property {string} init - The constant representing the initialization event of the worker.
 * This action is used when setting up or preparing the worker for execution.
 *
 * @property {string} start - The constant representing the start event of the worker.
 * This action triggers the worker to begin its task or processing.
 *
 * @property {string} search - The constant representing the search event for the worker.
 * This action is used when the worker is required to perform a search operation.
 *
 * @property {string} terminate - The constant representing the terminate event of the worker.
 * This action signals the worker to stop its execution and clean up resources.
 */

export interface IWorkerConstantsOptions {
  /**
   * The constant used to initialize the worker. It indicates that
   * the worker is being set up or prepared for execution.
   *
   * @type {string}
   */
  init: string
  /**
   * The constant used to signal the worker to start its main task.
   * This is typically called after initialization to commence processing.
   *
   * @type {string}
   */
  start: string
  /**
   * The constant used to instruct the worker to perform a search operation.
   * This is commonly used when the worker is expected to process and retrieve specific data.
   *
   * @type {string}
   */
  search: string
  /**
   * The constant used to terminate the worker's execution. It ensures
   * proper cleanup and halts any ongoing tasks within the worker.
   *
   * @type {string}
   */
  terminate: string
}
