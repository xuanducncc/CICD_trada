import React from 'react';
import ReviewEditor from './ReviewEditor';
import { ReviewEditorProvider } from './ReviewEditorContext';

const ReviewEditorWithContext = () => {
  return (
    <ReviewEditorProvider>
      <ReviewEditor />
    </ReviewEditorProvider>
  )
}

export default ReviewEditorWithContext;
