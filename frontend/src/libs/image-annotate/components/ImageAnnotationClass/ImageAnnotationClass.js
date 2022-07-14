import useSketchBoard from "@libs/image-annotate/contexts/SketchBoardContext";
import React, { useCallback } from "react";
import { Transformer, Rect, Group, Label, Text, Tag } from "react-konva";
import useImageAnnotation from "../../contexts/ImageAnnotationContext";

const ImageAnnotationClass = () => {
  const { imageOffset, imageDims, pan, zoom } = useSketchBoard();
  const { shapeProps, editable, labelName, labelCode, toolName, color } =
    useImageAnnotation();

  return (
    <>
      {!editable && (
        <Group>
          <Label x={0} y={0} padding={4}>
            <Tag fill="white" shadowColor="black" />
            <Text text={`${toolName} ${labelName || labelCode}`} fill={color} />
          </Label>
        </Group>
      )}
    </>
  );
};

export default ImageAnnotationClass;
