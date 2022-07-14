import { useState, useEffect, useCallback } from "react";

const scaleBy = 1.05;

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

export default function useCanvasHandle({ stage, setZoom, setPan }) {

  const [lastCenter, setLastCenter] = useState(0);
  const [lastDist, setLastDist] = useState(0);

  const handleWheel = useCallback(
    (event) => {
      if (!stage) { return; }
      // event.evt.preventDefault();

      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale =
        event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      setZoom(newScale);
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      };
      setPan(newPos);
    },
    [stage, setZoom, setPan]
  );

  const handleTouch = useCallback(
    (e) => {
      if (!stage) { return; }
      // e.evt.preventDefault();

      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const stage = stage;

      if (stage.isDragging()) {
        stage.stopDrag();
      }

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastCenter) {
        const newLastCenter = getCenter(p1, p2);
        setLastCenter(newLastCenter);
        return;
      }
      const newCenter = getCenter(p1, p2);

      const dist = getDistance(p1, p2);
      const currentDist = lastDist || dist;

      // local coordinates of center point
      const pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      };

      const scale = stage.scaleX() * (dist / currentDist);

      setZoom(scale);

      // calculate new position of the stage
      const dx = newCenter.x - lastCenter.x;
      const dy = newCenter.y - lastCenter.y;

      const newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };
      setPan(newPos);
      setLastDist(currentDist);
      setLastCenter(newCenter);
    },
    [
      stage,
      lastCenter,
      lastDist,
      setLastCenter,
      setLastDist,
      setPan,
      setZoom,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    setLastCenter(null);
    setLastDist(0);
  }, [setLastCenter, setLastDist]);

  return {
    handleWheel,
    handleTouch,
    handleTouchEnd
  };
}
