import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import { useHistory } from "react-router-dom";
import { useAppConfig } from "../../../../components/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  projectsActions,
  projectsSelectors,
} from "../../../../core/redux/projects";
import { createProjectEditor } from "@core/redux/projects/projectEditor";

const ProjectCreationContext = createContext({
  createdProjectId: null,
  projectMutation: null,
  setProjectInfo: null,
  setCurrentStep: null,
  setProjectEditor: null,
  setProjectSettings: null,
  currentStep: null,
  totalStep: null,
  setProjectEditorPreview: null,
  exitCreateProject: null
});

export const ProjectCreationProvider = ({ children }) => {
  const history = useHistory();
  const { appConfig, fromConfig } = useAppConfig();

  const projectMutation = useSelector(projectsSelectors.selectProjectMutation)

  const { createdId: createdProjectId, currentStep, totalStep } = projectMutation;


  const dispatch = useDispatch();

  const setCurrentStep = useCallback((step) => {
    dispatch(projectsActions.requestSetCurrentMutationStep(step));
  }, [dispatch])

  const setProjectInfo = useCallback((info) => {
    dispatch(projectsActions.setProjectMutationInfo(info));
  }, [dispatch]);

  const setProjectEditor = useCallback((editor) => {
    dispatch(projectsActions.setProjectMutationEditor(editor));
  }, [dispatch]);

  const setProjectSettings = useCallback((settings) => {
    dispatch(projectsActions.setProjectMutationSettings(settings));
  }, [dispatch]);

  const setProjectEditorPreview = useCallback((settings) => {
    dispatch(projectsActions.setProjectMutationPreview(settings));
  }, [dispatch]);

  const exitCreateProject = async () => {
    history.push('/i/f/projects');
    dispatch(projectsActions.resetAllStatus())
  }

  const contextValue = useMemo(
    () => ({
      createdProjectId,
      projectMutation,
      currentStep,
      totalStep,
      setCurrentStep,
      setProjectInfo,
      setProjectEditor,
      setProjectSettings,
      setProjectEditorPreview,
      exitCreateProject
    }),
    [
      createdProjectId,
      projectMutation,
      currentStep,
      totalStep,
      setCurrentStep,
      setProjectInfo,
      setProjectEditor,
      setProjectSettings,
      setProjectEditorPreview,
      exitCreateProject
    ]
  );

  return (
    <ProjectCreationContext.Provider value={contextValue}>
      {children}
    </ProjectCreationContext.Provider>
  );
};

export function withProjectCreationContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectCreationProvider>
        <Component {...props} />
      </ProjectCreationProvider>
    );
  };
}

export const useProjectCreation = () => useContext(ProjectCreationContext);

export default useProjectCreation;
