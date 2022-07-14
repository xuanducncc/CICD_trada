import React, { useCallback, useMemo, useState } from "react";
import Button from "antd/lib/button";
import ImageAnnotate from "@libs/image-annotate/ImageAnnotate";
import { uuid } from "@utils/uuid";
import useWorkspace from "../../contexts/WorkspaceContext";
import useEditor from "../../contexts/EditorContext";

const ImageAnnotationEditor = ({ editor }) => {
  const {
    loading,
    error,
    editorData,
    submitWorkItem,
    skipWorkItem,
  } = useEditor();

  const { setDrawerVisible, nextQueueItem, backQueueItem, openInstruction } = useWorkspace();

  const handleBack = useCallback(() => {
    history.back();
  }, [history]);

  const handleQueue = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  return (
    <>
      <ImageAnnotate
        mode="annotate"
        data={editorData}
        config={editor}
        loading={loading}
        error={error}
        onBack={handleBack}
        onNext={nextQueueItem}
        onPrev={backQueueItem}
        onQueue={handleQueue}
        onInstruction={openInstruction}
        onSubmitWorkItem={submitWorkItem}
        onSkipWorkItem={skipWorkItem}
      />
    </>
  );
};

export default ImageAnnotationEditor;
