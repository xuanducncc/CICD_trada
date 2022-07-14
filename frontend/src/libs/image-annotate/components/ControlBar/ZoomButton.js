import React, { useMemo } from "react";
import Menu from "antd/lib/menu";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import ZoomInOutlined from "@ant-design/icons/ZoomInOutlined";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const ZoomButton = () => {
  const {
    zoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToInitial,
  } = useImageAnnotate();

  const zoomPercent = useMemo(() => `${(zoom * 100).toFixed(0)}%`, [zoom]);

  const menu = useMemo(
    () => (
      <Menu>
        <Menu.Item onClick={zoomIn}>
          <div>
            <div>Zoom in</div>
            <div></div>
          </div>
        </Menu.Item>
        <Menu.Item onClick={zoomOut}>
          <div>
            <div>Zoom out</div>
            <div></div>
          </div>
        </Menu.Item>
        <Menu.Item onClick={zoomToFit}>
          <div>
            <div>Zoom to fit</div>
            <div></div>
          </div>
        </Menu.Item>
        <Menu.Item onClick={zoomToInitial}>
          <div>
            <div>Zoom to 100%</div>
            <div></div>
          </div>
        </Menu.Item>
      </Menu>
    ),
    [zoomIn, zoomOut, zoomToFit, zoomToInitial]
  );

  return (
    <Dropdown overlay={menu}>
      <Button type="text" icon={<ZoomInOutlined />}>
        {zoomPercent}
      </Button>
    </Dropdown>
  );
};

export default ZoomButton;
