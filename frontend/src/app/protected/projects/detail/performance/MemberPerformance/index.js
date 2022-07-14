import React from 'react';
import MemberPerformancePage from './MemberPerformancePage';
import { MemberPerformanceProvider } from "./MemberPerformanceContext";

const PerformancePageWithContext = () => (
  <MemberPerformanceProvider>
    <MemberPerformancePage />
  </MemberPerformanceProvider>
);

export default PerformancePageWithContext;
