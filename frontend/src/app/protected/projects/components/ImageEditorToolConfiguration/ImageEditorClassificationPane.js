import React, { useCallback } from "react";

import Form from "antd/lib/form";
import Input from "antd/lib/input";
const { TextArea } = Input;
import Button from "antd/lib/button";
import Select from "antd/lib/select";
import Switch from "antd/lib/switch";
import Popover from "antd/lib/popover";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import ColorPicker from "@components/ColoPicker/ColorPicker";
import { CLASSIFICATION_CONTROLS } from "@utils/const";
import { useForm } from "antd/lib/form/Form";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const ImageEditorClassificationPane = ({
  tool,
  onChange: updateDraftedTool,
  formRef
}) => {
  const [form] = useForm();
  const handleOnChange = useCallback(
    (values) => {
      updateDraftedTool(values);
    },
    [updateDraftedTool, form]
  );
  return (
    <Form ref={formRef} form={form} initialValues={tool} onValuesChange={handleOnChange}>
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
          <Select.Option value={CLASSIFICATION_CONTROLS.DROPDOWN}>
            Dropdown
          </Select.Option>
          <Select.Option value={CLASSIFICATION_CONTROLS.CHECKLIST}>
            Checklist
          </Select.Option>
          <Select.Option value={CLASSIFICATION_CONTROLS.RADIO}>
            Radio
          </Select.Option>
          <Select.Option value={CLASSIFICATION_CONTROLS.TEXT}>
            Text
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea
          placeholder="Description"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>
      <Form.List label="Options" name="labels">
        {(fields, { add, remove }) => (
          <div>
            {fields.map((field, index) => (
              <div key={field.key} style={{ position: "relative" }}>
                <Form.Item
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={index === 0 ? "Options" : ""}
                  name={[index, "name"]}
                  rules={[{ required: true, message: "label name is require" }]}
                >
                  <Input style={{ width: "calc(100% - 32px)" }} />
                </Form.Item>
                <div style={{ position: "absolute", right: "0", top: "0" }}>
                  <Button
                    onClick={() => remove(field.name)}
                    type="text"
                    title="Delete option"
                    icon={<DeleteOutlined />}
                  ></Button>
                </div>
              </div>
            ))}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={() => add({ name: "", id: null, color: null })}
                  type="dashed"
                  icon={<PlusOutlined />}
                >
                  add option
                </Button>
              </div>
            </Form.Item>
          </div>
        )}
      </Form.List>
      <Form.Item valuePropName="checked" label="Required" name="required">
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default ImageEditorClassificationPane;
