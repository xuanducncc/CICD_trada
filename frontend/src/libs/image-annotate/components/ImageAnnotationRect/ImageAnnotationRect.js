import useSketchBoard from "@libs/image-annotate/contexts/SketchBoardContext";
import React, { useCallback } from "react";
import { Transformer, Rect, Group, Label, Text, Tag } from "react-konva";
import useImageAnnotation from "../../contexts/ImageAnnotationContext";

const ImageAnnotationRect = () => {
  const { imageOffset, imageDims, pan, zoom } = useSketchBoard();
  const {
    shapeProps,
    isSelected,
    onSelect,
    onChange,
    editable,
    labelName,
  } = useImageAnnotation();
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected && shapeProps) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected.shapeProps]);

  const handleSelect = useCallback(() => {
    onSelect();
  }, [onSelect]);

  const handleDragEnd = useCallback(
    (event) => {
      const { width, height } = imageDims;
      const layerX = event.target.x();
      const layerY = event.target.y();
      const x = Math.max(0, Math.min(width, layerX));
      const y = Math.max(0, Math.min(height, layerY));
      onChange({
        ...shapeProps,
        x,
        y,
      });
    },
    [shapeProps, imageDims, onChange]
  );

  const handleTransformEnd = useCallback(() => {
    // transformer is changing scale of the node
    // and NOT its width or height
    // but in the store we have only width and height
    // to match the data better we will reset scale on transform end
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const layerX = node.x();
    const layerY = node.y();
    const x = layerX;
    const y = layerY;
    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      ...shapeProps,
      x,
      y,
      // set minimal value
      width: newWidth,
      height: newHeight,
    });
  }, [shapeProps, pan, zoom, imageDims, shapeRef.current, onChange]);

  return (
    <Group>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        stroke={"red"}
        draggable={editable}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={(pos) => {
          return {
            x: Math.max(
              imageOffset.x,
              Math.min(
                pos.x,
                imageOffset.x + imageDims.width - shapeProps.width
              )
            ),
            y: Math.max(
              imageOffset.y,
              Math.min(
                pos.y,
                imageOffset.y + imageDims.height - shapeProps.height
              )
            ),
          };
        }}
      />
      {!editable && (
        <Label x={shapeProps.x} y={shapeProps.y}>
          <Text
            text={labelName}
            width={shapeProps.width}
            height={shapeProps.height}
            align="center"
            verticalAlign="middle"
          />
        </Label>
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (
              newBox.x > imageOffset.x &&
              newBox.x + newBox.width < imageOffset.x + imageDims.width &&
              newBox.y > imageOffset.y &&
              newBox.y + newBox.height < imageOffset.y + imageDims.height
            ) {
              return newBox;
            }

            return oldBox;
          }}
        />
      )}
    </Group>
  );
};

export default ImageAnnotationRect;
