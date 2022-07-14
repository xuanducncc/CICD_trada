import { datasetSelectors, datasetAction } from "@core/redux/datasets";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectDetail from "../../ProjectDetailContext";

const ProjectDetailSettingContext = createContext({
  deleteProject: null,
});

export const ProjectDetailSettingProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { projectId } = useProjectDetail();

  const deleteProject = async () => {
    await dispatch(projectsActions.deleteProject({ id: projectId }));
    await dispatch(projectsActions.fetchProjects({ listType: "ALL" }));
  };

  const contextValue = useMemo(
    () => ({
      deleteProject,
    }),
    [deleteProject]
  );

  return (
    <ProjectDetailSettingContext.Provider value={contextValue}>
      {children}
    </ProjectDetailSettingContext.Provider>
  );
};

export function withProjectDetailSettingContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailSettingProvider>
        <Component {...props} />
      </ProjectDetailSettingProvider>
    );
  };
}

export const useProjectDetailSetting = () =>
  useContext(ProjectDetailSettingContext);

export default useProjectDetailSetting;
