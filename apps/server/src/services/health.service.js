import { healthRepository } from '../repositories/health.repository.js';
import { config } from '../config/env.config.js';

/**
 * Health Service — Layer 3: System metrics calculation & health orchestration.
 */
export class HealthService {
  /**
   * Generates health metrics object including process uptime, memory usage, environment, and DB status.
   * @returns {Promise<Object>}
   */
  async getHealthStatus() {
    const dbHealth = await healthRepository.pingDatabase();
    const memoryUsage = process.memoryUsage();

    return {
      service: 'Developer OS API Service',
      brand: 'Sagar.dev',
      environment: config.env,
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      database: dbHealth,
    };
  }
}

export const healthService = new HealthService();
export default healthService;
