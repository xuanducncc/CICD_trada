import { Col, Row, Tabs, Slider, InputNumber, Button } from "antd";
import React, { useState } from "react";
import "./selectSettings.css";
import { StarOutlined, PercentageOutlined } from "@ant-design/icons";
import "./selectSettings.css";
import useProjectCreation from "../../ProjectCreationContext";
import ProjectQualitySettingsForm from "@app/protected/projects/components/ProjectQualitySettingsForm/ProjectQualitySettingsForm";

const SelectSettings = ({ formRef }) => {
  const { projectMutation, setProjectSettings } = useProjectCreation();

  return (
    <div style={{ padding: "0px 49px", backgroundColor: "white" }}>
      <ProjectQualitySettingsForm
        settings={projectMutation.settings}
        onSubmit={setProjectSettings}
        submitText="Confirm"
        formRef={formRef}
      />
    </div>
  );
};

export default SelectSettings;
