
import React from 'react';
import Instruction from './Instruction';
import { ProjectDetailSettingInstructionProvider } from './ProjectDetailSettingInstructionContext';

const InstructionPageWithContext = () => (
  <ProjectDetailSettingInstructionProvider>
    <Instruction />
  </ProjectDetailSettingInstructionProvider>
);

export default InstructionPageWithContext;
