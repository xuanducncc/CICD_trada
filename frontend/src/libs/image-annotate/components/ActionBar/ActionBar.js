import React from "react";
import Button from "antd/lib/button";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const ActionBar = () => {
  const { submitWorkItem } = useImageAnnotate();
  return (
    <>
      <Button>Skip</Button>
      <Button onClick={submitWorkItem}>Submit</Button>
    </>
  );
};

export default ActionBar;
