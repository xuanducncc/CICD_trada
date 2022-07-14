import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  projectsActions,
  projectsSelectors,
} from "@core/redux/projects";
import { workspaceSelectors, workspaceActions } from "@core/redux/workspace";
import useWorkItemRequester from "@core/hooks/useWorkItemRequester";
import useValidationItemQueue from "../../ValidationItemQueueContext";


const ValidationEditorContext = createContext({
  editor: null,
  editorData: null,
  loading: null,
  error: null,
  acceptWorkItem: null,
  rejectWorkItem: null,
});

export const ValidationEditorProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentId } = useValidationItemQueue();

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
    <ValidationEditorContext.Provider value={contextValue}>
      {children}
    </ValidationEditorContext.Provider>
  );
};

export function withValidationEditorContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ValidationEditorProvider>
        <Component {...props} />
      </ValidationEditorProvider>
    );
  };
}

export const useValidationEditor = () => useContext(ValidationEditorContext);

export default useValidationEditor;
