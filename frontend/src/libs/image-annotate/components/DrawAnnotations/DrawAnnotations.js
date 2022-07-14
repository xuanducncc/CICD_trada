import useSketchBoard from "@libs/image-annotate/contexts/SketchBoardContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DrawRectAnnotation from "../DrawRectAnnotation/DrawRectAnnotation";
import DrawPolygonAnnotation from "../DrawPolygonAnnotation/DrawPolygonAnnotation";
import { DETECTION_CONTROLS } from '@utils/const';

const DrawAnnotations = () => {
  const { activeDrawingTool } = useSketchBoard();
  return (
    <>
      {activeDrawingTool === DETECTION_CONTROLS.BOUNDING_BOX && <DrawRectAnnotation />}
      {activeDrawingTool === DETECTION_CONTROLS.POLYGON && <DrawPolygonAnnotation />}
    </>
  );
};

export default DrawAnnotations;
