import React from 'react';
import ValidationItemQueue from './ValidationItemQueue';
import { ValidationItemQueueProvider } from './ValidationItemQueueContext';

const ProjectDetailValidationWithContext = () => {
  return (
    <ValidationItemQueueProvider>
      <ValidationItemQueue />
    </ValidationItemQueueProvider>
  )
}

export default ProjectDetailValidationWithContext;
