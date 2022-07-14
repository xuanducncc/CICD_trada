import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

export default function useProjectRequester({ projectId }) {
  const dispatch = useDispatch();
  const requestedId = useSelector(
    projectsSelectors.selectProjectDetailRequestedId
  );
  const project = useSelector(projectsSelectors.selectProjectDetailProject);
  const error = useSelector(projectsSelectors.selectProjectDetailError);
  const loading = useSelector(projectsSelectors.selectProjectDetailLoading);
  const labelAvailable = useSelector(projectsSelectors.selectProjectDetailLabelAvailable);
  const validateAvailable = useSelector(projectsSelectors.selectProjectDetailValidateAvailable);
  const reviewAvailable = useSelector(projectsSelectors.selectProjectDetailReviewAvailable);
  const queueReviewId = useSelector(projectsSelectors.selectProjectDetailQueueReviewId);
  const queueLabelId = useSelector(projectsSelectors.selectProjectDetailQueueLabelId);

  const memberId = useMemo(() => {
    return project?.member?.id ?? null;
  }, [project]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    if (requestedId === projectId) {
      return;
    }

    const promise = dispatch(
      projectsActions.requestProjectId({ id: projectId })
    );
    // return () => {
    //   promise.abort()
    // }
  }, [requestedId, projectId, dispatch, project]);

  return {
    project,
    memberId,
    projectId,
    requestedId,
    error,
    loading,
    labelAvailable,
    reviewAvailable,
    validateAvailable,
    queueReviewId,
    queueLabelId
  };
}
