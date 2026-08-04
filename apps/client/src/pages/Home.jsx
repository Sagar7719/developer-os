import React from 'react';
import { PageMetadata } from '../components/PageMetadata.jsx';
import { Hero } from '../features/portfolio/Hero.jsx';
import { FeaturedProjects } from '../features/projects/FeaturedProjects.jsx';
import { SkillMatrix } from '../features/skills/SkillMatrix.jsx';
import { ArchitectureHighlights } from '../features/portfolio/ArchitectureHighlights.jsx';
import { ExperienceTimeline } from '../features/experience/ExperienceTimeline.jsx';
import { usePublicSettings } from '../hooks/usePublicSettings.js';

export function Home() {
  const { data: settings } = usePublicSettings();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://developer-os.dev';

  const personName = settings?.hero?.name?.trim() || 'Sagar';
  const jobTitle = settings?.hero?.title?.trim() || 'Software Engineer & Full Stack Developer';
  const siteName = settings?.general?.siteName?.trim() || 'Developer OS';

  const sameAsLinks = [
    settings?.socialLinks?.github?.trim() || 'https://github.com/Sagar7719',
    settings?.socialLinks?.linkedin?.trim() || 'https://linkedin.com/in/sagar',
    settings?.socialLinks?.twitter?.trim(),
    settings?.socialLinks?.portfolio?.trim(),
  ].filter(Boolean);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personName,
    url: siteUrl,
    jobTitle: jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: siteName,
    },
    sameAs: sameAsLinks,
  };

  const homeDescription =
    settings?.seo?.defaultDescription?.trim() ||
    `${siteName} is a production-grade developer platform demonstrating 5-tier backend architecture, fullstack portfolio showcase, and personal CMS.`;
  const biography =
    settings?.about?.biography?.trim() ||
    'Software engineer specializing in high-performance web applications, scalable microservices, and modern cloud architecture.';
  const experienceYears = settings?.about?.experienceYears ?? 4;
  const location = settings?.about?.location?.trim() || 'San Francisco, CA';

  return (
    <div className="space-y-4 pb-16">
      <PageMetadata
        title="Production-Grade Platform"
        description={homeDescription}
        jsonLd={homeJsonLd}
      />
      <Hero />
      <ArchitectureHighlights />

      {/* Dynamic Bio & Platform Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
              <span>About & Engineering Focus</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400">{location}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {biography}
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">
                {experienceYears}+
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Years Experience
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
                100%
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Type Safe & QA Clean
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProjects />
      <SkillMatrix />
      <ExperienceTimeline />
    </div>
  );
}

export default Home;


