import React from "react";
import StepBackwardOutlined from "@ant-design/icons/StepBackwardOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/RightOutlined";
import StepForwardOutlined from "@ant-design/icons/StepForwardOutlined";
import Button from "antd/lib/button";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const ControlButtons = () => {
  const { onNext, onPrev, onToFirst, onToLast } = useImageAnnotate();
  return (
    <>
      <Button
        onClick={onToFirst}
        type="text"
        icon={<StepBackwardOutlined />}
      ></Button>
      <Button onClick={onPrev} type="text" icon={<LeftOutlined />}></Button>
      <Button onClick={onNext} type="text" icon={<RightOutlined />}></Button>
      <Button
        onClick={onToLast}
        type="text"
        icon={<StepForwardOutlined />}
      ></Button>
    </>
  );
};

export default ControlButtons;
