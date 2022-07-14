import React, { useCallback, createRef, useEffect } from "react";
import PageLayout from "../../../../components/PageLayout/PageLayout";
import useProjectCreation, {
  withProjectCreationContext,
} from "./ProjectCreationContext";
import SteppedLayout from "../../../../components/SteppedLayout/SteppedLayout";
import Navigator from "./components/Navigator/Navigator";
import ProjectInfo from "./components/ProjectInfo/ProjectInfo";
import ChooseData from "./components/ChooseData/ChooseData";
import ConfigureEditor from "./components/ConfigureEditor/ConfigureEditor";
import SelectSettings from "./components/SelectSettings/SelectSettings";
import Finish from "./components/Finish/finish";
import Member from "./components/Member/Member";
import Modal from "antd/lib/modal";
import { validate } from "uuid";
import AddInstruction from "./components/Instruction/AddInstruction";

const ProjectCreationPage = () => {
  const { currentStep, setCurrentStep, totalStep, exitCreateProject } = useProjectCreation();
  const formRefInfor = React.useRef();
  const formRefSetting = createRef();
  const handleOnStepChange = useCallback(
    (step) => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );

  const handleOnStepNext = useCallback(() => {
    if (currentStep >= totalStep - 1) {
      return;
    }
    if (currentStep === 0 || currentStep === 4) {
      formRefInfor?.current
        ?.validateFields()
        .then((values) => {
          setCurrentStep(currentStep + 1);
        })
        .catch((error) => { });
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalStep, setCurrentStep, formRefInfor.current]);

  const handleOnStepBack = useCallback(() => {
    if (currentStep < 1) {
      Modal.info({
        title: "Do you want to exit!",
        content:
          "the informations will be reset",
        onOk: async () => {
          await exitCreateProject();
        },
        okCancel: true,
        onCancel: () => {
        },
        okText: "Exit",
        cancelText: "Cancel",
      });
      return;
    }
    setCurrentStep(currentStep - 1);
  }, [currentStep, setCurrentStep]);

  return (
    <PageLayout>
      <SteppedLayout
        current={currentStep}
        onChange={handleOnStepChange}
        onNext={handleOnStepNext}
        onBack={handleOnStepBack}
      >
        <SteppedLayout.Step title="Project info" step={0}>
          <ProjectInfo formRef={formRefInfor} />
        </SteppedLayout.Step>
        <SteppedLayout.Step title="Choose data" step={1}>
          <ChooseData />
        </SteppedLayout.Step>
        <SteppedLayout.Step title="Configure editor" step={2}>
          <ConfigureEditor />
        </SteppedLayout.Step>
        <SteppedLayout.Step title="Instruction" step={3}>
          <AddInstruction />
        </SteppedLayout.Step>
        <SteppedLayout.Step title="Select settings" step={4}>
          <SelectSettings formRef={formRefInfor} />
        </SteppedLayout.Step>
        <SteppedLayout.Step title="Add member" step={5}>
          <Member />
        </SteppedLayout.Step>
        <SteppedLayout.Step title="Finish" step={6}>
          <Finish />
        </SteppedLayout.Step>
      </SteppedLayout>
    </PageLayout>
  );
};

export default withProjectCreationContext(ProjectCreationPage);
