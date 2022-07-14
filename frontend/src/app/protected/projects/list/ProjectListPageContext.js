import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { useAppConfig } from "../../../../components/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  projectsActions,
  projectsSelectors,
} from "../../../../core/redux/projects";
import useProjectsListRequester from "@core/hooks/useProjectsListRequester";
import { PROJECT_LIST_TYPES } from "@utils/const";

const ProjectsListContext = createContext({
  projects: null,
  error: null,
  loading: null,
  options: null,
});

export const ProjectsListProvider = ({ children }) => {
  const { appConfig, fromConfig } = useAppConfig();

  const { projects, error, loading, options } = useProjectsListRequester({
    projectsSelector: projectsSelectors.selectAll,
    defaultOptions: { listType: PROJECT_LIST_TYPES.ALL },
  });

  const contextValue = useMemo(
    () => ({
      projects,
      error,
      loading,
      options,
    }),
    [projects, error, loading, options]
  );

  return (
    <ProjectsListContext.Provider value={contextValue}>
      {children}
    </ProjectsListContext.Provider>
  );
};

export const useProjectsList = () => useContext(ProjectsListContext);

export default useProjectsList;
