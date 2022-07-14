import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

export default function useWorkItemsRequester({ projectId }) {
  const dispatch = useDispatch();
  const requestedId = useSelector(
    projectsSelectors.selectProjectDetailRequestedId
  );
  const project = useSelector(projectsSelectors.selectProjectDetailProject);
  const error = useSelector(projectsSelectors.selectProjectDetailError);
  const loading = useSelector(projectsSelectors.selectProjectDetailLoading);

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
  }, [requestedId, projectId, dispatch]);

  return {
    project,
    projectId,
    requestedId,
    error,
    loading,
  };
}
