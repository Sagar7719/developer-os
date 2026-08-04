import { body } from 'express-validator';

export const updateSettingsValidation = [
  body('general.siteName').optional().trim().notEmpty().withMessage('Site name cannot be empty'),
  body('general.siteDescription').optional().trim(),
  body('general.logoUrl').optional().trim(),
  body('general.faviconUrl').optional().trim(),

  body('hero.name').optional().trim().notEmpty().withMessage('Hero name cannot be empty'),
  body('hero.title').optional().trim(),
  body('hero.subtitle').optional().trim(),
  body('hero.primaryCtaText').optional().trim(),
  body('hero.primaryCtaUrl').optional().trim(),
  body('hero.secondaryCtaText').optional().trim(),
  body('hero.secondaryCtaUrl').optional().trim(),
  body('hero.resumeUrl').optional().trim(),
  body('hero.availableForWork').optional().isBoolean().withMessage('availableForWork must be a boolean'),

  body('about.biography').optional().trim(),
  body('about.experienceYears').optional().isInt({ min: 0 }).withMessage('Experience years must be a positive integer'),
  body('about.location').optional().trim(),

  body('socialLinks.github').optional().trim(),
  body('socialLinks.linkedin').optional().trim(),
  body('socialLinks.twitter').optional().trim(),
  body('socialLinks.email').optional().trim(),
  body('socialLinks.portfolio').optional().trim(),

  body('contactInfo.publicEmail').optional().trim(),
  body('contactInfo.phone').optional().trim(),
  body('contactInfo.address').optional().trim(),

  body('seo.defaultTitle').optional().trim(),
  body('seo.defaultDescription').optional().trim(),
  body('seo.defaultKeywords').optional().isArray().withMessage('defaultKeywords must be an array of strings'),
  body('seo.openGraphImage').optional().trim(),

  body('footer.copyrightText').optional().trim(),
  body('footer.footerText').optional().trim(),

  body('futureReady.googleAnalyticsId').optional().trim(),
  body('futureReady.googleSearchConsole').optional().trim(),
  body('futureReady.microsoftClarity').optional().trim(),
  body('futureReady.metaPixel').optional().trim(),

  body('maintenance.enabled').optional().isBoolean().withMessage('maintenance.enabled must be a boolean'),
  body('maintenance.message').optional().trim(),
  body('maintenance.estimatedBack').optional().trim(),
  body('maintenance.allowedIPs').optional().isArray().withMessage('maintenance.allowedIPs must be an array'),
];

export default {
  updateSettingsValidation,
};
