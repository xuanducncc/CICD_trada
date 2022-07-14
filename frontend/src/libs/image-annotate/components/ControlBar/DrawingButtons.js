import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import { CLASSIFICATION_CONTROLS, DETECTION_CONTROLS } from "@utils/const";
import React from "react";
import RadioDrawingControls from "./RadioDrawingControls";
import RectDrawingControls from "./RectDrawingControl";

const ControlButtons = () => {
  const { selectedTool, selectedControl } = useImageAnnotate();
  return (
    <>
      {selectedControl &&
        selectedControl.type === DETECTION_CONTROLS.BOUNDING_BOX && (
          <RectDrawingControls />
        )}
      {selectedControl &&
        selectedControl.type === CLASSIFICATION_CONTROLS.RADIO && (
          <RadioDrawingControls />
        )}
    </>
  );
};

export default ControlButtons;
