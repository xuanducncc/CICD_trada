import useProtected from "@components/Protected/ProtectedContext";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

export default function useProjectDataRequester({ projectId, memberId }) {
  const dispatch = useDispatch();
  const requestedId = useSelector(
    projectsSelectors.selectProjectDataRequestedId
  );
  const { isAdmin } = useProtected();
  const overview = useSelector(projectsSelectors.selectProjectDataOverview);
  const error = useSelector(projectsSelectors.selectProjectDataError);
  const loading = useSelector(projectsSelectors.selectProjectDataLoading);
  const stats = useSelector(projectsSelectors.selectProjectDataStats(memberId));
  const statsList = useSelector(projectsSelectors.selectProjectDataStatList);
  const members = useSelector(projectsSelectors.selectProjectDetailMembers);
  const history = useSelector(projectsSelectors.selectProjectDataProjectLabeledHistory);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    if (requestedId === projectId) {
      return;
    }
    if (isAdmin === false) {
      dispatch(projectsActions.fetchProjectOverview({ projectId, id: memberId }));
      dispatch(projectsActions.fetchLogLabeledItem({ projectId, id: memberId }));
      dispatch(projectsActions.resetProjectDataListStat());
    } else {
      dispatch(projectsActions.fetchProjectOverview({ projectId }));
      dispatch(projectsActions.fetchLogLabeledItem({ projectId }));
      dispatch(projectsActions.resetProjectDataListStat());
    }
    dispatch(projectsActions.fetchProjectLabeledHistory({ projectId }));
  }, [requestedId, projectId, dispatch, memberId]);

  return {
    overview,
    projectId,
    requestedId,
    error,
    loading,
    stats,
    statsList,
    history
  };
}
