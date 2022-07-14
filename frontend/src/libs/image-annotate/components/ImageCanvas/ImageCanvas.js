import React, { useEffect, useLayoutEffect, useRef } from "react";
import { render } from "react-dom";
import { Image, Layer, Text, Group } from "react-konva";
import useImage from "use-image";
import useSketchBoard from "../../contexts/SketchBoardContext";

const ImageCanvas = () => {
  const { mediaUrl, setImageDims } = useSketchBoard();
  const [image] = useImage(mediaUrl);

  useEffect(() => {
    if (!image) {
      return;
    }
    const { width, height } = image;
    setImageDims({ width, height });
  }, [image, setImageDims]);

  return (
    <Layer>
      <Group>
        <Image x={0} y={0} image={image} />
      </Group>
    </Layer>
  );
};

export default ImageCanvas;
