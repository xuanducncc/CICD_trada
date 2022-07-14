import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useProjectPeformanceRequester({ projectId, memberId }) {
  const dispatch = useDispatch();

  const error = useSelector(projectsSelectors.selectProjectDataError);
  const loading = useSelector(projectsSelectors.selectProjectDataLoading);
  const stats = useSelector(projectsSelectors.selectProjectDataStats);
  const overview = useSelector(projectsSelectors.selectProjectDataOverview);
  const projectPerformance = useSelector(
    projectsSelectors.selectProjectDataProjectPerformance
  );
  const memberPerformance = useSelector(
    projectsSelectors.selectProjectDataMemberPerformance
  );

  const memberStats = useSelector(
    projectsSelectors.selectProjectDataMemberStatsById(memberId)
  );
  // TODO : create requested id for memberStat be called
  useEffect(() => {
    if (!projectId || !memberId) {
      return;
    }
    dispatch(projectsActions.fetchProjectOverview({ projectId, id: memberId }));
    dispatch(projectsActions.fetchLogLabeledItem({ projectId, id: memberId }));
    dispatch(projectsActions.fetchProjectPerformance({ projectId }));
    dispatch(projectsActions.fetchMemberPerformance({ memberId }));
  }, [projectId, dispatch, memberId]);

  return {
    projectId,
    error,
    loading,
    stats,
    memberStats,
    overview,
    projectPerformance,
    memberPerformance,
  };
}
