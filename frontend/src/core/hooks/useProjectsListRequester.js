import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersSelector, usersAction } from "@core/redux/users";
import { projectsSelectors, projectsActions } from "@core/redux/projects";
import { PROJECT_LIST_TYPES } from "@utils/const";

export default function useProjectsListRequester({
  projectsSelector,
  defaultOptions,
} = {}) {
  const dispatch = useDispatch();
  const projects = useSelector(projectsSelector || projectsSelectors.selectAll);
  const error = useSelector(projectsSelectors.selectProjectsError);
  const loading = useSelector(projectsSelectors.selectProjectsLoading);
  const options = useSelector(projectsSelectors.selectProjectListOption);

  const updateOptions = useCallback(
    (opts) => {
      if (opts !== options) {
        dispatch(projectsActions.syncProjectsOptions(opts));
      }
    },
    [options, dispatch]
  );

  useEffect(() => {
    if (projectsSelector && loading === "idle") {
      updateOptions(defaultOptions);
    }
  }, [defaultOptions, projectsSelector, loading]);

  return {
    projects,
    error,
    loading,
    options,
    updateOptions,
  };
}
