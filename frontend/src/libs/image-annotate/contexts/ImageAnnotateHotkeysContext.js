import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { HotKeys } from "react-hotkeys";
import useImageAnnotate from "./ImageAnnotateContext";

export const ImageAnnotateHotkeysContext = createContext({
  hotkeys: {},
  keyMap: {},
  unregisterHotkey: null,
  registerHotkey: null,
});

export const useImageAnnotateHotkeyStorage = () =>
  useContext(ImageAnnotateHotkeysContext);

export const ImageAnnotateHotkeyStorageProvider = ({ children }) => {
  const {
    mode,
    tools,
    selectTool,
    selectPreviousTool,
    deleteSelectedShape,
    skipWorkItem,
    submitWorkItem,
    voteUpLabeledItem,
    voteDownLabeledItem,
    navigateOptionUp,
    navigateOptionDown,
    toggleCurrentOption,
    onNext,
    onBack,
  } = useImageAnnotate();
  const hotkeys = useMemo(() => {
    const keys = [];
    if (mode === "annotate") {
      for (const [index, tool] of (tools || []).entries()) {
        if (index >= 9) {
          break;
        }

        const id = `select_tool_${tool.id}`;
        const description = `${tool.name}`;
        const binding = [`${index + 1}`];
        const handle = () => selectTool(tool.id);

        keys.push({
          id,
          description,
          binding,
          handle,
        });
      }

      keys.push({
        id: "select_previous_tool",
        description: "Select previous tool",
        binding: ["n"],
        handle: () => selectPreviousTool(),
      });

      keys.push({
        id: "cancel_current_tool",
        description: "Cancel current tool",
        binding: ["c"],
        handle: () => selectTool(null),
      });

      keys.push({
        id: "delete_selected_shape",
        description: "Delete selected tool",
        binding: ["d"],
        handle: () => deleteSelectedShape(),
      });

      keys.push({
        id: "submit_work_item",
        description: "Submit current work item",
        binding: ["s"],
        handle: () => submitWorkItem(),
      });

      keys.push({
        id: "skip_work_item",
        description: "Skip current work item",
        binding: ["x"],
        handle: () => skipWorkItem(),
      });

      keys.push({
        id: "arrow_up",
        description: "Navigate current selection up",
        binding: ["up"],
        handle: () => navigateOptionUp(),
      });

      keys.push({
        id: "arrow_down",
        description: "Navigate current selection down",
        binding: ["down"],
        handle: () => navigateOptionDown(),
      });

      keys.push({
        id: "toggle current option",
        description: "Toggle current selection option",
        binding: ["left", "right"],
        handle: () => toggleCurrentOption(),
      });
    } else if (mode === "review") {
      keys.push({
        id: "vote_up_work_item",
        description: "Mark current label as Good",
        binding: ["g"],
        handle: () => voteUpLabeledItem(),
      });

      keys.push({
        id: "vote_down_work_item",
        description: "Mark current label as Bad",
        binding: ["b"],
        handle: () => voteDownLabeledItem(),
      });

      keys.push({
        id: "submit_work_item",
        description: "Submit current work item",
        binding: ["s"],
        handle: () => submitWorkItem(),
      });
    } else if (mode === "verify") {
      keys.push({
        id: "accept_work_item",
        description: "Accept work item",
        binding: ["a"],
        handle: () => submitWorkItem(),
      });

      keys.push({
        id: "reject_work_item",
        description: "Reject work item",
        binding: ["r"],
        handle: () => skipWorkItem(),
      });

      keys.push({
        id: "next_work_item",
        description: "Next work item",
        binding: ["up"],
        handle: () => onNext(),
      });

      keys.push({
        id: "back_work_item",
        description: "Back work item",
        binding: ["down"],
        handle: () => onBack(),
      });
    }

    return keys;
  }, [
    mode,
    tools,
    selectTool,
    selectPreviousTool,
    deleteSelectedShape,
    skipWorkItem,
    submitWorkItem,
    navigateOptionUp,
    navigateOptionDown,
    voteUpLabeledItem,
    onNext,
    onBack,
    toggleCurrentOption,
  ]);

  const keyMap = useMemo(() => {
    const keyMap = {};
    for (const { id, binding } of hotkeys) {
      if (!binding) continue;
      keyMap[id] = binding;
    }
    return keyMap;
  }, [hotkeys]);

  const handlers = useMemo(() => {
    const keyMap = {};
    for (const { id, handle } of hotkeys) {
      if (!handle) continue;
      keyMap[id] = handle;
    }
    return keyMap;
  }, [hotkeys]);

  const contextValue = useMemo(
    () => ({
      hotkeys,
    }),
    [hotkeys]
  );

  return (
    <ImageAnnotateHotkeysContext.Provider value={contextValue}>
      <HotKeys
        style={{
          height: "100%",
          width: "100%",
        }}
        allowChanges={true}
        keyMap={keyMap}
        handlers={handlers}
      >
        {children}
      </HotKeys>
    </ImageAnnotateHotkeysContext.Provider>
  );
};
