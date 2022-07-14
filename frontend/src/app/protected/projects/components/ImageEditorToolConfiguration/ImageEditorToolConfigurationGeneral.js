import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
import Tabs from "antd/lib/tabs";
import useImageEditorToolConfiguration from "./ImageEditorToolConfigurationContext";
import ImageEditorToolConfigurationTools from "./ImageEditorToolConfigurationTools";
import ImageEditorToolConfigurationInstructions from "./ImageEditorToolConfigurationInstructions";
import Text from "antd/lib/typography/Text";

const ImageEditorToolConfigurationGeneral = ({ isSetting }) => {
  const { dismiss, submit, preview, formRef, error } =
    useImageEditorToolConfiguration();
  return (
    <div style={{ height: "100%" }}>
      <Row style={{ height: "calc(100% - 44px)", overflow: "auto" }}>
        <Tabs style={{ width: "100%" }} defaultActiveKey="tools">
          <Tabs.TabPane key="tools" tab="Tools">
            <ImageEditorToolConfigurationTools
              isSetting={isSetting}
              formRef={formRef}
            />
          </Tabs.TabPane>
        </Tabs>
        {error && (
          <div style={{ justifySelf: "flex-end" }}>
            <Text style={{ color: "red" }}>{error.message || ""}</Text>
          </div>
        )}
      </Row>
      <Row justify="space-around" style={{ padding: "10px" }}>
        <Button onClick={dismiss} type="default" size="large">
          Cancel
        </Button>

        <Button onClick={preview} type="link" size="large">
          Preview
        </Button>

        <Button onClick={submit} type="primary" size="large">
          Confirm
        </Button>
      </Row>
    </div>
  );
};

export default ImageEditorToolConfigurationGeneral;
