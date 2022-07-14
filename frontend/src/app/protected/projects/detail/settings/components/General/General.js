import ProjectQualitySettingsForm from "@app/protected/projects/components/ProjectQualitySettingsForm/ProjectQualitySettingsForm";
import React, { useState } from "react";
import useProjectDetailSettingGeneral from "./ProjectDetailSettingGeneralContext";

export default function GeneralPage() {
  const { settings, updateSettings, setUpdateProjectSetting } = useProjectDetailSettingGeneral();
  const formRef = React.useRef();
  return (
    <div>
      <ProjectQualitySettingsForm
        submitText="Save Changes"
        settings={settings}
        onSubmit={setUpdateProjectSetting}
        isUpdate={true}
        onUpdate={updateSettings}
        formRef={formRef}
      />
    </div>
  );
}
