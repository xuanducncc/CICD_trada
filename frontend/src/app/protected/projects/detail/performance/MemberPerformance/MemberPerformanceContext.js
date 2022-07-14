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
import { useParams } from "react-router";
import useProjectActivitiesRequester from "@core/hooks/useProjectActivitiesRequester";

const MemberPerformanceContext = createContext({
  member: null,
  memberStats: null,
  stats: null,
  loading: null,
  overview: null,
  activities: null,
  memberPerformance: null,
  projectPerformance: null,
});
export const MemberPerformanceProvider = ({ children }) => {
  const { mid } = useParams();
  const { projectId, project } = useProjectDetail();
  const { labelers } = useProjectMembersRequester({ projectId });
  const { stats } = useProjectDataRequester({ projectId, memberId: project?.member?.id });
  const {
    memberStats,
    loading,
    overview,
    memberPerformance,
    projectPerformance,
  } = useProjectPeformanceRequester({ projectId, memberId: mid });
  const { activities } = useProjectActivitiesRequester({
    projectId,
    memberId: mid,
  });

  const member = useMemo(() => {
    return labelers.find((member) => member.id == mid);
  }, [labelers, mid]);

  const contextValue = useMemo(
    () => ({
      member,
      memberStats,
      stats,
      loading,
      overview,
      activities,
      memberPerformance,
      projectPerformance,
    }),
    [
      member,
      memberStats,
      stats,
      loading,
      overview,
      activities,
      memberPerformance,
      projectPerformance,
    ]
  );

  return (
    <MemberPerformanceContext.Provider value={contextValue}>
      {children}
    </MemberPerformanceContext.Provider>
  );
};

export function withMemberPerformanceContext(Component) {
  return function WrapperComponent(props) {
    return (
      <MemberPerformanceProvider>
        <Component {...props} />
      </MemberPerformanceProvider>
    );
  };
}

export const useMemberPerformance = () => useContext(MemberPerformanceContext);

export default useMemberPerformance;
