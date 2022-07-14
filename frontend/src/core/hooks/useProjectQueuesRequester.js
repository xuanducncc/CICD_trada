import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProtected from "@components/Protected/ProtectedContext";

export default function useProjectQueuesRequester({
  projectId,
  memberId,
  queueId,
}) {
  const dispatch = useDispatch();
  const queues = useSelector(projectsSelectors.selectProjectQueueList);
  const loading = useSelector(projectsSelectors.selectProjectQueueLoading);
  const error = useSelector(projectsSelectors.selectProjectQueueError);
  const currentStatus = useSelector(projectsSelectors.selectProjectQueueStatus);
  const currentPage = useSelector(projectsSelectors.selectProjectQueuePage);
  const totalPages = useSelector(
    projectsSelectors.selectProjectQueueTotalPages
  );
  const totalItems = useSelector(
    projectsSelectors.selectProjectQueueTotalItems
  );
  const currentId = useSelector(projectsSelectors.selectProjectQueueSelectedId);

  const updateParams = useCallback(
    ({ page, status, label }) => {
      dispatch(
        projectsActions.fetchProjectQueue({
          memberId,
          projectId,
          queueId,
          page,
          status,
          label,
        })
      );
    },
    [memberId, projectId, queueId]
  );

  return {
    queues,
    loading,
    error,
    currentId,
    currentPage,
    currentStatus,
    totalPages,
    totalItems,
    updateParams,
  };
}
