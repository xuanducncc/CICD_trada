import React, { useCallback } from "react";
import Menu from "antd/lib/menu";
import Button from "antd/lib/button";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const BackButton = () => {
  const { onBack } = useImageAnnotate();
  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  return <Button onClick={handleBack} type="text" icon={<CloseOutlined />}></Button>;
};

export default BackButton;
