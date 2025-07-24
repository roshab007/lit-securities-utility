/**
 * @ignore
 *
 * @module ErrorMessages
 * Collection of error messages used throughout the security utility
 */

/**
 * Error message displayed when security master URL is missing or invalid
 * @example
 * ```typescript
 * throw new Error(INVALID_SECURITY_MASTER_URL);
 * ```
 */

export const INVALID_SECURITY_MASTER_URL =
  'Invalid or No Security master URL provided'

export const SECURITY_MASTER_NOT_INITIALIZED =
  "Security master isn't downloaded or initialized"
