import React from 'react';
import DatasetPage from './Dataset';
import { ProjectDetailSettingDatasetProvider } from './ProjectDetailSettingDatasetContext';

const DatasetPagePageWithContext = () => (
  <ProjectDetailSettingDatasetProvider>
    <DatasetPage />
  </ProjectDetailSettingDatasetProvider>
);

export default DatasetPagePageWithContext;
