import React, { useCallback } from "react";
import Menu from "antd/lib/menu";
import Button from "antd/lib/button";
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const DrawerButton = () => {
  const { onQueue } = useImageAnnotate();

  return (
    <Button onClick={onQueue} type="text" icon={<MenuOutlined />}></Button>
  );
};

export default DrawerButton;
