import React from 'react';
import { Hero } from '../features/portfolio/Hero.jsx';
import { FeaturedProjects } from '../features/projects/FeaturedProjects.jsx';
import { SkillMatrix } from '../features/skills/SkillMatrix.jsx';
import { ExperienceTimeline } from '../features/experience/ExperienceTimeline.jsx';

export function Home() {
  return (
    <div className="space-y-4 pb-16">
      <Hero />
      <FeaturedProjects />
      <SkillMatrix />
      <ExperienceTimeline />
    </div>
  );
}

export default Home;
