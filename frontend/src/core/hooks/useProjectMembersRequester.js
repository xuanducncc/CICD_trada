import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useProjectMembersRequester({ projectId }) {
  const dispatch = useDispatch();
  const requestedId = useSelector(
    projectsSelectors.selectProjectMemberRequestedId
  );
  const members = useSelector(projectsSelectors.selectProjectJoinMemberList);
  const labelers = useSelector(projectsSelectors.selectProjectJoinLabelersList);
  const loading = useSelector(projectsSelectors.selectProjectMemberLoading);
  const error = useSelector(projectsSelectors.selectProjectMemberError);
  const allMembers = useSelector(projectsSelectors.selectProjectMembersList);

  useEffect(() => {
    if (!projectId || requestedId === projectId) {
      return;
    }
    dispatch(projectsActions.fetchMembersProject({ projectId }));
  }, [projectId, dispatch, requestedId]);

  return {
    requestedId,
    allMembers,
    labelers,
    members,
    loading,
    error,
  };
}
