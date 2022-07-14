import InputNumber from "antd/lib/input-number";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Radio from "antd/lib/radio";
import Slider from "antd/lib/slider";
import Switch from "antd/lib/switch";
import Row from "antd/lib/row";
import Divider from "antd/lib/divider";

import Text from "antd/lib/typography/Text";
import React, { useState, useCallback, useEffect, useRef, createRef } from "react";
import Form from "antd/lib/form";
import { styled } from "@material-ui/styles";

import "./ProjectQualitySettingsForm.css";

export default function ProjectQualitySettingsForm({
  settings,
  onSubmit,
  submitText,
  isUpdate,
  onUpdate,
  formRef
}) {
  const handleValueChange = useCallback(
    (values) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  useEffect(() => {
    onSubmit(settings)
  }, [])
  useEffect(() => {
    if (formRef) {
      formRef?.current?.setFieldsValue(settings)
    }
  }, [settings, formRef.current])

  return (
    <Form ref={formRef} initialValues={settings} onValuesChange={handleValueChange} onFinish={onUpdate}>
      <div>
        <div className="settings-form-title-item">
          <label>Annotation</label>
        </div>
        <div>
          <Form.Item name="queue_size" label="Queue size" rules={[{ required: true, type: "number" }]}>
            <InputNumber />
          </Form.Item>
        </div>
      </div>
      <Divider plain>Quality Assurance</Divider>
      <div>
        <div>
          <Form.Item
            className="settings-form-title-item"
            label="Cross checking"
            name="overlap_enable"
            valuePropName="checked"
            colon={false}
          >
            <Switch />
          </Form.Item>
        </div>
        <div>
          <Row>
            <Col flex="auto">
              <Form.Item
                label="Overlap"
                name="overlap_percent"
                tooltip="Overlap Choose the proportion of the total number of assets"
              >
                <Slider min={0} max={100} />
              </Form.Item>
            </Col>
            <Col flex="50px">
              <Form.Item name="overlap_percent" rules={[{ required: true, type: "number" }]}>
                <InputNumber min={0} max={100} style={{ margin: "0 16px" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col flex="auto">
              <Form.Item
                label="Overlap Time"
                name="overlap_time"
                tooltip="The number of validation set will be duplicated"
              >
                <Slider min={0} max={100} />
              </Form.Item>
            </Col>
            <Col flex="50px">
              <Form.Item name="overlap_time" rules={[{ required: true, type: "number" }]}>
                <InputNumber min={0} max={100} style={{ margin: "0 16px" }} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <div>
          <Form.Item
            colon={false}
            className="settings-form-title-item"
            label="Review step"
            name="review_enable"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
        <div>
          <Row>
            <Col flex="auto">
              <Form.Item
                tooltip="Coverage Choose the proportion of the total number of assets"
                label="Coverage"
                name="review_percent"
              >
                <Slider min={0} max={100} disabled={!settings?.review_enable} />
              </Form.Item>
            </Col>
            <Col flex="50px">
              <Form.Item name="review_percent">
                <InputNumber min={0} max={100} style={{ margin: "0 16px" }} disabled={!settings?.review_enable} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col flex="auto">
              <Form.Item
                label="Review Time"
                name="review_vote"
                tooltip="The number of validation set will be duplicated"
              >
                <Slider min={0} max={100} />
              </Form.Item>
            </Col>
            <Col flex="50px">
              <Form.Item name="review_vote" rules={[{ type: "number" }]}>
                <InputNumber min={0} max={100} style={{ margin: "0 16px" }} />
              </Form.Item>
            </Col>
          </Row>
          {isUpdate === true ? <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {submitText || "Confirm Change"}
            </Button>
          </Form.Item> : <></>}
        </div>
      </div>
    </Form>
  );
}
