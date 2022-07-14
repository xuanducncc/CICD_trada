import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useProjectDetail from "../../ProjectDetailContext";
import useProjectPeformanceRequester from "@core/hooks/useProjectPerformanceRequester";
import useProjectMembersRequester from "@core/hooks/useProjectMembersRequester";
import useProjectDataRequester from "@core/hooks/useProjectDataRequester";
import useAuthUser from "@core/auth/useAuthUser";
import { PROJECT_MEMBER_ROLES } from "@utils/const";

const ProjectPerformanceContext = createContext({
  members: null,
  memberStats: null,
  stats: null,
  statsList: null,
  memberLoading: null,
  memberError: null,
  dataLoading: null,
  dataError: null,
  statLoading: null,
  statError: null,
  history: null,
  isAdminOrProjectAdmin: null,
  project: null,
});

export const ProjectPerformanceProvider = ({ children }) => {
  const { projectId, project } = useProjectDetail();
  const {
    labelers,
    loading: memberLoading,
    error: memberError,
  } = useProjectMembersRequester({ projectId });
  const {
    stats,
    statsList,
    loading: dataLoading,
    error: dataError,
    history,
  } = useProjectDataRequester({ projectId, memberId: project?.member?.id });
  const {
    memberStats,
    loading: statLoading,
    error: statError,
  } = useProjectPeformanceRequester({ projectId });
  const { user, isAdmin } = useAuthUser();

  const isAdminOrProjectAdmin = useMemo(() => {
    return (
      isAdmin ||
      project?.member?.role?.find(
        (rol) => rol?.name === PROJECT_MEMBER_ROLES.ADMIN
      )
    );
  }, [project, isAdmin]);

  const contextValue = useMemo(
    () => ({
      labelers,
      memberStats,
      stats,
      statsList,
      memberLoading,
      memberError,
      dataLoading,
      dataError,
      statLoading,
      statError,
      history,
      isAdminOrProjectAdmin,
      project,
    }),
    [
      labelers,
      memberStats,
      stats,
      statsList,
      memberLoading,
      memberError,
      dataLoading,
      dataError,
      statLoading,
      statError,
      history,
      isAdminOrProjectAdmin,
      project,
    ]
  );

  return (
    <ProjectPerformanceContext.Provider value={contextValue}>
      {children}
    </ProjectPerformanceContext.Provider>
  );
};

export function withProjectPerformanceContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectPerformanceProvider>
        <Component {...props} />
      </ProjectPerformanceProvider>
    );
  };
}

export const useProjectPerformance = () =>
  useContext(ProjectPerformanceContext);

export default useProjectPerformance;
