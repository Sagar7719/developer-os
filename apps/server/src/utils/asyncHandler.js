/**
 * Higher-order function wrapping async route controllers to catch errors and forward them to Express next().
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
