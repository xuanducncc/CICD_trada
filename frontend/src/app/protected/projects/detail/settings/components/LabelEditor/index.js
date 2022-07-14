import React from 'react';
import LabelEditorPage from './LabelEditor';
import { ProjectDetailSettingEditorProvider } from './ProjectDetailSettingEditorContext';

const GeneralPageWithContext = () => (
  <ProjectDetailSettingEditorProvider>
    <LabelEditorPage />
  </ProjectDetailSettingEditorProvider>
);

export default GeneralPageWithContext;
