import { styled } from "@material-ui/styles";
import React, { useMemo } from "react";

import ToolSideBar from "./ToolSideBar";
import ObjectSidebar from "./ObjectSidebar";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import ClassSidebar from "./ClassSideBar";

const SideBarWrapper = styled("div")({
  padding: "10px",
  width: ({ mode }) => (mode === 'review' || mode === 'verify' || mode === 'preview') ? "400px" : "300px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  flex: "1",
});

const SIDEBAR_MODE = {
  CLASS: 'CLASS',
  TOOLS: 'TOOLS',
  OBJECT: 'OBJECT'
}

const SideBar = () => {
  const { selectedShape, mode  } = useImageAnnotate();

  const sideBarMode = useMemo(() => {
    return SIDEBAR_MODE.TOOLS;
  }, [selectedShape]);

  return (
    <SideBarWrapper mode={mode}>
      {sideBarMode === SIDEBAR_MODE.OBJECT && <ObjectSidebar />}
      {sideBarMode === SIDEBAR_MODE.TOOLS && <ToolSideBar />}
      {sideBarMode === SIDEBAR_MODE.CLASS && <ClassSidebar />}
    </SideBarWrapper>
  );
};

export default SideBar;
