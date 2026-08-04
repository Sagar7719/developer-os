import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminSettings, updateSettings } from '../../api/settings.api.js';
import {
  FiSettings,
  FiUser,
  FiInfo,
  FiShare2,
  FiMail,
  FiSearch,
  FiLayout,
  FiAlertOctagon,
  FiCpu,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiCircle,
} from 'react-icons/fi';

const TAB_CONFIG = [
  { id: 'general', label: 'General', icon: FiSettings },
  { id: 'hero', label: 'Hero', icon: FiUser },
  { id: 'about', label: 'About', icon: FiInfo },
  { id: 'social', label: 'Social Links', icon: FiShare2 },
  { id: 'contact', label: 'Contact', icon: FiMail },
  { id: 'seo', label: 'SEO', icon: FiSearch },
  { id: 'footer', label: 'Footer', icon: FiLayout },
  { id: 'maintenance', label: 'Maintenance', icon: FiAlertOctagon },
  { id: 'system', label: 'System Info', icon: FiCpu },
];

export function SettingsAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { data: settingsData, isLoading, isError, error } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: fetchAdminSettings,
  });

  const [formData, setFormData] = useState(null);
  const [initialJson, setInitialJson] = useState('');

  useEffect(() => {
    if (settingsData) {
      const cleanData = {
        general: {
          siteName: settingsData.general?.siteName || '',
          siteDescription: settingsData.general?.siteDescription || '',
          logoUrl: settingsData.general?.logoUrl || '',
          faviconUrl: settingsData.general?.faviconUrl || '',
        },
        hero: {
          name: settingsData.hero?.name || '',
          title: settingsData.hero?.title || '',
          subtitle: settingsData.hero?.subtitle || '',
          primaryCtaText: settingsData.hero?.primaryCtaText || '',
          primaryCtaUrl: settingsData.hero?.primaryCtaUrl || '',
          secondaryCtaText: settingsData.hero?.secondaryCtaText || '',
          secondaryCtaUrl: settingsData.hero?.secondaryCtaUrl || '',
          resumeUrl: settingsData.hero?.resumeUrl || '',
          availableForWork: settingsData.hero?.availableForWork ?? true,
        },
        about: {
          biography: settingsData.about?.biography || '',
          experienceYears: settingsData.about?.experienceYears ?? 4,
          location: settingsData.about?.location || '',
        },
        socialLinks: {
          github: settingsData.socialLinks?.github || '',
          linkedin: settingsData.socialLinks?.linkedin || '',
          twitter: settingsData.socialLinks?.twitter || '',
          email: settingsData.socialLinks?.email || '',
          portfolio: settingsData.socialLinks?.portfolio || '',
        },
        contactInfo: {
          publicEmail: settingsData.contactInfo?.publicEmail || '',
          phone: settingsData.contactInfo?.phone || '',
          address: settingsData.contactInfo?.address || '',
        },
        seo: {
          defaultTitle: settingsData.seo?.defaultTitle || '',
          defaultDescription: settingsData.seo?.defaultDescription || '',
          defaultKeywords: Array.isArray(settingsData.seo?.defaultKeywords)
            ? settingsData.seo.defaultKeywords.join(', ')
            : '',
          openGraphImage: settingsData.seo?.openGraphImage || '',
        },
        footer: {
          copyrightText: settingsData.footer?.copyrightText || '',
          footerText: settingsData.footer?.footerText || '',
        },
        futureReady: {
          googleAnalyticsId: settingsData.futureReady?.googleAnalyticsId || '',
          googleSearchConsole: settingsData.futureReady?.googleSearchConsole || '',
          microsoftClarity: settingsData.futureReady?.microsoftClarity || '',
          metaPixel: settingsData.futureReady?.metaPixel || '',
        },
        maintenance: {
          enabled: settingsData.maintenance?.enabled ?? false,
          message: settingsData.maintenance?.message || '',
          estimatedBack: settingsData.maintenance?.estimatedBack || '',
          allowedIPs: Array.isArray(settingsData.maintenance?.allowedIPs)
            ? settingsData.maintenance.allowedIPs.join(', ')
            : '',
        },
      };
      setFormData(cleanData);
      setInitialJson(JSON.stringify(cleanData));
    }
  }, [settingsData]);

  const isDirty = formData && JSON.stringify(formData) !== initialJson;

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (response) => {
      queryClient.setQueryData(['admin-settings'], response);
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 4000);
    },
  });

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData) return;

    // Client-side payload formatting
    const payload = {
      ...formData,
      seo: {
        ...formData.seo,
        defaultKeywords: formData.seo.defaultKeywords
          ? formData.seo.defaultKeywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [],
      },
      maintenance: {
        ...formData.maintenance,
        allowedIPs: formData.maintenance.allowedIPs
          ? formData.maintenance.allowedIPs.split(',').map((ip) => ip.trim()).filter(Boolean)
          : [],
      },
    };

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold animate-pulse">
            <FiSettings className="w-5 h-5" />
          </div>
          <div className="text-xs font-mono text-slate-400">Loading Platform Settings...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-950/40 border border-red-900/60 rounded-2xl p-6 text-red-200 text-xs flex items-center gap-3">
        <FiAlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span>Failed to load settings: {error?.message || 'Server connection error.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <FiSettings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Settings CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Site Configuration & Metadata
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage global parameters, Hero copy, SEO defaults, social handles, and maintenance modes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <FiCircle className="w-2 h-2 fill-amber-400 animate-ping" />
              Unsaved Changes
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={updateMutation.isPending || !isDirty}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all shadow-lg ${
              isDirty && !updateMutation.isPending
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <FiSave className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {showSuccessAlert && (
        <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-200 shadow-lg">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Platform settings updated successfully across system cache!</span>
          </div>
          {settingsData?.updatedAt && (
            <span className="text-[11px] font-mono text-emerald-400/80 flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {new Date(settingsData.updatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {updateMutation.isError && (
        <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-4 flex items-center gap-3 text-xs text-red-200 shadow-lg">
          <FiAlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>Save failed: {updateMutation.error?.message || 'Server error.'}</span>
        </div>
      )}

      {/* Tab Controls Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {formData && (
        <div className="bg-[#1e293b]/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          {/* TAB 1: General */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                General Brand Info
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Site Name</label>
                <input
                  type="text"
                  value={formData.general.siteName}
                  onChange={(e) => handleNestedChange('general', 'siteName', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Site Description</label>
                <textarea
                  rows={3}
                  value={formData.general.siteDescription}
                  onChange={(e) => handleNestedChange('general', 'siteDescription', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Logo Image URL</label>
                  <input
                    type="text"
                    value={formData.general.logoUrl}
                    onChange={(e) => handleNestedChange('general', 'logoUrl', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Favicon Path / URL</label>
                  <input
                    type="text"
                    value={formData.general.faviconUrl}
                    onChange={(e) => handleNestedChange('general', 'faviconUrl', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Hero */}
          {activeTab === 'hero' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                Hero Section Copy & CTAs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={formData.hero.name}
                    onChange={(e) => handleNestedChange('hero', 'name', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Hero Headline Title</label>
                  <input
                    type="text"
                    value={formData.hero.title}
                    onChange={(e) => handleNestedChange('hero', 'title', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={formData.hero.subtitle}
                  onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.hero.primaryCtaText}
                    onChange={(e) => handleNestedChange('hero', 'primaryCtaText', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Primary CTA Target URL</label>
                  <input
                    type="text"
                    value={formData.hero.primaryCtaUrl}
                    onChange={(e) => handleNestedChange('hero', 'primaryCtaUrl', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Resume Download URL</label>
                  <input
                    type="text"
                    value={formData.hero.resumeUrl}
                    onChange={(e) => handleNestedChange('hero', 'resumeUrl', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hero.availableForWork}
                      onChange={(e) => handleNestedChange('hero', 'availableForWork', e.target.checked)}
                      className="w-4 h-4 accent-purple-600 rounded"
                    />
                    <span className="text-xs font-mono text-white">Available For Work Badge</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: About */}
          {activeTab === 'about' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                About & Bio Details
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Professional Biography</label>
                <textarea
                  rows={4}
                  value={formData.about.biography}
                  onChange={(e) => handleNestedChange('about', 'biography', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.about.experienceYears}
                    onChange={(e) => handleNestedChange('about', 'experienceYears', parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Location</label>
                  <input
                    type="text"
                    value={formData.about.location}
                    onChange={(e) => handleNestedChange('about', 'location', e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Social Links */}
          {activeTab === 'social' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                Social Profiles & Links
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">GitHub Profile URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleNestedChange('socialLinks', 'github', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Twitter / X Profile URL</label>
                <input
                  type="text"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 5: Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                Contact Details
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Public Display Email</label>
                <input
                  type="email"
                  value={formData.contactInfo.publicEmail}
                  onChange={(e) => handleNestedChange('contactInfo', 'publicEmail', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Physical Address / Base</label>
                <input
                  type="text"
                  value={formData.contactInfo.address}
                  onChange={(e) => handleNestedChange('contactInfo', 'address', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 6: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                Search Engine Optimization
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Default Meta Title</label>
                <input
                  type="text"
                  value={formData.seo.defaultTitle}
                  onChange={(e) => handleNestedChange('seo', 'defaultTitle', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Default Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.seo.defaultDescription}
                  onChange={(e) => handleNestedChange('seo', 'defaultDescription', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Default Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.seo.defaultKeywords}
                  onChange={(e) => handleNestedChange('seo', 'defaultKeywords', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 7: Footer */}
          {activeTab === 'footer' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                Footer Configuration
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Copyright Text</label>
                <input
                  type="text"
                  value={formData.footer.copyrightText}
                  onChange={(e) => handleNestedChange('footer', 'copyrightText', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Footer Subtext</label>
                <input
                  type="text"
                  value={formData.footer.footerText}
                  onChange={(e) => handleNestedChange('footer', 'footerText', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 8: Maintenance */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                Maintenance Mode Controls
              </h3>
              <div className="space-y-1.5">
                <label className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.maintenance.enabled}
                    onChange={(e) => handleNestedChange('maintenance', 'enabled', e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                  <span className="text-xs font-mono text-white">Enable System Maintenance Mode</span>
                </label>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Maintenance Message</label>
                <textarea
                  rows={2}
                  value={formData.maintenance.message}
                  onChange={(e) => handleNestedChange('maintenance', 'message', e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Estimated Back Time</label>
                <input
                  type="text"
                  value={formData.maintenance.estimatedBack}
                  onChange={(e) => handleNestedChange('maintenance', 'estimatedBack', e.target.value)}
                  placeholder="e.g. 2:00 PM UTC"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 9: System Information (Read Only) */}
          {activeTab === 'system' && settingsData?.systemInfo && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-purple-400">
                Read-Only System Environment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Application Version</div>
                  <div className="text-sm font-bold font-mono text-white">
                    v{settingsData.systemInfo.appVersion}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Execution Environment</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 uppercase">
                    {settingsData.systemInfo.environment}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Node Engine Version</div>
                  <div className="text-sm font-bold font-mono text-purple-300">
                    {settingsData.systemInfo.nodeVersion}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Git Revision Commit</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    {settingsData.systemInfo.gitCommit}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SettingsAdmin;
