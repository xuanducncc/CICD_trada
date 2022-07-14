import React, { useState } from "react";
import ObjectBar from "../ObjectBar/ObjectBar";
import ToolBar from "../ToolBar/ToolBar";
import Button from "antd/lib/button";
import SideBarSection, { SideBarContent } from "./SideBarSection";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";

const ToolSideBar = () => {
  const { submitWorkItem, skipWorkItem, mode } = useImageAnnotate();
  return (
    <>
      <SideBarContent>
        <SideBarSection
          title="TOOLS"
          flex={1}
          style={{
            width: "100%",
            height: "calc(100%/2)",
          }}
        >
          <ToolBar />
        </SideBarSection>
        <SideBarSection
          title="OBJECTS"
          flex={1}
          style={{
            width: "100%",
            height: "calc(100%/2)",
          }}
        >
          <ObjectBar />
        </SideBarSection>
      </SideBarContent>
      {(mode === "annotate") && (
        <SideBarSection
          contentStyle={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button onClick={skipWorkItem}>
            Skip
          </Button>
          <Button onClick={submitWorkItem} type="primary">
            Submit
          </Button>
        </SideBarSection>
      )}
      {(mode === "review") && (
        <SideBarSection
          contentStyle={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button onClick={submitWorkItem} type="primary">
            Submit
          </Button>
        </SideBarSection>
      )}
    </>
  );
};

export default ToolSideBar;
