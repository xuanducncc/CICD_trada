import React, {
  createContext,
  useContext,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import useWorkItemRequester from "@core/hooks/useWorkItemRequester";
import usePreviewQueue from "../PreviewQueueContext";


const PreviewEditorContext = createContext({
  editor: null,
  editorData: null,
  loading: null,
  error: null,
  acceptWorkItem: null,
  rejectWorkItem: null,
});

export const PreviewEditorProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentId } = usePreviewQueue();

  const {
    loading,
    error,
    editor,
    editorData,
    acceptWorkItem,
    rejectWorkItem,
  } = useWorkItemRequester({
    id: currentId,
  });

  const contextValue = useMemo(
    () => ({
      editor,
      loading,
      error,
      editorData,
      acceptWorkItem,
      rejectWorkItem,
    }),
    [
      editor,
      loading,
      error,
      editorData,
      acceptWorkItem,
      rejectWorkItem,
    ]
  );

  return (
    <PreviewEditorContext.Provider value={contextValue}>
      {children}
    </PreviewEditorContext.Provider>
  );
};

export function withPreviewEditorContext(Component) {
  return function WrapperComponent(props) {
    return (
      <PreviewEditorProvider>
        <Component {...props} />
      </PreviewEditorProvider>
    );
  };
}

export const usePreviewEditor = () => useContext(PreviewEditorContext);

export default usePreviewEditor;
