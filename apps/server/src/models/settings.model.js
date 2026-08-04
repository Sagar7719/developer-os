import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'site_settings',
      unique: true,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    general: {
      siteName: { type: String, default: 'Developer OS' },
      siteDescription: { type: String, default: 'Production-Grade Developer Platform by Sagar.dev' },
      logoUrl: { type: String, default: '' },
      faviconUrl: { type: String, default: '/favicon.svg' },
    },
    hero: {
      name: { type: String, default: 'Sagar' },
      title: { type: String, default: 'Full Stack Engineer & Software Architect' },
      subtitle: { type: String, default: 'Building scalable microservices, cloud infrastructure, and enterprise platforms.' },
      primaryCtaText: { type: String, default: 'View Projects' },
      primaryCtaUrl: { type: String, default: '/projects' },
      secondaryCtaText: { type: String, default: 'Contact Me' },
      secondaryCtaUrl: { type: String, default: '/contact' },
      resumeUrl: { type: String, default: '' },
      availableForWork: { type: Boolean, default: true },
    },
    about: {
      biography: { type: String, default: 'Software engineer specializing in high-performance web applications and cloud computing.' },
      experienceYears: { type: Number, default: 4 },
      location: { type: String, default: 'San Francisco, CA' },
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com/Sagar7719' },
      linkedin: { type: String, default: 'https://linkedin.com/in/sagar' },
      twitter: { type: String, default: '' },
      email: { type: String, default: 'sagar@developer-os.dev' },
      portfolio: { type: String, default: 'https://developer-os.dev' },
    },
    contactInfo: {
      publicEmail: { type: String, default: 'sagar@developer-os.dev' },
      phone: { type: String, default: '' },
      address: { type: String, default: 'San Francisco, CA' },
    },
    seo: {
      defaultTitle: { type: String, default: 'Developer OS | Sagar.dev' },
      defaultDescription: { type: String, default: 'Production-Grade Software Engineer Portfolio and Personal CMS.' },
      defaultKeywords: { type: [String], default: ['Developer OS', 'MERN', 'Full Stack', 'Software Architect'] },
      openGraphImage: { type: String, default: '/favicon.svg' },
    },
    footer: {
      copyrightText: { type: String, default: '© 2026 Sagar.dev' },
      footerText: { type: String, default: 'Engineered with discipline, semantic versioning, and 5-tier architecture.' },
    },
    futureReady: {
      googleAnalyticsId: { type: String, default: '' },
      googleSearchConsole: { type: String, default: '' },
      microsoftClarity: { type: String, default: '' },
      metaPixel: { type: String, default: '' },
    },
    maintenance: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: 'System undergoing scheduled maintenance. Please check back shortly.' },
      estimatedBack: { type: String, default: '' },
      allowedIPs: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

// Indexes
settingsSchema.index({ updatedBy: 1 }, { sparse: true });

export const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
