import React from 'react';
import { PageMetadata } from '../components/PageMetadata.jsx';
import { Hero } from '../features/portfolio/Hero.jsx';
import { FeaturedProjects } from '../features/projects/FeaturedProjects.jsx';
import { SkillMatrix } from '../features/skills/SkillMatrix.jsx';
import { ArchitectureHighlights } from '../features/portfolio/ArchitectureHighlights.jsx';
import { ExperienceTimeline } from '../features/experience/ExperienceTimeline.jsx';

export function Home() {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://developer-os.dev';

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sagar',
    url: siteUrl,
    jobTitle: 'Software Engineer & Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Developer OS',
    },
    sameAs: [
      'https://github.com/Sagar7719',
      'https://linkedin.com/in/sagar',
    ],
  };

  return (
    <div className="space-y-4 pb-16">
      <PageMetadata
        title="Production-Grade Platform"
        description="Developer OS is a production-grade developer platform demonstrating 5-tier backend architecture, fullstack portfolio showcase, and personal CMS."
        jsonLd={homeJsonLd}
      />
      <Hero />
      <ArchitectureHighlights />
      <FeaturedProjects />
      <SkillMatrix />
      <ExperienceTimeline />
    </div>
  );
}

export default Home;

