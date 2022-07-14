import { projectsActions, projectsSelectors } from "@core/redux/projects";
import React, { createContext, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useProjectCreation from "../../ProjectCreationContext";

const FinishProjectContext = createContext({
  finishProject: null,
  loading: null,
  goToProject: null,
  error: null
});
export const FinishProjectProvider = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { createdProjectId } = useProjectCreation();
  const loading = useSelector(projectsSelectors.selectProjectMutationLoading);
  const error = useSelector(projectsSelectors.selectProjectMutationError);

  const finishProject = async () => {
    const result = await dispatch(projectsActions.createProjectFinish({ id: createdProjectId }));
  };

  const goToProject = async () => {
    dispatch(projectsActions.resetAllStatus())
    history.push(`/i/projects/${createdProjectId}`);
  }
  const contextValue = useMemo(
    () => ({
      finishProject,
      loading,
      goToProject,
      error,
    }),
    [finishProject, loading, error, goToProject]
  );
  return (
    <FinishProjectContext.Provider value={contextValue}>
      {children}
    </FinishProjectContext.Provider>
  );
};

export function withFinishProjectContext(Component) {
  return function WrapperComponent(props) {
    return (
      <FinishProjectProvider>
        <Component {...props} />
      </FinishProjectProvider>
    );
  };
}

export const useFinishProject = () => useContext(FinishProjectContext);

export default useFinishProject;
