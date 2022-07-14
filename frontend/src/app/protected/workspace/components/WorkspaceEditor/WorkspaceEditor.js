import { EDITOR_TYPE, IMAGE_ANNOTATION_TYPE } from "@utils/const";
import React from "react";
import useEditor from "../../contexts/EditorContext";
import useWorkspace from "../../contexts/WorkspaceContext";

import ImageAnnotationEditor from "../ImageAnnotationEditor/ImageAnnotationEditor";

const WorkspaceEditor = () => {
  const { editor } = useEditor();

  return (
    <>
      {editor && editor.type === EDITOR_TYPE.IMAGE && (
        <ImageAnnotationEditor editor={editor} />
      )}
    </>
  );
};

export default WorkspaceEditor;
