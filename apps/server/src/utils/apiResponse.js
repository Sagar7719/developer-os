import { HttpStatus } from '../constants/httpStatus.js';
import { ResponseMessages } from '../constants/responseMessages.js';

/**
 * Standardized API Response helper for consistent JSON API envelopes across Developer OS.
 */
export class ApiResponse {
  /**
   * Constructs a success payload envelope.
   * @param {Object} options
   * @param {number} [options.statusCode=200]
   * @param {string} [options.message]
   * @param {any} [options.data=null]
   * @returns {{ success: true, statusCode: number, message: string, data: any, timestamp: string }}
   */
  static success({ statusCode = HttpStatus.OK, message = ResponseMessages.SUCCESS, data = null }) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Constructs an error payload envelope.
   * @param {Object} options
   * @param {number} [options.statusCode=500]
   * @param {string} [options.message]
   * @param {Array|null} [options.errors=null]
   * @param {string|null} [options.stack=null]
   * @returns {{ success: false, statusCode: number, message: string, errors: Array|null, timestamp: string, stack?: string }}
   */
  static error({ statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message = ResponseMessages.INTERNAL_SERVER_ERROR, errors = null, stack = null }) {
    const payload = {
      success: false,
      statusCode,
      message,
      errors: errors && errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString(),
    };

    if (stack) {
      payload.stack = stack;
    }

    return payload;
  }
}

export default ApiResponse;
