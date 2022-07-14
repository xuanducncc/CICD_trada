import useSketchBoard from "@libs/image-annotate/contexts/SketchBoardContext";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import polygonSelfIntersect from 'polygon-selfintersect';
import { Stage, Layer, Rect, Group, Label, Text, Tag, Line } from "react-konva";

const DrawPolygonAnnotation = () => {
  const { commitDrawing, selectedTool, pan, zoom, imageDims } = useSketchBoard();
  const [isActiveRoot, setIsActiveRoot] = useState();
  const [isFinished, setIsFinished] = useState(false);
  const [controlPoints, setControlPoints] = useState([]);
  const [root, setRoot] = useState(null);
  const [mousePos, setMousePos] = useState([]);

  const layerRef = React.useRef(null);
  const label = useMemo(() => {
    const { labels } = selectedTool;
    const [label] = labels;
    return label;
  }, [selectedTool]);

  const color = useMemo(() => {
    return label?.color;
  }, [label]);

  const points = useMemo(() => {
    return controlPoints
      .concat(isFinished ? [] : mousePos)
      .reduce((a, b) => a.concat(b), []);
  }, [controlPoints, isFinished, mousePos]);

  const shapeProps = useMemo(() => {
    return {
      points,
      controlPoints,
      x: root?.[0] || 0,
      y: root?.[0] || 0,
    }
  }, [points, root, controlPoints]);

  const handleMouseDown = useCallback(
    (event) => {
      if (isFinished) {
        return;
      }

      if (isActiveRoot && controlPoints.length >= 3) {
        setIsFinished(true);
        return;
      }

      const { evt } = event;
      const { layerX, layerY } = evt;
      const { width, height } = imageDims;
      const x = Math.max(0, Math.min(width, (layerX - pan.x) / zoom));
      const y = Math.max(0, Math.min(height, (layerY - pan.y) / zoom));
      const mousePos = [x, y];
      const newPoints = [...controlPoints, mousePos];
      setControlPoints(newPoints);
    },
    [pan, controlPoints, root, isFinished, imageDims, isActiveRoot, setRoot, setControlPoints, setIsFinished]
  );

  const handleMouseMove = useCallback(
    (event) => {
      const { evt } = event;
      const { layerX, layerY } = evt;
      const { width, height } = imageDims;
      const x = Math.max(0, Math.min(width, (layerX - pan.x) / zoom));
      const y = Math.max(0, Math.min(height, (layerY - pan.y) / zoom));
      const mousePos = [x, y];
      setMousePos(mousePos);
    },
    [pan, zoom, imageDims, setMousePos]
  );

  const handleDragMovePoint = useCallback(
    (event) => {
      const index = event.target.index - 1;
      const { evt } = event;
      const { layerX, layerY } = evt;
      const mousePos = [(layerX - pan.x) / zoom, (layerY - pan.y) / zoom];
      const newPoints = [
        ...controlPoints.slice(0, index),
        mousePos,
        ...controlPoints.slice(index + 1),
      ];
      if(!polygonSelfIntersect.findSelfIntersections(newPoints)) {
        setControlPoints(newPoints);
      }
    },
    [pan, zoom, controlPoints, setControlPoints]
  );

  const handleMouseOverStartPoint = useCallback(
    (event) => {
      if (isFinished || controlPoints.length < 3) return;
      setIsActiveRoot(true);
    },
    [setIsActiveRoot, isFinished, controlPoints]
  );

  const handleMouseOutStartPoint = useCallback(
    (event) => {
      setIsActiveRoot(false);
    },
    [setIsActiveRoot]
  );

  useEffect(() => {
    if (!isFinished) {
      return;
    }
    const { name, code, id } = label;
    commitDrawing({
      labelValue: {
        ...shapeProps
      },
      labelName: name,
      tool_id: selectedTool.id,
      labelCode: code,
      label_id: id,
      color,
    });
  }, [isFinished, commitDrawing, label, shapeProps, selectedTool, color]);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const stage = layer.getStage();
    if (!stage) {
      return;
    }

    stage.on("mousedown", handleMouseDown);
    stage.on("mousemove", handleMouseMove);
    return () => {
      stage.off("mousedown", handleMouseDown);
      stage.off("mousemove", handleMouseMove);
    };
  }, [layerRef.current, handleMouseDown, handleMouseMove]);

  return (
    <Layer ref={layerRef}>
      <Group>
        <Line
          points={points}
          stroke="black"
          opacity={0.4}
          fill={color}
          strokeWidth={3}
          closed={true}
        />
        {controlPoints.map((point, index) => {
          const width = 6;
          const x = point[0] - width / 2;
          const y = point[1] - width / 2;
          const startPointAttr =
            index === 0
              ? {
                  hitStrokeWidth: 12,
                  scale: isActiveRoot ? { x: 1.5, y: 1.5 } : { x: 1, y: 1 },
                  fill: 'black',
                  stroke: 'white',
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint,
                }
              : null;
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
              onDragMove={handleDragMovePoint}
              {...startPointAttr}
              draggable
            />
          );
        })}
      </Group>
    </Layer>
  );
};

export default DrawPolygonAnnotation;
