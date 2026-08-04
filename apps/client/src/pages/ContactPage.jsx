import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitContactForm } from '../api/contact.api.js';
import { PageMetadata } from '../components/PageMetadata.jsx';
import { usePublicSettings } from '../hooks/usePublicSettings.js';
import {
  FiMail,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiTag,
  FiHelpCircle,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiTwitter,
} from 'react-icons/fi';

const MAX_MESSAGE_LENGTH = 2000;

export function ContactPage() {
  const queryClient = useQueryClient();
  const { data: settings } = usePublicSettings();

  const siteName = settings?.general?.siteName?.trim() || 'Developer OS';
  const rawAuthorName = settings?.hero?.name?.trim() || 'Sagar.dev';
  const brandSub = rawAuthorName.includes('.') ? rawAuthorName : `${rawAuthorName}.dev`;

  const publicEmail = settings?.contactInfo?.publicEmail?.trim() || 'sagar@developer-os.dev';
  const phone = settings?.contactInfo?.phone?.trim();
  const address = settings?.contactInfo?.address?.trim() || 'San Francisco, CA';

  const githubUrl = settings?.socialLinks?.github?.trim();
  const linkedinUrl = settings?.socialLinks?.linkedin?.trim();
  const twitterUrl = settings?.socialLinks?.twitter?.trim();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot field for anti-spam protection
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const contactMutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setShowSuccessAlert(true);
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      setFormErrors({});
    },
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.length > 200) {
      errors.subject = 'Subject cannot exceed 200 characters';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessAlert(false);

    // Silent bot rejection via honeypot
    if (formData.website.trim() !== '') {
      setShowSuccessAlert(true);
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    contactMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <PageMetadata
        title="Contact & Direct Inquiries"
        description={`Send a direct message or project inquiry to ${brandSub} via ${siteName}.`}
      />
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <FiMail className="w-3.5 h-3.5 text-cyan-400" />
          <span>Get In Touch</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Direct Message</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Let’s Build Something{' '}
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Exceptional Together
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Have a project inquiry, collaboration proposal, or technical question?
          Send a direct message below and I will respond as soon as possible.
        </p>
      </div>

      {/* Dynamic Contact Details & Social Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Email Card */}
        <a
          href={`mailto:${publicEmail}`}
          className="bg-[#1e293b]/40 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 flex items-center gap-3.5 transition-all group shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shrink-0">
            <FiMail className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Direct Email</div>
            <div className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
              {publicEmail}
            </div>
          </div>
        </a>

        {/* Location / Phone Card */}
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            {phone ? <FiPhone className="w-5 h-5" /> : <FiMapPin className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {phone ? 'Phone / Base' : 'Location'}
            </div>
            <div className="text-xs font-bold text-white truncate">
              {phone ? `${phone} (${address})` : address}
            </div>
          </div>
        </div>

        {/* Social Connect Card */}
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-center gap-1.5 shadow-md">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Social Channels</div>
          <div className="flex items-center gap-3 pt-0.5">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <FiGithub className="w-4 h-4" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                title="LinkedIn"
              >
                <FiLinkedin className="w-4 h-4" />
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-sky-400 transition-colors"
                title="Twitter"
              >
                <FiTwitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>


      {/* Success Notification Alert */}
      {showSuccessAlert && (
        <div
          role="alert"
          className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-4 text-emerald-300 animate-fadeIn"
        >
          <FiCheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-bold text-white">Message Sent Successfully!</h4>
            <p className="text-slate-300">
              Thank you for reaching out. Your inquiry has been delivered directly to my inbox.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification Alert */}
      {contactMutation.isError && (
        <div
          role="alert"
          className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-4 text-red-300 animate-fadeIn"
        >
          <FiAlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-bold text-white">Submission Failed</h4>
            <p className="text-slate-300">
              {contactMutation.error?.message ||
                'Unable to send message at this time. Please try again later.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Contact Form Card */}
      <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Honeypot field (hidden from visual users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website (Leave blank)</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="contact-name" className="block text-xs font-mono text-slate-300">
                Your Name <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="contact-name"
                  required
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={formErrors.name ? 'name-error' : undefined}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                  }}
                  placeholder="Jane Doe"
                  className={`w-full bg-slate-900/80 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors ${
                    formErrors.name
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              {formErrors.name && (
                <p id="name-error" className="text-[11px] font-mono text-red-400">
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="contact-email" className="block text-xs font-mono text-slate-300">
                Email Address <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="contact-email"
                  required
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={formErrors.email ? 'email-error' : undefined}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                  }}
                  placeholder="jane@example.com"
                  className={`w-full bg-slate-900/80 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors ${
                    formErrors.email
                      ? 'border-red-500/80 focus:border-red-500'
                      : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p id="email-error" className="text-[11px] font-mono text-red-400">
                  {formErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-300">
              Subject <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <FiTag className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="contact-subject"
                required
                aria-invalid={Boolean(formErrors.subject)}
                aria-describedby={formErrors.subject ? 'subject-error' : undefined}
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (formErrors.subject) setFormErrors({ ...formErrors, subject: null });
                }}
                placeholder="Project Inquiry / Consulting Opportunities"
                className={`w-full bg-slate-900/80 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors ${
                  formErrors.subject
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-slate-800 focus:border-purple-500'
                }`}
              />
            </div>
            {formErrors.subject && (
              <p id="subject-error" className="text-[11px] font-mono text-red-400">
                {formErrors.subject}
              </p>
            )}
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="contact-message" className="block text-xs font-mono text-slate-300">
                Message Payload <span className="text-purple-400">*</span>
              </label>
              <span
                className={`text-[10px] font-mono ${
                  formData.message.length > MAX_MESSAGE_LENGTH
                    ? 'text-red-400 font-bold'
                    : 'text-slate-500'
                }`}
              >
                {formData.message.length} / {MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-500">
                <FiMessageSquare className="w-4 h-4" />
              </div>
              <textarea
                id="contact-message"
                required
                rows={5}
                maxLength={MAX_MESSAGE_LENGTH}
                aria-invalid={Boolean(formErrors.message)}
                aria-describedby={formErrors.message ? 'message-error' : undefined}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (formErrors.message) setFormErrors({ ...formErrors, message: null });
                }}
                placeholder="Write your message here..."
                className={`w-full bg-slate-900/80 border rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors ${
                  formErrors.message
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-slate-800 focus:border-purple-500'
                }`}
              />
            </div>
            {formErrors.message && (
              <p id="message-error" className="text-[11px] font-mono text-red-400">
                {formErrors.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
              <FiHelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Response within 24 hours</span>
            </div>

            <button
              type="submit"
              disabled={contactMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-all shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {contactMutation.isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <FiSend className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
