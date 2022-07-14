import { EDITOR_TYPE, IMAGE_ANNOTATION_TYPE } from "@utils/const";
import React from "react";
import useReviewEditor from "./ReviewEditorContext";

import ImageAnnotationEditor from "../ImageAnnotationEditor/ImageAnnotationEditor";

const ReviewEditor = () => {
  const { editor } = useReviewEditor();

  return (
    <>
      {editor && editor.type === EDITOR_TYPE.IMAGE && <ImageAnnotationEditor editor={editor} />}
    </>
  );
};

export default ReviewEditor;
