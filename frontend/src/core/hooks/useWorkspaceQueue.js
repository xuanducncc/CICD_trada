import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { workspaceSelectors, workspaceActions } from "@core/redux/workspace";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useWorkspaceQueue({
  id,
  projectId,
  queueId,
  workItemId,
  status,
  role,
  mode,
  page,
  label,
}) {
  const dispatch = useDispatch();
  const loading = useSelector(workspaceSelectors.selectWorkspaceLoading);
  const isReady = useSelector(workspaceSelectors.selectWorkspaceIsReady);
  const instructionItem = useSelector(projectsSelectors.selectProjectDetailInstructionItem);
  const instructionList = useSelector(projectsSelectors.selectProjectDetailInstructionList);
  const currentId = useSelector(
    workspaceSelectors.selectWorkSpaceWorkItemsSelectedId
  );
  const memberId = useSelector(
    workspaceSelectors.selectWorkSpaceWorkItemsMemberId
  );
  const currentIndex = useSelector(
    workspaceSelectors.selectWorkSpaceWorkItemsSelectedIndex
  );
  const currentQueueItem = useSelector(
    workspaceSelectors.selectWorkSpaceWorkItemsSelectedItem
  );
  const error = useSelector(workspaceSelectors.selectWorkspaceError);
  const isEmpty = useSelector(
    workspaceSelectors.selectWorkSpaceWorkItemsIsEmpty
  );
  const isFinished = useSelector(
    workspaceSelectors.selectWorkspaceDataIsFinished
  );
  const isFinishedQueue = useSelector(
    workspaceSelectors.selectWorkspaceConfigIsFinished
  );
  const queueItems = useSelector(
    workspaceSelectors.selectWorkSpaceWorkItemsAll
  );

  const requestQueue = useCallback(
    ({ memberId, projectId }) => {
      return dispatch(workspaceActions.requestQueue({ memberId, projectId }));
    },
    [dispatch]
  );

  const requestQueueReview = useCallback(
    ({ memberId, projectId }) => {
      return dispatch(workspaceActions.requestQueueReview({ memberId, projectId }));
    },
    [dispatch]
  );

  const clearWorkspace = useCallback(() => {
    dispatch(workspaceActions.clearWorkspace());
    dispatch(workspaceActions.resetWorkspaceData());
    dispatch(workspaceActions.resetWorkspaceConfig());
  }, [dispatch]);

  const nextQueueItem = useCallback(() => {
    dispatch(workspaceActions.nextQueueItem());
  }, [dispatch]);

  const backQueueItem = useCallback(() => {
    dispatch(workspaceActions.backQueueItem());
  }, [dispatch]);

  const setCurrentId = useCallback(
    (id) => {
      dispatch(workspaceActions.selectItemById({ id }));
    },
    [dispatch]
  );

  useEffect(() => {
    if ((projectId || queueId) && loading === "idle") {
      dispatch(
        workspaceActions.initWorkspace({
          projectId,
          queueId,
          workItemId,
          status,
          role,
          mode,
          page,
          label,
          id,
        })
      );
    }
  }, [dispatch, loading, projectId, queueId, status, role, mode, page, label, id]);

  const loadInstructions = useCallback(() => {
    if (instructionList.length > 0 && !instructionItem) {
      dispatch(projectsActions.fetchItemInstruction(instructionList[0].id));
    }
  }, [dispatch, instructionList, instructionItem])

  return {
    error,
    isEmpty,
    isFinished,
    isFinishedQueue,
    loading,
    isReady,
    queueItems,
    currentId,
    memberId,
    currentIndex,
    currentQueueItem,
    clearWorkspace,
    requestQueue,
    requestQueueReview,
    setCurrentId,
    backQueueItem,
    nextQueueItem,
    loadInstructions,
  };
}
