import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import { useAppConfig } from "../../../../components/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  projectsActions,
  projectsSelectors,
} from "../../../../core/redux/projects";
import { workspaceSelectors, workspaceActions } from "@core/redux/workspace";
import useWorkItemRequester from "../../../../core/hooks/useWorkItemRequester";
import useWorkspace from "./WorkspaceContext";

const EditorContext = createContext({
  editor: null,
  editorData: null,
  loading: null,
  error: null,
  workItemDetail: null,
  submitWorkItem: null,
  skipWorkItem: null,
  updateWorkItem: null,
});

export const EditorProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentId } = useWorkspace();

  const {
    loading,
    error,
    editor,
    editorData,
    submitWorkItem,
    skipWorkItem,
    updateWorkItem,
  } = useWorkItemRequester({
    id: currentId,
  });

  const contextValue = useMemo(
    () => ({
      editor,
      loading,
      error,
      editorData,
      submitWorkItem,
      skipWorkItem,
      updateWorkItem,
    }),
    [
      editor,
      loading,
      error,
      editorData,
      submitWorkItem,
      skipWorkItem,
      updateWorkItem,
    ]
  );

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export function withEditorContext(Component) {
  return function WrapperComponent(props) {
    return (
      <EditorProvider>
        <Component {...props} />
      </EditorProvider>
    );
  };
}

export const useEditor = () => useContext(EditorContext);

export default useEditor;
