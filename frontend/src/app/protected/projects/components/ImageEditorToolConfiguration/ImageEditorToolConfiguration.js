import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import useImageEditorToolConfiguration from "./ImageEditorToolConfigurationContext";
import ImageEditorToolConfigurationToolDetail from "./ImageEditorToolConfigurationToolDetail";
import ImageEditorToolConfigurationGeneral from './ImageEditorToolConfigurationGeneral';
import ImageEditorToolConfigurationPreview from "./ImageEditorToolConfigurationPreview";

const ImageEditorToolConfiguration = ({ isSetting, setDrawer }) => {
  const { activatedTool } = useImageEditorToolConfiguration();
  return (
    <Row span={24} style={{ height: '100%' }}>
      <Col span={6} style={{ padding: '16px', height: '100%', borderRight: 'gray solid 1px' }}>
        {!activatedTool && <ImageEditorToolConfigurationGeneral isSetting={isSetting} />}
        {activatedTool && <ImageEditorToolConfigurationToolDetail setDrawer={setDrawer} />}
      </Col>
      <Col span={18}>
        <ImageEditorToolConfigurationPreview isSetting={isSetting} />
      </Col>
    </Row>
  );
};

export default ImageEditorToolConfiguration;
