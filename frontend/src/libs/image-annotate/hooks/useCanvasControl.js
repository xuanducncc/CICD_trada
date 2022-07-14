import { useState, useEffect, useCallback, useMemo } from "react";

const ZOOM_BY = 0.1;

const getScaleFactor = ({ imageDims, canvasDims }) => {
  const availableWidth = (0.8 * canvasDims.width);
  const availableHeight = (0.8 * canvasDims.height);

  const frameWidth = imageDims.width;
  const frameHeight = imageDims.height;

  const scaleX = availableWidth > frameWidth ? availableWidth/frameWidth : frameWidth/availableWidth;
  const scaleY = availableHeight > frameHeight ? availableHeight/frameHeight : frameHeight/availableHeight;

  return availableWidth > availableHeight ? scaleY : scaleX;
};

const getPanFactor = ({ imageDims, canvasDims, zoom }) => {
  const withGap = canvasDims.width - imageDims.width * zoom;
  const heightGap = canvasDims.height - imageDims.height * zoom;
  const x = withGap / 2;
  const y = heightGap / 2;

  return {
    x,
    y,
  };
};

export default function useCanvasControl() {
  const [activeZoomControl, setActiveZoomControl] = useState(false);
  const [canvasDims, setCanvasDims] = useState(null);
  const [imageDims, setImageDims] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 1 });

  const imageOffset = useMemo(() => {
    if (!imageDims || !canvasDims) {
      return {
        x: 0,
        y: 0,
      };
    }
    return {
      x: (canvasDims.width - imageDims.width) / 2,
      y: (canvasDims.height - imageDims.height) / 2,
    };
  }, [canvasDims, imageDims]);

  const zoomIn = useCallback(() => {
    return setZoom(zoom + ZOOM_BY);
  }, [zoom, setZoom]);

  const zoomOut = useCallback(() => {
    return setZoom(zoom - ZOOM_BY);
  }, [zoom, setZoom]);

  const zoomToFit = useCallback(() => {
    if (!canvasDims || !imageDims) {
      return;
    }

    const zoom = getScaleFactor({ canvasDims, imageDims });
    const pan = getPanFactor({ canvasDims, imageDims, zoom });

    setPan(pan);
    setZoom(zoom);
  }, [canvasDims, imageDims, setPan, setZoom]);

  const zoomToInitial = useCallback(() => {
    return setZoom(1);
  }, [zoom, setZoom]);

  useEffect(() => {
    if (!canvasDims || !imageDims) {
      return;
    }
    zoomToFit();
  }, [canvasDims, imageDims, zoomToFit]);

  return {
    activeZoomControl,
    zoom,
    pan,
    imageDims,
    canvasDims,
    imageOffset,
    setActiveZoomControl,
    setZoom,
    setPan,
    zoomIn,
    zoomOut,
    zoomToFit,
    setImageDims,
    setCanvasDims,
    zoomToInitial,
  };
}
