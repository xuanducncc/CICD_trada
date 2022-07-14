import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CLASSIFICATION_CONTROLS,
  DETECTION_CONTROLS,
  IMAGE_ANNOTATION_TYPE,
} from "@utils/const";
import { uuid } from "@utils/uuid";
import { intToColor } from "@utils/color";
import { snakeCase } from "@utils/string";

const ImageEditorToolConfigurationContext = createContext({
  tools: null,
  error: null,
  setTools: null,
  activatedTool: null,
  setActivatedTool: null,
  detectionTools: null,
  classificationTools: null,
  addNewTool: null,
  selectTool: null,
  deleteTool: null,
  submit: null,
  preview: null,
  addClassificationTool: null,
  addDetectionTool: null,
  formRef: null,
});

const normalizeEditorTools = (tools = []) => {
  return tools.map((tool) => {
    const labels =
      tool.labels && tool.labels.length > 0
        ? tool.labels.map((lab) => ({
            name: lab.name,
            color: tool.color,
            code: snakeCase(lab.name),
          }))
        : [
            {
              name: tool.name,
              color: tool.color,
              code: snakeCase(tool.name),
            },
          ];
    const normalizedTool = {
      id: tool.id,
      name: tool.name,
      required: tool.required,
      type: tool.type,
      description: tool.description,
      controls: [
        {
          type: tool.control,
          name: tool.control,
        },
      ],
      labels: labels,
    };
    return normalizedTool;
  });
};

const normalizeEditor = ({ tools: rawTools }) => {
  const tools = normalizeEditorTools(rawTools);
  return {
    type: "image",
    tools,
  };
};

export const ImageEditorToolConfigurationProvider = ({
  children,
  editor,
  onSubmit,
  onDismiss,
  onPreview,
}) => {
  const [tools, setTools] = useState([]);
  const [error, setError] = useState(null);
  const formRef = React.createRef();
  const [activatedTool, setActivatedTool] = useState(null);

  const detectionTools = useMemo(() => {
    return (tools || []).filter(
      (tool) => tool.type === IMAGE_ANNOTATION_TYPE.DETECTION
    );
  }, [tools]);

  const classificationTools = useMemo(() => {
    return (tools || []).filter(
      (tool) => tool.type === IMAGE_ANNOTATION_TYPE.CLASSIFICATION
    );
  }, [tools]);

  const addNewTool = useCallback(
    (newTool) => {
      if (!newTool.color && !newTool.description) {
        newTool.color = intToColor(tools.length);
        newTool.description = "";
      }
      setTools([...tools, newTool]);
      setError(null);
    },
    [setTools, setError, tools]
  );

  const selectTool = useCallback(
    (tooId) => {
      const tool = tools.find((t) => t.id === tooId);
      setActivatedTool(tool);
    },
    [setActivatedTool, tools]
  );

  const deleteTool = useCallback(
    (id) => {
      const newTools = tools.filter((t) => t.id !== id);
      setTools(newTools);
    },
    [setTools, tools]
  );

  const updateTool = useCallback(
    (tool) => {
      const index = tools.findIndex((t) => t.id === tool.id);
      tools[index] = tool;
      setTools([...tools]);
    },
    [setTools, tools]
  );
  const addClassificationTool = useCallback(() => {
    const newTool = {
      id: uuid(),
      control: CLASSIFICATION_CONTROLS.DROPDOWN,
      type: IMAGE_ANNOTATION_TYPE.CLASSIFICATION,
      name: "",
      required: false,
      labels: [],
      controls: [],
      color: null,
    };
    addNewTool(newTool);
    setActivatedTool(newTool);
  }, [addNewTool, setActivatedTool]);

  const addDetectionTool = useCallback(() => {
    const newTool = {
      id: uuid(),
      control: DETECTION_CONTROLS.BOUNDING_BOX,
      type: IMAGE_ANNOTATION_TYPE.DETECTION,
      required: false,
      name: "",
      labels: [],
      controls: [],
      color: null,
    };
    addNewTool(newTool);
    setActivatedTool(newTool);
  }, [addNewTool]);

  const submit = useCallback(() => {
    const data = normalizeEditor({ tools });
    if (data.length === 0) {
      setError({
        message: "Tools cannot be empty.",
      });
      return;
    }
    onSubmit(data);
  }, [tools, onSubmit, formRef.current]);

  const preview = useCallback(() => {
    const data = normalizeEditor({ tools });
    onPreview(data);
  }, [tools, onPreview]);

  const dismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  const contextValue = useMemo(
    () => ({
      tools,
      error,
      setTools,
      activatedTool,
      setActivatedTool,
      detectionTools,
      classificationTools,
      addNewTool,
      selectTool,
      deleteTool,
      addClassificationTool,
      addDetectionTool,
      updateTool,
      submit,
      dismiss,
      preview,
      formRef,
    }),
    [
      tools,
      error,
      setTools,
      activatedTool,
      setActivatedTool,
      detectionTools,
      classificationTools,
      addNewTool,
      selectTool,
      deleteTool,
      addClassificationTool,
      addDetectionTool,
      updateTool,
      submit,
      dismiss,
      preview,
      formRef,
    ]
  );

  useEffect(() => {
    const newRawTools =
      editor?.tools?.map((tool) => {
        const labels =
          tool.labels && tool.labels.length > 0
            ? tool.labels.map((lab) => ({
                name: lab.name,
                color: lab.color,
                code: snakeCase(lab.name),
              }))
            : [
                {
                  name: tool.name,
                  color: tool.color,
                  code: snakeCase(tool.name),
                },
              ];
        const normalizedTool = {
          id: tool.id,
          name: tool.name,
          type: tool.type,
          description: tool.description,
          control: tool.controls[0].name,
          controls: tool.controls,
          labels: labels,
          color: tool.labels[0].color,
        };
        return normalizedTool;
      }) ?? [];
    setTools(newRawTools);
  }, [editor, setTools]);

  return (
    <ImageEditorToolConfigurationContext.Provider value={contextValue}>
      {children}
    </ImageEditorToolConfigurationContext.Provider>
  );
};

export const useImageEditorToolConfiguration = () =>
  useContext(ImageEditorToolConfigurationContext);

export default useImageEditorToolConfiguration;
