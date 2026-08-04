import Settings from '../models/settings.model.js';

export class SettingsRepository {
  /**
   * Find or initialize singleton site settings document
   */
  static async getSettings() {
    let settings = await Settings.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'site_settings' });
    }
    return settings;
  }

  /**
   * Update site settings singleton document
   */
  static async updateSettings(updateData, userId) {
    let settings = await Settings.findOne({ key: 'site_settings' });
    if (!settings) {
      settings = new Settings({ key: 'site_settings' });
    }

    // Merge nested configuration fields
    if (updateData.general) Object.assign(settings.general, updateData.general);
    if (updateData.hero) Object.assign(settings.hero, updateData.hero);
    if (updateData.about) Object.assign(settings.about, updateData.about);
    if (updateData.socialLinks) Object.assign(settings.socialLinks, updateData.socialLinks);
    if (updateData.contactInfo) Object.assign(settings.contactInfo, updateData.contactInfo);
    if (updateData.seo) Object.assign(settings.seo, updateData.seo);
    if (updateData.footer) Object.assign(settings.footer, updateData.footer);
    if (updateData.futureReady) Object.assign(settings.futureReady, updateData.futureReady);
    if (updateData.maintenance) Object.assign(settings.maintenance, updateData.maintenance);

    if (userId) {
      settings.updatedBy = userId;
    }

    return await settings.save();
  }
}

export default SettingsRepository;
