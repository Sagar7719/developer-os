import { Project } from '../models/project.model.js';
import { Skill } from '../models/skill.model.js';
import { Experience } from '../models/experience.model.js';

/**
 * DashboardRepository — Layer 4: Data Access abstraction for aggregated system metrics.
 */
export class DashboardRepository {
  /**
   * Retrieves raw statistical metrics from Project, Skill, and Experience collections.
   * @returns {Promise<{ totalProjects: number, totalSkills: number, totalExperiences: number, totalTechnologies: number, earliestStartDate: Date|null }>}
   */
  async getRawStats() {
    const [
      totalProjects,
      totalSkills,
      totalExperiences,
      projectTechs,
      experienceTechs,
      skillNames,
      earliestExperience,
    ] = await Promise.all([
      Project.countDocuments({ isDeleted: false }),
      Skill.countDocuments({ isDeleted: false }),
      Experience.countDocuments({ isDeleted: false }),
      Project.distinct('techStack', { isDeleted: false }),
      Experience.distinct('techStack', { isDeleted: false }),
      Skill.distinct('name', { isDeleted: false }),
      Experience.findOne({ isDeleted: false }).sort({ startDate: 1 }).select('startDate').exec(),
    ]);

    // Consolidate unique technology values across all three collections
    const uniqueTechSet = new Set();

    [...projectTechs, ...experienceTechs, ...skillNames].forEach((item) => {
      if (typeof item === 'string' && item.trim().length > 0) {
        uniqueTechSet.add(item.trim().toLowerCase());
      }
    });

    return {
      totalProjects,
      totalSkills,
      totalExperiences,
      totalTechnologies: uniqueTechSet.size,
      earliestStartDate: earliestExperience ? earliestExperience.startDate : null,
    };
  }
}

export const dashboardRepository = new DashboardRepository();
export default dashboardRepository;
