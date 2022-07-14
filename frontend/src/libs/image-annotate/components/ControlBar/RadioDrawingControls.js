import React from "react";
import StopOutlined from "@ant-design/icons/StopOutlined";
import CaretUpOutlined from "@ant-design/icons/CaretUpOutlined";
import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";
import Button from "antd/lib/button";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const RadioDrawingControls = () => {
  const { selectTool } = useImageAnnotate();

  return (
    <>
      <Button
        type="text"
        title="Cancel drawing"
        icon={<CaretUpOutlined />}
      ></Button>
      <Button
        type="text"
        title="Cancel drawing"
        icon={<CaretDownOutlined />}
      ></Button>
      <Button
        onClick={() => selectTool(null)}
        type="text"
        title="Cancel drawing"
        icon={<StopOutlined />}
      ></Button>
    </>
  );
};

export default RadioDrawingControls;
