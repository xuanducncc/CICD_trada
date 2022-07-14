import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";

export default function useProjectEditorRequester({ projectId }) {
  const dispatch = useDispatch();
  const requestedId = useSelector(
    projectsSelectors.selectProjectEditorRequestedId
  );
  const editor = useSelector(projectsSelectors.selectProjectEditorDetail);
  const error = useSelector(projectsSelectors.selectProjectEditorError);
  const loading = useSelector(projectsSelectors.selectProjectEditorLoading);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    if (requestedId === projectId) {
      return;
    }

    dispatch(
      projectsActions.requestEditorProjectId({ projectId })
    );
  }, [requestedId, projectId, dispatch]);

  return {
    editor,
    projectId,
    requestedId,
    error,
    loading,
  };
}
