import React from 'react';
import MemberPage from './Member';
import { ProjectDetailSettingMembersProvider } from './ProjectDetailSettingMembersContext';

const SettingsMembersPageWithContext = () => (
  <ProjectDetailSettingMembersProvider>
    <MemberPage />
  </ProjectDetailSettingMembersProvider>
);

export default SettingsMembersPageWithContext;
