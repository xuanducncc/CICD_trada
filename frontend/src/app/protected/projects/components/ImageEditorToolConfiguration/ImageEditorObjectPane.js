import React, { useCallback } from "react";

import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Select from "antd/lib/select";
import Popover from "antd/lib/popover";
import ColorPicker from "@components/ColoPicker/ColorPicker";
import { DETECTION_CONTROLS } from "@utils/const";

const ImageEditorObjectPane = ({ tool, onChange: updateDraftedTool, formRef }) => {
  const handleOnChange = useCallback(
    (values) => {
      updateDraftedTool(values);
    },
    [updateDraftedTool]
  );

  return (
    <Form ref={formRef} initialValues={tool} onValuesChange={handleOnChange}>
      <Form.Item label="Color" name="color">
        <Popover
          content={
            <ColorPicker
              color={tool.color}
              onChange={({ hex: color }) => handleOnChange({ color })}
            />
          }
          title="Select color"
          trigger="click"
        >
          <Button
            type="primary"
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: tool.color,
            }}
          >
            &nbsp;
          </Button>
        </Popover>
      </Form.Item>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Control" name="control">
        <Select style={{ width: "100%" }}>
          <Select.Option value={DETECTION_CONTROLS.BOUNDING_BOX}>
            Bounding Box
          </Select.Option>
          <Select.Option value={DETECTION_CONTROLS.POLYGON}>
            Polygon
          </Select.Option>
          <Select.Option value={DETECTION_CONTROLS.POLYLINE} disabled>
            Polyline
          </Select.Option>
          <Select.Option value={DETECTION_CONTROLS.POINT} disabled>
            Point
          </Select.Option>
          <Select.Option value={DETECTION_CONTROLS.SEGMENTATION} disabled>
            Segmentation
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ImageEditorObjectPane;
