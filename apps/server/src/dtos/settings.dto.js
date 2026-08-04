export class SettingsDTO {
  /**
   * Format public settings (sanitizing internal keys)
   */
  static toPublic(settings) {
    if (!settings) return {};
    return {
      general: settings.general,
      hero: settings.hero,
      about: settings.about,
      socialLinks: settings.socialLinks,
      contactInfo: settings.contactInfo,
      seo: settings.seo,
      footer: settings.footer,
      maintenance: {
        enabled: settings.maintenance?.enabled || false,
        message: settings.maintenance?.message || '',
        estimatedBack: settings.maintenance?.estimatedBack || '',
      },
    };
  }

  /**
   * Format full admin settings with system information
   */
  static toAdmin(settings) {
    if (!settings) return {};
    return {
      id: settings._id,
      schemaVersion: settings.schemaVersion,
      updatedBy: settings.updatedBy,
      updatedAt: settings.updatedAt,
      general: settings.general,
      hero: settings.hero,
      about: settings.about,
      socialLinks: settings.socialLinks,
      contactInfo: settings.contactInfo,
      seo: settings.seo,
      footer: settings.footer,
      futureReady: settings.futureReady,
      maintenance: settings.maintenance,
      systemInfo: {
        appVersion: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        gitCommit: process.env.GIT_COMMIT_SHA || '6e80a43',
      },
    };
  }
}

export default SettingsDTO;
