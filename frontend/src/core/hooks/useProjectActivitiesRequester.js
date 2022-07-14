import projects, {
  projectsActions,
  projectsSelectors,
} from "@core/redux/projects";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useProjectActivitiesRequester({
  projectId,
  memberId,
  page,
}) {
  const dispatch = useDispatch();
  const activities = useSelector(projectsSelectors.selectProjectActivitiesList);
  const currentPage = useSelector(
    projectsSelectors.selectProjectActivitiesPage
  );
  const totalPages = useSelector(
    projectsSelectors.selectProjectActivitiesTotalPages
  );
  const totalItems = useSelector(
    projectsSelectors.selectProjectActivitiesTotalItems
  );
  const loading = useSelector(projectsSelectors.selectProjectActivitiesLoading);
  const error = useSelector(projectsSelectors.selectProjectActivitiesError);

  const fetchActivities = useCallback(
    ({ page }) => {
      dispatch(
        projectsActions.fetchLogActivities({ projectId, memberId, page })
      );
    },
    [dispatch, projectId, memberId]
  );

  return {
    fetchActivities,
    currentPage,
    totalPages,
    totalItems,
    activities,
    loading,
    error,
  };
}
