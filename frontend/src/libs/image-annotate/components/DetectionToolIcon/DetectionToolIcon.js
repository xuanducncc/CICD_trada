import React from "react";

import { DETECTION_CONTROLS, IMAGE_ANNOTATION_TYPE } from "@utils/const";
import { RectIcon, PolygonIcon } from "@utils/icons";

const DetectionToolIcon = ({ type, color = "black" }) => {
  return (
    <>
      {type === DETECTION_CONTROLS.BOUNDING_BOX && (
        <RectIcon style={{ color, fontSize: "32px", width: "32px" }} />
      )}
      {type === DETECTION_CONTROLS.POLYGON && (
        <PolygonIcon style={{ color, fontSize: "32px", width: "32px" }} />
      )}
    </>
  );
};

export default DetectionToolIcon;
