import useSketchBoard from "../../contexts/SketchBoardContext";
import React, { useContext, useMemo } from "react";
import { render } from "react-dom";
import { Image, Layer, Text, Group } from "react-konva";
import ImageAnnotation from "../ImageAnnotation/ImageAnnotation";
import { FastBackwardFilled } from "@ant-design/icons";

const ImageAnnotations = () => {
  const { objects, classObjects, activeDrawingTool } = useSketchBoard();

  const visibleObjects = useMemo(() => {
    return (objects || []).filter((object) => object.state.visible);
  }, [objects]);

  const visibleClasses = useMemo(() => {
    return (classObjects || []).filter((object) => object.state.visible);
  }, [classObjects]);

  return (
    <Layer listening={!activeDrawingTool}>
      {(visibleClasses || []).map((object) => (
        <ImageAnnotation key={object.clientId} shape={object} />
      ))}
      {(visibleObjects || []).map((object) => (
        <ImageAnnotation key={object.clientId} shape={object} />
      ))}
    </Layer>
  );
};

export default ImageAnnotations;
