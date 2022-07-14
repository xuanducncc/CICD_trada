import useProjectEditorRequester from "@core/hooks/useProjectEditorRequester";
import { datasetSelectors, datasetAction } from "@core/redux/datasets";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import React, { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import useProjectDetail from "../../../ProjectDetailContext";


const ProjectDetailSettingEditorContext = createContext({
  editor: null,
  setProjectEditor: null,
  setProjectDetailPreview: null
});
export const ProjectDetailSettingEditorProvider = ({ children }) => {
  const { projectId } = useProjectDetail()
  const dispatch = useDispatch();
  const { editor } = useProjectEditorRequester({ projectId })

  const setProjectEditor = useCallback((editorItem) => {
    dispatch(projectsActions.setUpdateProjectEditor(editorItem));
    dispatch(projectsActions.createProjectEditor({ ...editorItem, project_id: projectId }));
  }, [dispatch, editor]);

  const setProjectDetailPreview = useCallback((settings) => {
    dispatch(projectsActions.setProjectDetailPreview(settings));
  }, [dispatch])

  const contextValue = useMemo(
    () => ({
      editor,
      setProjectEditor,
      setProjectDetailPreview
    }),
    [editor, setProjectEditor, setProjectDetailPreview]
  );

  return (
    <ProjectDetailSettingEditorContext.Provider value={contextValue}>
      {children}
    </ProjectDetailSettingEditorContext.Provider>
  );
};

export function withProjectDetailSettingEditorContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailSettingEditorProvider>
        <Component {...props} />
      </ProjectDetailSettingEditorProvider>
    );
  };
}

export const useProjectDetailSettingEditor = () => useContext(ProjectDetailSettingEditorContext);

export default useProjectDetailSettingEditor;
