import { assert } from "@utils/assert";
import { uuid } from "@utils/uuid";
import Legalize from "legalize";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import useCanvasControl from "../hooks/useCanvasControl";
import useAnnotationManager from "../hooks/useAnnotationManager";
import useDrawingControl from "../hooks/useDrawingControl";
import useToolManager from "../hooks/useToolManager";
import useConfigManager from "../hooks/useConfigManager";
import { useImageAnnotateHotkeyStorage } from "./ImageAnnotateHotkeysContext";

export const ImageAnnotateContext = createContext({
  shapesMap: null,
  shapeIds: null,
  zoom: null,
  setZoom: null,
  pan: null,
  setPan: null,
  selectedShapeId: null,
  selectedShape: null,
  selectShape: null,
  updateShape: null,
  mediaUrl: null,
  loading: null,
  error: null,
  zoomIn: null,
  zoomOut: null,
  zoomToFit: null,
  zoomToInitial: null,
  activeDrawingTool: null,
  tools: null,
  objects: null,
  classes: null,
  classesMap: null,
  classesIds: null,
  activeZoomControl: null,
  setActiveZoomControl: null,
  selectedTool: null,
  selectTool: null,
  selectPreviousTool: null,
  deleteSelectedShape: null,
  selectedToolId: null,
  commitDrawing: null,
  deleteShape: null,
  activeAnnotationControl: null,
  setActiveAnnotationControl: null,
  onBack: null,
  setCanvasDims: null,
  setImageDims: null,
  imageDims: null,
  imageOffset: null,
  onNext: null,
  onPrev: null,
  onToFirst: null,
  onToLast: null,
  onQueue: null,
  onInstruction: null,
  updateClass: null,
  submitWorkItem: null,
  skipWorkItem: null,
  mode: null,
  selectedLabeledItemId: null,
  voteUpLabeledItem: null,
  voteDownLabeledItem: null,
  selectedClassId: null,
  selectedOptionIndex: null,
  navigateOptionUp: null,
  navigateOptionDown: null,
  toggleCurrentOption: null,
  selectedControl: null,
  classObjects: null,
  toolsMap: null,
});

