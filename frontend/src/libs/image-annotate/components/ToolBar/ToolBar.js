import { styled } from "@material-ui/styles";
import React, { useMemo, useEffect } from "react";
import List from "antd/lib/list";
import useImageAnnotate from "../../contexts/ImageAnnotateContext";
import { IMAGE_ANNOTATION_TYPE } from "@utils/const";
import DetectionTool from "../DetectionTool/DetectionTool";
import ClassificationTool from "../ClassificationTool/ClassificationTool";

const ToolBarWrapper = styled("div")({
  width: "100%",
});

const ToolBarItemWrapper = styled("div")({
  width: "100%",
  border: ({ active }) => (active ? "1px dashed gray" : "none"),
});

const ToolBarItem = ({ tool, active, index, mode }) => {
  const { type } = tool;

  return (
    <ToolBarItemWrapper active={active}>
      {type === IMAGE_ANNOTATION_TYPE.DETECTION && (
        <DetectionTool mode={mode} index={index} tool={tool}></DetectionTool>
      )}
      {type === IMAGE_ANNOTATION_TYPE.CLASSIFICATION && (
        <ClassificationTool mode={mode} tool={tool}></ClassificationTool>
      )}
    </ToolBarItemWrapper>
  );
};

const ToolBar = () => {
  const {
    tools,
    selectedToolId,
    selectedLabeledItemId,
    mode,
    classesMap,
  } = useImageAnnotate();

  const displayedTool = useMemo(() => {
    if (mode === "verify") {
      return (tools || []).filter(
        (tool) => classesMap[tool.id] && classesMap[tool.id].labelValue
      );
    }

    if (mode === "review") {
      return (tools || []).filter(
        (tool) => classesMap[tool.id] && classesMap[tool.id].labelValue
      );
    }
    return tools || [];
  }, [tools, mode, classesMap]);

  return (
    <ToolBarWrapper>
      <List>
        {displayedTool.map((tool, index) => (
          <List.Item key={tool.id}>
            <ToolBarItem
              active={selectedToolId === tool.id}
              index={index}
              tool={tool}
              mode={mode}
            />
          </List.Item>
        ))}
      </List>
    </ToolBarWrapper>
  );
};

export default ToolBar;
