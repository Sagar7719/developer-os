import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePublicSettings } from '../hooks/usePublicSettings.js';

/**
 * PageMetadata — Lightweight zero-dependency SEO & document metadata manager.
 */
export function PageMetadata({
  title,
  description,
  ogImage,
  noindex = false,
  jsonLd = null,
}) {
  const location = useLocation();
  const { data: settings } = usePublicSettings();

  const siteName = settings?.general?.siteName?.trim() || 'Developer OS';
  const seoTitle = settings?.seo?.defaultTitle?.trim() || `${siteName} | Sagar.dev`;
  const seoDescription =
    settings?.seo?.defaultDescription?.trim() ||
    'Production-Grade Developer Platform built to demonstrate scalable software engineering, personal CMS, and 5-tier backend architecture.';
  const seoOgImage = settings?.seo?.openGraphImage?.trim();
  const seoKeywords = Array.isArray(settings?.seo?.defaultKeywords)
    ? settings.seo.defaultKeywords.filter(Boolean).join(', ')
    : '';

  const rawSiteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://developer-os.dev');
  const siteUrl = rawSiteUrl.replace(/\/$/, '');
  const defaultOgImage = seoOgImage || import.meta.env.VITE_OG_IMAGE || `${siteUrl}/favicon.svg`;
  const image = ogImage || defaultOgImage;
  const canonicalUrl = `${siteUrl}${location.pathname}`;

  const fullTitle = title ? `${title} | ${siteName}` : seoTitle;
  const finalDescription = description || seoDescription;

  useEffect(() => {
    // 1. Set Document Title
    document.title = fullTitle;

    // Helper for Meta tag manipulation
    const setMetaTag = (attr, attrValue, content) => {
      let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for Link tag manipulation
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    if (seoKeywords) {
      setMetaTag('name', 'keywords', seoKeywords);
    }

    // 3. Canonical URL
    setLinkTag('canonical', canonicalUrl);

    // 4. Open Graph Meta Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:type', 'website');

    // 5. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', image);

    // 6. JSON-LD Structured Data
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, finalDescription, image, canonicalUrl, noindex, jsonLd, siteName, seoKeywords]);

  return null;
}

export default PageMetadata;

