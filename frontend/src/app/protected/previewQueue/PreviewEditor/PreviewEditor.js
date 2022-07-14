import { EDITOR_TYPE } from "@utils/const";
import React, { useCallback } from "react";
import ImageAnnotate from "@libs/image-annotate/ImageAnnotate";
import usePreviewEditor from "./PreviewEditorContext";
import { Row } from "antd";

const PreviewEditor = () => {
  const { editor, editorData, loading, error } = usePreviewEditor();

  return (
    <>
      {editor && editor.type === EDITOR_TYPE.IMAGE &&
        <Row style={{ height: "100%" }}>
          <ImageAnnotate
            mode="preview"
            config={editor}
            data={editorData}
            loading={loading}
            error={error}
          />
        </Row>
      }
    </>
  );
};

export default PreviewEditor;
