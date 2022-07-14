import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import useSketchBoard from "./SketchBoardContext";

const ImageAnnotationContext = createContext({
  isSelected: null,
  editable: null,
  shapeProps: null,
  labelName: null,
  color: null,
  onSelect: null,
  onChange: null,
  toolName: null,
  labelCode: null,
});

export const ImageAnnotationProvider = ({ children, shape }) => {
  const { selectedShapeId, selectShape, updateShape, mode, toolsMap } =
    useSketchBoard();
  const editable = mode === "annotate";

  const onSelect = useCallback(() => {
    selectShape(shape.clientId);
  }, [shape]);

  const onChange = useCallback(
    (newShapeProps) => {
      updateShape({
        ...shape,
        labelValue: newShapeProps,
        updated: {
          labelValue: true,
        },
      });
    },
    [shape]
  );

  const shapeProps = useMemo(() => (shape ? shape.labelValue : null), [shape]);

  const { labelName, color, tool_id, labelCode } = shape;

  const tool = toolsMap[tool_id];
  const { name: toolName } = tool;

  const isSelected = useMemo(
    () => (shape ? shape.clientId === selectedShapeId : false),
    [selectedShapeId, shape]
  );

  const contextValue = useMemo(
    () => ({
      isSelected,
      editable,
      shapeProps,
      labelName,
      color,
      toolName,
      labelCode,
      onSelect,
      onChange,
    }),
    [
      isSelected,
      editable,
      shapeProps,
      labelName,
      color,
      toolName,
      labelCode,
      onSelect,
      onChange,
    ]
  );

  return (
    <ImageAnnotationContext.Provider value={contextValue}>
      {children}
    </ImageAnnotationContext.Provider>
  );
};

export const useImageAnnotation = () => useContext(ImageAnnotationContext);

export default useImageAnnotation;
