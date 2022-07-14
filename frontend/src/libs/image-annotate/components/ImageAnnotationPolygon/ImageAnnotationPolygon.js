import useSketchBoard from "@libs/image-annotate/contexts/SketchBoardContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Transformer, Rect, Group, Label, Text, Tag, Line } from "react-konva";
import useImageAnnotation from "../../contexts/ImageAnnotationContext";
import polylabel from "polylabel";
import polygonSelfIntersect from "polygon-selfintersect";

const ImageAnnotationRect = () => {
  const { pan, zoom, imageDims, imageOffset } = useSketchBoard();
  const {
    shapeProps: defaultShapeProps,
    isSelected,
    onSelect,
    onChange,
    editable,
    labelName,
    color,
  } = useImageAnnotation();
  const shapeRef = React.useRef();
  const [controlPoints, setControlPoints] = useState(
    defaultShapeProps?.controlPoints || []
  );
  const [lastValidControlPoints, setLastValidControlPoints] = useState(null);
  const [root, setRoot] = useState([
    defaultShapeProps?.x ?? 0,
    defaultShapeProps?.y ?? 0,
  ]);

  const points = useMemo(() => {
    return controlPoints.reduce((a, b) => a.concat(b), []);
  }, [controlPoints]);

  const shapeProps = useMemo(() => {
    return {
      points,
      controlPoints,
      x: root?.[0] || 0,
      y: root?.[1] || 0,
    };
  }, [points, root, controlPoints]);

  const posConstrains = useMemo(() => {
    return shapeProps.controlPoints.reduce(
      (acc, cur) => {
        acc.minX = Math.min(acc.minX, cur[0]);
        acc.maxX = Math.max(acc.maxX, cur[0]);
        acc.minY = Math.min(acc.minY, cur[1]);
        acc.maxY = Math.max(acc.maxY, cur[1]);
        acc.width = acc.maxX - acc.minX;
        acc.height = acc.maxY - acc.minY;
        return acc;
      },
      {
        minX: Number.MAX_SAFE_INTEGER,
        minY: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        maxY: Number.MIN_SAFE_INTEGER,
      }
    );
  }, [shapeProps]);

  const center = useMemo(() => {
    if (controlPoints.length < 3) {
      return [0, 0];
    }
    const centerPoint = polylabel([controlPoints]);
    return centerPoint;
  }, [controlPoints]);

  const handleSelect = useCallback(() => {
    onSelect();
  }, [onSelect]);

  const handleDragMoveShape = useCallback(
    (event) => {
      const newPos = [event.target.attrs.x, event.target.attrs.y];
      setRoot(newPos);
    },
    [setRoot]
  );

  const handleDragStartControlPoint = useCallback(
    (event) => {
      const oldPoints = [...controlPoints];
      setLastValidControlPoints(oldPoints);
    },
    [controlPoints, setLastValidControlPoints]
  );

  const handleDragMoveControlPoint = useCallback(
    (event) => {
      const index = event.target.index - 1;
      const { evt } = event;
      const layerX = event.target.x();
      const layerY = event.target.y();
      const { width, height } = imageDims;
      const x = Math.max(0, Math.min(imageOffset.x + width, layerX));
      const y = Math.max(0, Math.min(imageOffset.y + height, layerY));
      const mousePos = [x, y];
      const newPoints = [
        ...controlPoints.slice(0, index),
        mousePos,
        ...controlPoints.slice(index + 1),
      ];
      setControlPoints(newPoints);
    },
    [controlPoints, imageDims,imageOffset, pan, zoom, setControlPoints]
  );

  const handleDragEndShape = useCallback(() => {
    onChange(shapeProps);
  }, [onChange, shapeProps]);

  const handleDragEndControlPoint = useCallback(() => {
    if (!polygonSelfIntersect.findSelfIntersections(shapeProps.controlPoints)) {
      onChange(shapeProps);
    } else {
      setControlPoints(lastValidControlPoints);
      setLastValidControlPoints(null);
    }
  }, [
    onChange,
    lastValidControlPoints,
    shapeProps,
    setControlPoints,
    setLastValidControlPoints,
  ]);

  const handleMouseOverControlPoint = useCallback((event, index) => {}, []);

  const handleMouseOutControlPoint = useCallback((event, index) => {}, []);

  useEffect(() => {
    setControlPoints(defaultShapeProps?.controlPoints);
    setRoot([defaultShapeProps?.x ?? 0, defaultShapeProps?.y ?? 0]);
  }, [defaultShapeProps, setControlPoints, setRoot]);

  return (
    <Group>
      <Line
        ref={shapeRef}
        {...shapeProps}
        stroke="black"
        opacity={0.4}
        fill={color}
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        onDragMove={handleDragMoveShape}
        onDragEnd={handleDragEndShape}
        strokeWidth={3}
        closed={true}
        draggable={editable}
        dragBoundFunc={(pos) => {
          const [rx, ry] = controlPoints[0];
          return {
            x: Math.max(
              imageOffset.x - posConstrains.minX,
              Math.min(
                pos.x,
                imageOffset.x + imageDims.width - posConstrains.maxX
              )
            ),
            y: Math.max(
              imageOffset.y - posConstrains.minY,
              Math.min(
                pos.y,
                imageOffset.y + imageDims.height - posConstrains.maxY
              )
            ),
          };
        }}
      />
      {isSelected &&
        controlPoints.map((point, index) => {
          const width = 6;
          const x = point[0] - width / 2 + (root?.[0] ?? 0);
          const y = point[1] - width / 2 + (root?.[1] ?? 0);

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={width}
              fill="white"
              stroke="black"
              strokeWidth={3}
              hitStrokeWidth={12}
              onMouseOver={(e) => handleMouseOverControlPoint(e, index)}
              onMouseOut={(e) => handleMouseOutControlPoint(e, index)}
              onDragStart={handleDragStartControlPoint}
              onDragMove={handleDragMoveControlPoint}
              onDragEnd={handleDragEndControlPoint}
              draggable={editable}
              dragBoundFunc={(pos) => {
                return {
                  x: Math.max(
                    imageOffset.x,
                    Math.min(pos.x, imageOffset.x + imageDims.width - width)
                  ),
                  y: Math.max(
                    imageOffset.y,
                    Math.min(pos.y, imageOffset.y + imageDims.height - width)
                  ),
                };
              }}
            />
          );
        })}
      {!editable && (
        <Label x={center[0]} y={center[1]}>
          <Text
            text={labelName}
            anchor="center"
            align="center"
            verticalAlign="middle"
          />
        </Label>
      )}
    </Group>
  );
};

export default ImageAnnotationRect;
