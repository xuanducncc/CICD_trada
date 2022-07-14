import React, { useCallback, useMemo } from "react";
import { styled } from "@material-ui/styles";
import { RectIcon } from "@utils/icons";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import DetectionToolIcon from "../DetectionToolIcon/DetectionToolIcon";
import useToolType from "@libs/image-annotate/hooks/useToolType";
import { setOpacity } from '@utils/color';


const DetectionToolWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  backgroundColor: ({color}) => color,
});

const HotKetButton = styled("div")({
  color: 'rgb(84, 78, 78)',
  margin: '0px 2px',
  padding: '5px',
  minWidth: '30px',
  background: 'rgb(232, 235, 237)',
  textAlign: 'center',
  fontWeight: 'bold',
  borderRadius: '10px'
})

const DetectionTool = ({ tool, index }) => {
  const { selectTool, mode } = useImageAnnotate();
  const { labels } = tool;
  const [label] = labels;
  const { name, color } = label;
  const type = useToolType(tool);

  const handleSelectTool = useCallback(
    (e) => {
      if(mode !== 'annotate') {
        return;
      }
      e.preventDefault();
      selectTool(tool.id);
    },
    [tool, selectTool, mode]
  );

  return (
    <DetectionToolWrapper onClick={handleSelectTool}>
      <DetectionToolIcon color={color} type={type} />
      <div style={{marginRight:10}}>{name}</div>
      <div>
        {mode === 'annotate' && <HotKetButton>{index + 1}</HotKetButton>}
      </div>
    </DetectionToolWrapper>
  );
};

export default DetectionTool;
