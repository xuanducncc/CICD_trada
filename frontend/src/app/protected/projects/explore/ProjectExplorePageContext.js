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

const ProjectExplorePageContext = createContext({
  projects: null,
  error: null,
  loading: null,
  options: null,
});

export const ProjectExploreListListProvider = ({ children }) => {
  const { appConfig, fromConfig } = useAppConfig();

  const { projects, error, loading, options } = useProjectsListRequester({
    projectsSelector: projectsSelectors.selectAll,
    defaultOptions: { listType: PROJECT_LIST_TYPES.AVAILABLE },
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
    <ProjectExplorePageContext.Provider value={contextValue}>
      {children}
    </ProjectExplorePageContext.Provider>
  );
};

export const useProjectExplorePage = () => useContext(ProjectExplorePageContext);

export default useProjectExplorePage;
