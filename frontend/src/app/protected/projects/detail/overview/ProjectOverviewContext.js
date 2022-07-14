import useProjectDataRequester from "@core/hooks/useProjectDataRequester";
import { datasetSelectors, datasetAction } from "@core/redux/datasets";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectDetail from "../ProjectDetailContext";


const ProjectDetailOverviewContext = createContext({
  overview: null,
  loading: null,
  error: null,
  stats: null,
  project: null,
});

export const ProjectDetailOverviewProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { projectId, project } = useProjectDetail();

  const { overview, loading, error, stats } = useProjectDataRequester({ projectId, memberId: project?.member?.id });


  const contextValue = useMemo(
    () => ({
      overview,
      loading,
      error,
      stats,
      project,
    }),
    [overview, loading, error, stats, project]
  );

  return (
    <ProjectDetailOverviewContext.Provider value={contextValue}>
      {children}
    </ProjectDetailOverviewContext.Provider>
  );
};

export function withProjectDetailOverviewContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailOverviewProvider>
        <Component {...props} />
      </ProjectDetailOverviewProvider>
    );
  };
}

export const useProjectDetailOverview = () =>
  useContext(ProjectDetailOverviewContext);

export default useProjectDetailOverview;
