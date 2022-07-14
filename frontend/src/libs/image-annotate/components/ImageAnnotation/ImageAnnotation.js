import React, { useMemo } from "react";
import { render } from "react-dom";
import { Image, Layer, Text, Group } from "react-konva";
import { DETECTION_CONTROLS, IMAGE_ANNOTATION_TYPE } from "@utils/const";
import ImageAnnotationRect from '../ImageAnnotationRect/ImageAnnotationRect';
import ImageAnnotationPolygon from '../ImageAnnotationPolygon/ImageAnnotationPolygon';
import { ImageAnnotationProvider } from "../../contexts/ImageAnnotationContext";
import ImageAnnotationClass from "../ImageAnnotationClass/ImageAnnotationClass";

const ImageAnnotation = ({ shape }) => {
  return (
    <Group>
      <ImageAnnotationProvider shape={shape}>
        {shape.toolType === IMAGE_ANNOTATION_TYPE.CLASSIFICATION && <ImageAnnotationClass />}
        {shape.controlType === DETECTION_CONTROLS.BOUNDING_BOX && <ImageAnnotationRect />}
        {shape.controlType === DETECTION_CONTROLS.POLYGON && <ImageAnnotationPolygon />}
      </ImageAnnotationProvider>
    </Group>
  );
};

export default ImageAnnotation;
