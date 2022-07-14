import React from 'react';
import ValidationEditor from './ValidationEditor';
import { ValidationEditorProvider } from './ValidationEditorContext';

const ValidationEditorWithContext = () => {
  return (
    <ValidationEditorProvider>
      <ValidationEditor />
    </ValidationEditorProvider>
  )
}

export default ValidationEditorWithContext;
