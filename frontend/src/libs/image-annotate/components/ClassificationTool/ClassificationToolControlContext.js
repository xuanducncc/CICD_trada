import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import { IMAGE_ANNOTATION_TYPE } from "@utils/const";

export const ClassificationToolControlContext = createContext({
  updateClass: null,
  labels: null,
  controls: null,
  control: null,
  valueId: null,
  classValue: null,
  name: null,
  selectClass: null,
  labeledValue: null,
  setLabeledValue: null,
  selectClassForTextField: null,
  description: null,
  isActive: null,
  disabled: null,
  myVoteScore: null,
  countVoteUp: null,
  countVoteDown: null,
  handleVoteUpClass: null,
  handleVoteDownClass: null,
});

export const ClassificationToolControlProvider = ({ children, tool }) => {
  const {
    classesMap,
    updateClass,
    draftedItem,
    selectedClassId,
    selectedOptionIndex,
    voteDownLabeledItem,
    voteUpLabeledItem,
    mode,
  } = useImageAnnotate();
  const { labels, controls, description, name } = tool;
  const [labeledValue, setLabeledValue] = useState([]);
  const [control] = controls;

  const classValue = useMemo(() => {
    return classesMap[tool.id];
  }, [tool, classesMap]);

  const valueId = classValue ? classValue.label_id : null;

  const isActive = classValue && selectedClassId === classValue.clientId;

  const disabled = mode !== "annotate";

  const selectClass = useCallback(
    (value, checkStatus) => {
      const label = labels.find((lab) => lab.id === value);

      updateClass({
        toolType: tool.type,
        controlType: control.type,
        drafted: true,
        id: null,
        clientId: null,
        labelValue: label.code,
        LabelName: label.name,
        labelCode: label.code,
        label_id: label.id,
        tool_id: tool.id,
      });
    },
    [updateClass, labels, control, draftedItem]
  );

  // Select classes for multiselect
  const selectClasses = useCallback(
    (value) => {
      const label = labels.find((lab) => lab.id === value[value.length - 1]);

      // New value for checklist need to be an array
      let newValue = labels.map((lb) => ({
        value: lb.name,
        checked:
          value.findIndex((oneValue) => lb.id === oneValue) === -1
            ? false
            : true,
        label_id: lb.id,
      }));

      updateClass({
        toolType: tool.type,
        controlType: control.type,
        drafted: true,
        id: null,
        clientId: null,
        labelValue: newValue,
        LabelName: label?.name || null,
        labelCode: label?.code || null,
        label_id: label?.id || null,
        tool_id: tool.id,
      });
    },
    [selectClass, updateClass, labels, control, draftedItem]
  );

  const selectClassForTextField = useCallback(
    (values) => {
      const label = labels.find((lab) => lab.id === values[values.length - 1]);

      updateClass({
        toolType: tool.type,
        controlType: control.type,
        drafted: true,
        id: null,
        clientId: null,
        labelValue: values || [],
        LabelName: label?.name || null,
        labelCode: label?.code || null,
        label_id: label?.id || null,
        tool_id: tool.id,
      });
    },
    [draftedItem, control, labels]
  );

  const handleTextDelete = (value) => {
    const label = labels.find((lab) => lab.id === value);
  };

  const handleVoteUpClass = useCallback(() => {
    voteUpLabeledItem(classValue);
  }, [classValue, voteUpLabeledItem]);

  const handleVoteDownClass = useCallback(() => {
    voteDownLabeledItem(classValue);
  }, [classValue, voteDownLabeledItem]);

  const myVoteScore = useMemo(() => {
    return classValue?.myVote?.score ?? 0;
  }, [classValue]);

  const countVoteUp = useMemo(() => {
    return classValue?.vote?.filter((item) => item.score === 1)?.length || 0;
  }, [classValue]);

  const countVoteDown = useMemo(() => {
    return classValue?.vote?.filter((item) => item.score === -1)?.length || 0;
  }, [classValue]);

  const contextValue = useMemo(
    () => ({
      updateClass,
      selectClass,
      selectClasses,
      labels,
      controls,
      control,
      valueId,
      classValue,
      name,
      isActive,
      labeledValue,
      description,
      disabled,
      myVoteScore,
      countVoteUp,
      countVoteDown,
      selectedOptionIndex,
      setLabeledValue,
      selectClassForTextField,
      handleVoteUpClass,
      handleVoteDownClass,
    }),
    [
      name,
      labels,
      control,
      controls,
      isActive,
      valueId,
      classValue,
      updateClass,
      description,
      labeledValue,
      disabled,
      myVoteScore,
      countVoteUp,
      countVoteDown,
      selectedOptionIndex,
      selectClasses,
      selectClass,
      setLabeledValue,
      selectClassForTextField,
      handleVoteUpClass,
      handleVoteDownClass,
    ]
  );

  return (
    <ClassificationToolControlContext.Provider value={contextValue}>
      {children}
    </ClassificationToolControlContext.Provider>
  );
};

export function withClassificationToolControlContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ClassificationToolControlProvider>
        <Component {...props} />
      </ClassificationToolControlProvider>
    );
  };
}

export const useClassificationToolControl = () =>
  useContext(ClassificationToolControlContext);

export default useClassificationToolControl;
