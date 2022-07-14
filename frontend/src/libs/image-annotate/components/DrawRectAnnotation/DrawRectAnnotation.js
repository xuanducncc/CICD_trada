import useSketchBoard from "@libs/image-annotate/contexts/SketchBoardContext";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { Stage, Layer, Rect, Group, Label, Text, Tag, Line } from "react-konva";

const DrawRectAnnotation = () => {
  const {
    commitDrawing,
    selectedTool,
    pan,
    zoom,
    imageDims,
  } = useSketchBoard();
  const [isDrawing, setIsDrawing] = useState(false);
  const [p1, setP1] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [p2, setP2] = useState(null);
  const layerRef = React.useRef(null);
  const label = useMemo(() => {
    const { labels } = selectedTool;
    const [label] = labels;
    return label;
  }, [selectedTool]);

  const color = useMemo(() => {
    return label?.color;
  }, [label]);

  const rectProps = useMemo(() => {
    if (!p1 || !mousePos) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        opacity: 0.0,
      };
    }
    const [x1, y1] = p1;
    const [x2, y2] = mousePos;
    return {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1,
      fill: color || "blue",
      stroke: "black",
      opacity: 0.2,
    };
  }, [p1, mousePos]);

  const handleMouseDown = useCallback(
    (e) => {
      if (isDrawing) {
        setP2(mousePos);
      } else {
        const { evt } = e;
        const { layerX, layerY } = evt;
        const { width, height } = imageDims;
        const x = Math.max(0, Math.min(width, (layerX - pan.x) / zoom));
        const y = Math.max(0, Math.min(height, (layerY - pan.y) / zoom));

        setIsDrawing(true);
        setP1([x, y]);
      }
    },
    [isDrawing, mousePos, pan, zoom, imageDims, setIsDrawing, setP1, setP2]
  );

  const handleMouseMove = useCallback(
    (e) => {
      const { evt } = e;
      const { layerX, layerY } = evt;
      const { width, height } = imageDims;
      const x = Math.max(0, Math.min(width, (layerX - pan.x) / zoom));
      const y = Math.max(0, Math.min(height, (layerY - pan.y) / zoom));
      setMousePos([x, y]);
    },
    [layerRef.current, pan, zoom, setMousePos, isDrawing, imageDims]
  );

  useEffect(() => {
    if (!p1 || !p2) {
      return;
    }

    const { name, code, id } = label;

    commitDrawing({
      labelValue: rectProps,
      labelName: name,
      tool_id: selectedTool.id,
      labelCode: code,
      label_id: id,
      color,
    });

    setP1(null);
    setP2(null);
    setIsDrawing(false);
  }, [p1, p2, setP1, setP2, setIsDrawing, rectProps, label, commitDrawing]);

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
        <Rect {...rectProps}></Rect>
        {mousePos && (
          <>
            <Line
              x={mousePos[0]}
              y={mousePos[1]}
              points={[-999, 0, 999, 0]}
              dash={[4, 4]}
              stroke={color}
              strokeWidth={1}
              opacity={1}
            />
            <Line
              x={mousePos[0]}
              y={mousePos[1]}
              points={[0, -999, 0, 999]}
              dash={[4, 4]}
              stroke={color}
              strokeWidth={1}
              opacity={1}
            />
          </>
        )}
      </Group>
    </Layer>
  );
};

export default DrawRectAnnotation;