export const ImageAnnotateProvider = ({
  mode,
  children,
  config: rawConfig,
  loading,
  error,
  onBack,
  onQueue,
  onInstruction,
  onNext,
  onPrev,
  onToFirst,
  onToLast,
  data,
  onSubmitWorkItem,
  onSkipWorkItem,
  onVoteUpLabeledItem,
  onVoteDownLabeledItem,
  defaultLabeledItemId,
  onSelectLabeledItem,
}) => {
  const { config } = useConfigManager(rawConfig);
  const { workItem, mediaUrl } = data;
  const {
    activeZoomControl,
    zoom,
    pan,
    imageDims,
    imageOffset,
    setActiveZoomControl,
    setCanvasDims,
    setImageDims,
    setPan,
    setZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    zoomToInitial,
  } = useCanvasControl();

  const {
    tools,
    toolsMap,
    selectedTool,
    selectedControl,
    selectedLabel,
    selectedToolId,
    selectedOptionIndex,
    navigateOptionUp,
    navigateOptionDown,
    setSelectedOptionIndex,
    selectTool: doSelectTool,
    selectPreviousTool,
  } = useToolManager({ tools: config.tools });

  const {
    objects,
    classes,
    shapeIds,
    shapesMap,
    classesMap,
    classesIds,
    classObjects,
    draftedItem,
    selectedShape,
    selectedShapeId,
    selectedClassId,
    selectedLabeledItemId,
    activeAnnotationControl,
    deleteShape,
    updateShape,
    addNewShape,
    updateClass,
    skipWorkItem,
    submitWorkItem,
    voteUpLabeledItem,
    voteDownLabeledItem,
    deleteSelectedShape,
    selectLabeledItemId,
    setActiveAnnotationControl,
  } = useAnnotationManager({
    mode,
    workItem,
    onSubmitWorkItem,
    onSkipWorkItem,
    onVoteUpLabeledItem,
    onVoteDownLabeledItem,
    onSelectLabeledItem,
    defaultLabeledItemId,
  });

  const { activeDrawingTool, commitDrawing } = useDrawingControl({
    selectedTool,
    addNewShape,
    selectTool: doSelectTool,
  });

  const toggleCurrentOption = useCallback(() => {
    if (!selectedTool || !selectedControl || !selectedLabel) {
      return;
    }
    const existingLabel = classesMap[selectedTool.id]
      ? classesMap[selectedTool.id]
      : null;
    const preValue = existingLabel ? existingLabel.labelValue : false;
    const isSameLabel = preValue === selectedLabel.code;
    // TODO: implement for multiple choices and free text
    updateClass({
      drafted: true,
      id: null,
      clientId: null,
      toolType: selectedTool.type,
      controlType: selectedControl.type,
      tool_id: selectedTool.id,
      labelValue: isSameLabel ? "" : selectedLabel.code,
      LabelName: isSameLabel ? "" : selectedLabel.code,
      labelCode: isSameLabel ? "" : selectedLabel.code,
      label_id: isSameLabel ? "" : selectedLabel.id,
    });
  }, [updateClass, selectedLabel, selectedTool, selectedControl, classesMap]);

  const selectShape = useCallback(
    (shapeId) => {
      // assert({ shapeId: Legalize.string() })({ shapeId });

      selectLabeledItemId(shapeId);
      doSelectTool(null);
    },
    [selectLabeledItemId, doSelectTool]
  );

  const selectTool = useCallback(
    (toolId) => {
      // assert({ shapeId: Legalize.string() })({ shapeId });

      selectShape(null);
      doSelectTool(toolId);
    },
    [doSelectTool, selectShape]
  );

  useEffect(() => {
    if (activeDrawingTool) {
      setActiveZoomControl(false);
    }
    if (activeZoomControl) {
      setActiveAnnotationControl(false);
    }
  }, [
    activeDrawingTool,
    activeZoomControl,
    setActiveZoomControl,
    setActiveAnnotationControl,
  ]);

  useEffect(() => {
    setSelectedOptionIndex(-1);
    selectTool(null);
  }, [workItem, setSelectedOptionIndex, selectTool]);

  const contextValue = useMemo(
    () => ({
      activeZoomControl,
      setActiveZoomControl,
      shapesMap,
      shapeIds,
      zoom,
      pan,
      setPan,
      selectedShapeId,
      selectedShape,
      selectShape,
      updateShape,
      setZoom,
      zoomIn,
      zoomOut,
      zoomToFit,
      zoomToInitial,
      mediaUrl,
      loading,
      error,
      activeDrawingTool,
      tools,
      objects,
      classes,
      classesMap,
      classObjects,
      classesIds,
      selectedTool,
      toolsMap,
      selectTool,
      selectPreviousTool,
      deleteSelectedShape,
      selectedToolId,
      commitDrawing,
      deleteShape,
      activeAnnotationControl,
      setActiveAnnotationControl,
      onBack,
      setCanvasDims,
      setImageDims,
      imageDims,
      imageOffset,
      onNext,
      onPrev,
      onToFirst,
      onToLast,
      onQueue,
      onInstruction,
      updateClass,
      submitWorkItem,
      skipWorkItem,
      mode,
      draftedItem,
      selectedLabeledItemId,
      selectedClassId,
      voteUpLabeledItem,
      voteDownLabeledItem,
      selectedOptionIndex,
      navigateOptionUp,
      navigateOptionDown,
      toggleCurrentOption,
      selectedControl,
    }),
    [
      shapesMap,
      shapeIds,
      zoom,
      setZoom,
      pan,
      setPan,
      selectedShapeId,
      selectedShape,
      selectShape,
      updateShape,
      zoomIn,
      zoomOut,
      zoomToFit,
      zoomToInitial,
      mediaUrl,
      loading,
      error,
      activeDrawingTool,
      objects,
      classes,
      classesMap,
      classesIds,
      classObjects,
      tools,
      toolsMap,
      activeZoomControl,
      setActiveZoomControl,
      selectedTool,
      selectTool,
      selectPreviousTool,
      deleteSelectedShape,
      selectedToolId,
      commitDrawing,
      deleteShape,
      activeAnnotationControl,
      setActiveAnnotationControl,
      onBack,
      setCanvasDims,
      setImageDims,
      imageDims,
      imageOffset,
      onNext,
      onPrev,
      onToFirst,
      onToLast,
      onQueue,
      onInstruction,
      updateClass,
      submitWorkItem,
      skipWorkItem,
      mode,
      draftedItem,
      selectedLabeledItemId,
      selectedClassId,
      voteUpLabeledItem,
      voteDownLabeledItem,
      selectedOptionIndex,
      navigateOptionUp,
      navigateOptionDown,
      toggleCurrentOption,
      selectedControl,
    ]
  );

  return (
    <ImageAnnotateContext.Provider value={contextValue}>
      {children}
    </ImageAnnotateContext.Provider>
  );
};

export const useImageAnnotate = () => useContext(ImageAnnotateContext);

export default useImageAnnotate;
