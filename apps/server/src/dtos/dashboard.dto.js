/**
 * Dashboard Data Transfer Object (DTO).
 * Sanitizes Dashboard statistics payloads before returning API responses.
 */
export class DashboardDTO {
  /**
   * @param {Object} stats - Raw metrics calculated from database repositories
   */
  constructor(stats = {}) {
    this.totalProjects = stats.totalProjects || 0;
    this.totalSkills = stats.totalSkills || 0;
    this.totalExperiences = stats.totalExperiences || 0;
    this.totalTechnologies = stats.totalTechnologies || 0;
    this.experienceYears = stats.experienceYears || 0;
  }

  /**
   * Transforms raw stats metrics to DashboardDTO.
   * @param {Object} data
   * @returns {DashboardDTO|null}
   */
  static from(data) {
    if (!data) return null;
    return new DashboardDTO(data);
  }
}

export default DashboardDTO;
