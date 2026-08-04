/**
 * Centralized Maintenance Mode Bypass Route Configuration
 * Additional routes (e.g. '/api-docs', '/status', '/health') can be added here
 * without modifying guard component logic.
 */
export const MAINTENANCE_BYPASS_ROUTES = ['/admin'];

/**
 * Checks whether a given pathname matches any configured maintenance bypass routes.
 * @param {string} pathname - Current browser route pathname
 * @returns {boolean} True if route should bypass maintenance guard mode
 */
export function isMaintenanceBypassRoute(pathname) {
  if (!pathname) return false;
  return MAINTENANCE_BYPASS_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

export default {
  MAINTENANCE_BYPASS_ROUTES,
  isMaintenanceBypassRoute,
};
