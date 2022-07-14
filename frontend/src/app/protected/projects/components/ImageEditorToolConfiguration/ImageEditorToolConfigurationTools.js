import React, { useCallback, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
import Tabs from "antd/lib/tabs";
import MoreOutlined from "@ant-design/icons/MoreOutlined";
import Text from "antd/lib/typography/Text";
import ImageEditorObjectToolList from "./ImageEditorObjectToolList";
import ImageEditorClassificationToolList from "./ImageEditorClassificationToolList";
import useImageEditorToolConfiguration from "./ImageEditorToolConfigurationContext";

const ImageEditorToolConfigurationTools = ({ isSetting }) => {
  const {
    addClassificationTool,
    addDetectionTool,
    classificationTools,
    detectionTools,
    formRef,
  } = useImageEditorToolConfiguration();

  return (
    <>
      <Row>
        <h2>Objects</h2>
      </Row>
      <Row>
        <Text>
          Add objects to segment with bounding box, polygon, polyline or point
        </Text>
      </Row>
      <Row>
        <ImageEditorObjectToolList isSetting={isSetting} formRef={formRef} tools={detectionTools} />
      </Row>
      <Row justify="center">
        <Button onClick={addDetectionTool} type="link">
          Add object
        </Button>
      </Row>
      <Row>
        <h2>Classifications</h2>
      </Row>
      <Row>
        <Text>Add classifications for global assessments of the datum</Text>
      </Row>
      <Row>
        <ImageEditorClassificationToolList isSetting={isSetting} tools={classificationTools} />
      </Row>
      <Row justify="center">
        <Button onClick={addClassificationTool} type="link">
          Add classifications
        </Button>
      </Row>
    </>
  );
};

export default ImageEditorToolConfigurationTools;
