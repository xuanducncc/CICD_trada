import React from "react";
import StopOutlined from "@ant-design/icons/StopOutlined";
import Button from "antd/lib/button";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const RectDrawingControls = () => {
  const { selectTool } = useImageAnnotate();

  return (
    <>
      {/* <Button type="text" icon={<StepBackwardOutlined />}></Button> */}
      <Button
        onClick={() => selectTool(null)}
        type="text"
        title="Cancel drawing"
        icon={<StopOutlined />}
      ></Button>
    </>
  );
};

export default RectDrawingControls;
