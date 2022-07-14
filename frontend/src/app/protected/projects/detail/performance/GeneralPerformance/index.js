import React from 'react';
import PerformancePage from './Performance';
import { ProjectPerformanceProvider } from "./ProjectPerformanceContext";

const PerformancePageWithContext = () => (
  <ProjectPerformanceProvider>
    <PerformancePage />
  </ProjectPerformanceProvider>
);

export default PerformancePageWithContext;
