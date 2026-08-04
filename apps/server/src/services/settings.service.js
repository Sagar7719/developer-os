import SettingsRepository from '../repositories/settings.repository.js';
import SettingsDTO from '../dtos/settings.dto.js';

export class SettingsService {
  /**
   * Fetch public settings
   */
  static async getPublicSettings() {
    const settings = await SettingsRepository.getSettings();
    return SettingsDTO.toPublic(settings);
  }

  /**
   * Fetch admin settings with system info
   */
  static async getAdminSettings() {
    const settings = await SettingsRepository.getSettings();
    return SettingsDTO.toAdmin(settings);
  }

  /**
   * Update site settings
   */
  static async updateSettings(updateData, userId) {
    const updatedSettings = await SettingsRepository.updateSettings(updateData, userId);
    return SettingsDTO.toAdmin(updatedSettings);
  }
}

export default SettingsService;
