import React, { useMemo } from "react";
import { styled } from "@material-ui/styles";
import BackButton from "./BackButton";
import ControlButtons from "./ControlButtons";
import DrawingButtons from "./DrawingButtons";
import ShortcutButton from "./ShortCutButton";
import SettingButton from "./SettingButton";
import ZoomButton from "./ZoomButton";
import InstructionButton from "./InstructionButton";
import GrabSelectionControls from "./GrabSelectionControls";
import useImageAnnotate from "../../contexts/ImageAnnotateContext";
import DrawerButton from "./DrawerButton";

const CONTROL_MODE = {
  QUEUE_CONTROL: "QUEUE_CONTROL",
  DRAWING_CONTROL: "DRAWING_CONTROL",
};

const ControlBarWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
});

const ControlBarSection = styled("div")({});

const ControlBar = () => {
  const { activeDrawingTool, mode } = useImageAnnotate();

  const controlMode = useMemo(() => {
    if (activeDrawingTool) {
      return CONTROL_MODE.DRAWING_CONTROL;
    }
    return CONTROL_MODE.QUEUE_CONTROL;
  }, [activeDrawingTool]);

  return (
    <ControlBarWrapper>
      {(mode === "annotate" || mode === "review") && (
        <ControlBarSection>
          <DrawerButton />
          <SettingButton />
          {mode === "annotate" && (
            <InstructionButton />
          )}
        </ControlBarSection>
      )}
      {/* {mode === "annotate" && controlMode === CONTROL_MODE.QUEUE_CONTROL && (
        <ControlBarSection>
          <ControlButtons />
        </ControlBarSection>
      )} */}
      {mode === "annotate" && controlMode === CONTROL_MODE.DRAWING_CONTROL && (
        <ControlBarSection>
          <DrawingButtons />
        </ControlBarSection>
      )}
      {mode !== "annotate" && <ControlBarSection></ControlBarSection>}
      <ControlBarSection>
        <GrabSelectionControls />
        <ZoomButton />
        <ShortcutButton />
        <BackButton />
      </ControlBarSection>
    </ControlBarWrapper>
  );
};

export default ControlBar;
