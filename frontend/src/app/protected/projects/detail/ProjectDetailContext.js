import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import { useAppConfig } from "../../../../components/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  projectsActions,
  projectsSelectors,
} from "../../../../core/redux/projects";
import { useRouteMatch } from "react-router-dom";
import useProjectRequester from "@core/hooks/useProjectRequester";
import useProjectEditorRequester from "@core/hooks/useProjectEditorRequester";
import useAuthUser from "@core/auth/useAuthUser";
import useProjectQueuesRequester from "@core/hooks/useProjectQueuesRequester";
import { PROJECT_MEMBER_ROLES } from "@utils/const";
import { workspaceActions } from "@core/redux/workspace";

const ProjectDetailContext = createContext({
  projectId: null,
  project: null,
  memberId: null,
  loading: null,
  error: null,
  handleStatusInvite: null,
  handleJoinRequestProject: null,
  isAdminOrProjectAdmin: null,
  isProjectLabeler: null,
  isProjectReviewer: null,
  isProjectLabelerOrReviewer: null,
  numberRejected: null,
  generateExport: null,
  reviewAvailable: null,
  labelAvailable: null,
  queueLabelId: null,
  queueReviewId: null,
  memberGetQueueReview: null,
  memberGetQueueLabel: null,
  validateAvailable: null,
});

export const ProjectDetailProvider = React.memo(({ children, pid }) => {
  const dispatch = useDispatch();
  const { appConfig, fromConfig } = useAppConfig();
  const { user, isAdmin } = useAuthUser();
  const {
    error,
    loading,
    project,
    projectId,
    memberId,
    requestedId,
    reviewAvailable,
    labelAvailable,
    validateAvailable,
    queueLabelId,
    queueReviewId,
  } = useProjectRequester({ projectId: pid });

  const memberGetQueueReview = useCallback(
    async (memberId) => {
      const response = await dispatch(
        workspaceActions.memberGetQueueReview(memberId)
      );
      return response;
    },
    [dispatch]
  );

  const memberGetQueueLabel = useCallback(
    async (memberId) => {
      const response = await dispatch(
        workspaceActions.memberGetQueueLabel(memberId)
      );
      return response;
    },
    [dispatch]
  );

  const generateExport = useCallback(() => {
    dispatch(projectsActions.exportLabelItem({ projectId }));
  }, [dispatch, projectId]);

  const numberRejected = useMemo(() => {
    return project?.member?.num_queue_rejected;
  }, [project]);

  const isAdminOrProjectAdmin = useMemo(() => {
    return (
      isAdmin ||
      project?.member?.role?.find(
        (rol) => rol?.name === PROJECT_MEMBER_ROLES.ADMIN
      )
    );
  }, [project, isAdmin]);

  const isProjectLabeler = useMemo(() => {
    return project?.member?.role?.find(
      (rol) => rol?.name === PROJECT_MEMBER_ROLES.LABELER
    );
  }, [project]);

  const isProjectReviewer = useMemo(
    () => {
      return project?.member?.role?.find(
        (rol) => rol?.name === PROJECT_MEMBER_ROLES.REVIEWER
      );
    },
    [project]
  );

  const isProjectLabelerOrReviewer = useMemo(() => {
    return isProjectReviewer || isProjectLabeler;
  }, [isProjectLabeler, isProjectReviewer]);

  const handleStatusInvite = useCallback(
    async (status) => {
      const newStatus = { status: status, project_id: projectId };
      await dispatch(projectsActions.onHandleStatusInvite(newStatus));
      dispatch(projectsActions.fetchProject({ id: projectId }))
    },
    [dispatch, status]
  );

  const handleJoinRequestProject = useCallback(
    (status) => {
      const newStatus = {
        user_id: user.id,
        role: [
          {
            name: "LABELER",
          },
        ],
        project_id: parseInt(projectId),
      };
      dispatch(projectsActions.onHandleJoinRequestProject(newStatus));
    },
    [dispatch, status]
  );

  const contextValue = useMemo(
    () => ({
      projectId,
      project,
      memberId,
      loading,
      error,
      isAdminOrProjectAdmin,
      isProjectLabeler,
      isProjectReviewer,
      isProjectLabelerOrReviewer,
      numberRejected,
      handleStatusInvite,
      handleJoinRequestProject,
      generateExport,
      reviewAvailable,
      labelAvailable,
      queueLabelId,
      queueReviewId,
      validateAvailable,
      memberGetQueueReview,
      memberGetQueueLabel,
    }),
    [
      projectId,
      project,
      memberId,
      loading,
      error,
      isAdminOrProjectAdmin,
      isProjectLabeler,
      isProjectReviewer,
      isProjectLabelerOrReviewer,
      numberRejected,
      handleStatusInvite,
      handleJoinRequestProject,
      generateExport,
      reviewAvailable,
      labelAvailable,
      queueLabelId,
      queueReviewId,
      validateAvailable,
      memberGetQueueReview,
      memberGetQueueLabel,
    ]
  );

  return (
    <ProjectDetailContext.Provider value={contextValue}>
      {children}
    </ProjectDetailContext.Provider>
  );
});

export function withProjectDetailContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailProvider>
        <Component {...props} />
      </ProjectDetailProvider>
    );
  };
}

export const useProjectDetail = () => useContext(ProjectDetailContext);

export default useProjectDetail;
