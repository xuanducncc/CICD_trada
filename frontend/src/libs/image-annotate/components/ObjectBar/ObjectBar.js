import { styled } from "@material-ui/styles";
import React, { useCallback } from "react";
import List from "antd/lib/list";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import ObjectBarItem from "./ObjectBarItem";

const ObjectBarWrapper = styled("div")({});

const ObjectBar = () => {
  const { objects, selectedShapeId, selectShape } = useImageAnnotate();

  return (
    <ObjectBarWrapper>
      <List>
        {(objects || []).map((object) => (
          <List.Item
            onClick={() => selectShape(object.clientId)}
            key={object.clientId}
          >
            <ObjectBarItem active={selectedShapeId === object.clientId} object={object} />
          </List.Item>
        ))}
      </List>
    </ObjectBarWrapper>
  );
};

export default ObjectBar;
