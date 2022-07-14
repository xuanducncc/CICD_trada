import React from "react";
import Menu from "antd/lib/menu";
import Button from "antd/lib/button";
import DragOutlined from "@ant-design/icons/DragOutlined";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import { PointerIcon } from "@utils/icons";

const GabSelectionControls = () => {
  const { activeZoomControl, setActiveZoomControl } = useImageAnnotate();

  return (
    <>
      <Button
        className={!activeZoomControl ? "active" : ""}
        onClick={() => setActiveZoomControl(false)}
        type="text"
        title="Selection mode"
        icon={<PointerIcon width="32px" height="32px" />}
      ></Button>
      <Button
        className={activeZoomControl ? "active" : ""}
        onClick={() => setActiveZoomControl(true)}
        type="text"
        title="Control mode"
        icon={<DragOutlined />}
      ></Button>
    </>
  );
};

export default GabSelectionControls;
