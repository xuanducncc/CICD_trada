import { Button, Row, Col } from "antd";
import Text from "antd/lib/typography/Text";
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import React, { useCallback } from "react";
import useValidationEditor from "./ValidationEditorContext";
import { ImageAnnotateContext } from "@libs/image-annotate/contexts/ImageAnnotateContext";
import ImageAnnotate from "@libs/image-annotate/ImageAnnotate";
import useValidationItemQueue from "../../ValidationItemQueueContext";

const WorkspaceEditor = () => {
  const {
    acceptWorkItem,
    rejectWorkItem,
    nextQueueItem,
    backQueueItem,
  } = useValidationItemQueue();
  const { editor, editorData, loading, error } = useValidationEditor();
  return (
    <Row style={{ height: "100%" }}>
      <ImageAnnotate
        mode="verify"
        config={editor}
        data={editorData}
        loading={loading}
        error={error}
        onSubmitWorkItem={acceptWorkItem}
        onSkipWorkItem={rejectWorkItem}
        onNext={nextQueueItem}
        onBack={backQueueItem}
      />
    </Row>
  );
};

export default WorkspaceEditor;
