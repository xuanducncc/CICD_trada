import { uuid } from "@utils/uuid";
import { useCallback, useMemo } from "react";

export default function useDrawingControl({ selectedTool, addNewShape, selectTool }) {

  const activeDrawingTool = useMemo(() => {
    if( !selectedTool ) { return null; }
    const { controls } = selectedTool;
    const [ control ] = controls;
    const { type } = control;

    return type;
  }, [selectedTool])

  const commitDrawing = useCallback((item) => {
    if( !selectedTool ) { return null; }

    addNewShape({
      ...item,
      toolType: selectedTool.type,
      controlType: activeDrawingTool,
      drafted: true,
      id: null,
      clientId: null,
    });

    selectTool(null);
  }, [activeDrawingTool, addNewShape, selectedTool, selectTool]);

  return {
    activeDrawingTool,
    commitDrawing,
  };
}
