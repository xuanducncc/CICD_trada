import React, { useCallback } from "react";
import Button from "antd/lib/button";
import Tooltip from "antd/lib/tooltip";
import InforCircleOutLined from "@ant-design/icons/InfoCircleOutlined";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const InstructionButton = () => {
  const { onInstruction } = useImageAnnotate();

  return (
    <Tooltip placement="bottomLeft" title={"Instruction"}>
      <Button onClick={onInstruction} type="text" icon={<InforCircleOutLined />}></Button>
    </Tooltip>
  )
};

export default InstructionButton;
