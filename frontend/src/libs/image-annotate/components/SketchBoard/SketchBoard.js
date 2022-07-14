import React, { useCallback, useEffect, useMemo, useState } from "react";
import useImageAnnotate, {
  ImageAnnotateProvider,
} from "../../contexts/ImageAnnotateContext";
import { Stage, Layer, Star, Text } from "react-konva";
import ImageCanvas from "../ImageCanvas/ImageCanvas";
import ImageAnnotations from "../ImageAnnotations/ImageAnnotations";
import DrawAnnotations from "../DrawAnnotations/DrawAnnotations";
import { styled } from "@material-ui/styles";
import useDimensions from "react-use-dimensions";
import { SketchBoardProvider } from "../../contexts/SketchBoardContext";
import useCanvasHandle from "../../hooks/useCanvasHandle";
import { isTouchEnabled } from "@utils/platform";
import Loading from "@components/Loading";

const SketchBoardWrapper = styled("div")({
  display: "flex",
  flex: "1",
  backgroundColor: "#bdbdbd",
  position: "relative",
});

const SketchBoard = () => {
  const stageRef = React.useRef(null);
  const [ref, { width, height }] = useDimensions();
  const ctx = useImageAnnotate();
  const { zoom, setZoom, pan, setPan, setCanvasDims, loading, error } = ctx;

  const { handleTouch, handleTouchEnd, handleWheel } = useCanvasHandle({
    stage: stageRef.current,
    setZoom,
    setPan,
  });

  const safeToRenderStage = useMemo(() => {
    return width > 0 && height > 0;
  }, [width, height]);

  useEffect(() => {
    if (!safeToRenderStage) {
      return;
    }
    setCanvasDims({ width, height });
  }, [width, height, setCanvasDims, safeToRenderStage]);

  return (
    <SketchBoardWrapper ref={ref}>
      {safeToRenderStage && (
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          scaleX={zoom}
          scaleY={zoom}
          position={pan}
          draggable={!isTouchEnabled()}
          onWheel={handleWheel}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
        >
          <SketchBoardProvider value={ctx}>
            <ImageCanvas />
            <ImageAnnotations />
            <DrawAnnotations />
          </SketchBoardProvider>
        </Stage>
      )}
      <div
        style={{
          display: loading || error ? "flex" : "none",
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          backgroundColor: "rgba(39, 39, 39, 0.1)",
          alignItems: "center",
        }}
      >
        {loading && <Loading />}
        {error && <div>{error.message}</div>}
      </div>
    </SketchBoardWrapper>
  );
};

export default SketchBoard;
