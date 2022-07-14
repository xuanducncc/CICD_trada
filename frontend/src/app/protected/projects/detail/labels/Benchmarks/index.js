import React from 'react';
import BenchmarksPage from './Benchmarks';
import { ProjectDetailBenchmarksProvider } from './BenchmarksContext';

const ProjectDetailBenchmarksWithContext = () => {
  return (
    <ProjectDetailBenchmarksProvider>
      <BenchmarksPage />
    </ProjectDetailBenchmarksProvider>
  )
}

export default ProjectDetailBenchmarksWithContext;
