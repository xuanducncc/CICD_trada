import React from 'react';
import PreviewQueue from './PreviewQueue';
import { PreviewQueueProvider } from './PreviewQueueContext';

const ProjectDetailPreviewQueueWithContext = () => {
  return (
    <PreviewQueueProvider>
      <PreviewQueue />
    </PreviewQueueProvider>
  )
}

export default ProjectDetailPreviewQueueWithContext;
