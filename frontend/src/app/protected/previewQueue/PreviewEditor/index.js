import React from "react";
import PreviewEditor from "./PreviewEditor";
import { PreviewEditorProvider } from "./PreviewEditorContext";

const PreviewEditorWithContext = () => {
  return (
    <PreviewEditorProvider>
      <PreviewEditor />
    </PreviewEditorProvider>
  )
}

export default PreviewEditorWithContext;