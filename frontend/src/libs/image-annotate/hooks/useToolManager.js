import { useState, useMemo, useCallback, useRef } from "react";

export default function useToolManager({ tools: toolDefs }) {
  const [selectedToolId, setSelectedToolId] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const previousToolRef = useRef();

  const tools = useMemo(() => {
    return (toolDefs || []).map((tool) => ({ ...tool }));
  }, [toolDefs]);

  const toolsMap = useMemo(() => {
    return (tools || []).reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
  }, [tools]);

  const selectedTool = useMemo(() => {
    return toolsMap[selectedToolId];
  }, [toolsMap, selectedToolId, previousToolRef]);


  const selectedControl = useMemo(() => {
    return selectedTool ? selectedTool.controls[0] : 0;
  }, [selectedTool]);

  const selectedToolLabels = useMemo(() => {
    return selectedTool ? selectedTool.labels : null;
  }, [selectedTool]);

  const selectedLabel = useMemo(() => {
    return selectedToolLabels ? selectedToolLabels[selectedOptionIndex] : null;
  }, [selectedToolLabels, selectedOptionIndex])

  const selectTool = useCallback(
    (id) => {
      setSelectedToolId(id);
      if (id) {
        previousToolRef.current = id;
      }
    },
    [setSelectedToolId, previousToolRef]
  );

  const navigateOptionDown = useCallback(() => {
    if (!selectedToolLabels || !selectedToolLabels.length) {
      return;
    }
    const nextIndex = selectedOptionIndex + 1;
    const validNextIndex =
      nextIndex < selectedToolLabels.length ? nextIndex : 0;
    setSelectedOptionIndex(validNextIndex);
  }, [selectedToolLabels, setSelectedOptionIndex, selectedOptionIndex]);

  const navigateOptionUp = useCallback(() => {
    if (!selectedToolLabels || !selectedToolLabels.length) {
      return;
    }
    const nextIndex = selectedOptionIndex - 1;
    const validNextIndex =
      nextIndex > -1 ? nextIndex : selectedToolLabels.length;
    setSelectedOptionIndex(validNextIndex);
  }, [selectedToolLabels, setSelectedOptionIndex, selectedOptionIndex]);

  const selectPreviousTool = useCallback(() => {
    if (!previousToolRef.current) {
      return;
    }
    selectTool(previousToolRef.current);
  }, [selectTool, previousToolRef]);

  return {
    tools,
    toolsMap,
    selectedToolId,
    selectedTool,
    selectedLabel,
    selectedOptionIndex,
    selectedControl,
    setSelectedOptionIndex,
    navigateOptionUp,
    navigateOptionDown,
    selectTool,
    selectPreviousTool,
  };
}
