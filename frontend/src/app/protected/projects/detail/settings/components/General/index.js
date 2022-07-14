
import React from 'react';
import GeneralPage from './General';
import { ProjectDetailSettingGeneralProvider } from './ProjectDetailSettingGeneralContext';

const GeneralPageWithContext = () => (
  <ProjectDetailSettingGeneralProvider>
    <GeneralPage />
  </ProjectDetailSettingGeneralProvider>
);

export default GeneralPageWithContext;
