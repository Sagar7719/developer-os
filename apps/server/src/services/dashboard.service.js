import { dashboardRepository } from '../repositories/dashboard.repository.js';
import { DashboardDTO } from '../dtos/dashboard.dto.js';
import { logger } from '../config/logger.js';

/**
 * DashboardService — Layer 3: Domain logic for aggregating portfolio dashboard statistics.
 */
export class DashboardService {
  /**
   * Calculate aggregated portfolio statistics.
   * @returns {Promise<DashboardDTO>}
   */
  async getDashboardStats() {
    const rawStats = await dashboardRepository.getRawStats();

    let experienceYears = 0;
    if (rawStats.earliestStartDate) {
      const now = new Date();
      const startDate = new Date(rawStats.earliestStartDate);
      const diffMs = now.getTime() - startDate.getTime();

      if (diffMs > 0) {
        const years = diffMs / (365.25 * 24 * 60 * 60 * 1000);
        experienceYears = Math.max(1, Math.floor(years));
      }
    }

    logger.info('[Audit] Dashboard statistics retrieved successfully');

    return DashboardDTO.from({
      totalProjects: rawStats.totalProjects,
      totalSkills: rawStats.totalSkills,
      totalExperiences: rawStats.totalExperiences,
      totalTechnologies: rawStats.totalTechnologies,
      experienceYears,
    });
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
