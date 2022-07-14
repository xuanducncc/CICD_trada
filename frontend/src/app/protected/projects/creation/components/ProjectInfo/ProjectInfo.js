import { Input, Row, Col } from "antd";
import Form from "antd/lib/form/Form";
import Text from "antd/lib/typography/Text";
import React, { useCallback, useEffect, useState } from "react";
import useProjectCreation from "../../ProjectCreationContext";
import "./projectInfor.css";

const { TextArea } = Input;
const ProjectInfo = ({ formRef }) => {
  const { projectMutation, setProjectInfo } = useProjectCreation();

  const handleValueChange = useCallback(
    (values) => {
      setProjectInfo(values);
    },
    [setProjectInfo]
  );

  return (
    <div style={{ backgroundColor: "white" }}>
      <p className="text-project-infor">Tell us more about your project.</p>
      <Row>
        <Col span={6}>
          <Form
            className="formInfor"
            ref={formRef}
            initialValues={projectMutation.info}
            onValuesChange={handleValueChange}
          >
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input type="text" placeholder="Name" className="namePjInfor" />
            </Form.Item>
            <Form.Item name="description">
              <TextArea
                placeholder="Description (optional)"
                autoSize={{ minRows: 3, maxRows: 5 }}
                className="description"
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectInfo;
