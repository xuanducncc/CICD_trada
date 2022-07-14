import React, {
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState
} from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import useProtected from "@components/Protected/ProtectedContext";
import useWorkspaceQueue from "@core/hooks/useWorkspaceQueue";
import useDrawerManager from "../hooks/useDrawerManager";
import Modal from "antd/lib/modal";
import { useSearchParams } from "@core/hooks/useSearchParams";
import { PROJECT_MEMBER_ROLES, WORKSPACE_MODE, WORK_ITEM_STATUS } from "@utils/const";
import { projectsActions } from "@core/redux/projects";
import { projectSlice } from "@core/redux/projects/projectDetail";

const ReviewContext = createContext({
  projectId: null,
  memberId: null,
  queueItems: null,
  currentId: null,
  currentIndex: null,
  drawerVisible: null,
  loading: null,
  error: null,
  isReady: null,
  selectQueueItem: null,
  backQueueItem: null,
  nextQueueItem: null,
  setDrawerVisible: null,
});

export const ReviewProvider = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setShowHeader } = useProtected();
  const { pid: projectId, qid: queueId } = useParams();
  const { wid: workItemId } = useSearchParams();
  const { drawerVisible, setDrawerVisible } = useDrawerManager();

  const {
    error,
    loading,
    isReady,
    isFinished,
    isFinishedQueue,
    queueItems,
    isEmpty,
    currentId,
    memberId,
    currentIndex,
    requestQueueReview,
    setCurrentId,
    backQueueItem,
    nextQueueItem,
    clearWorkspace,
  } = useWorkspaceQueue({
    projectId,
    workItemId,
    queueId,
    status: WORK_ITEM_STATUS.REVIEWING,
    role: PROJECT_MEMBER_ROLES.REVIEWER,
    mode: WORKSPACE_MODE.REVIEW,
  });

  const selectQueueItem = useCallback(
    (id) => {
      setCurrentId(id);
      setDrawerVisible(false);
    },
    [setCurrentId, setDrawerVisible]
  );

  const contextValue = useMemo(
    () => ({
      projectId,
      memberId,
      queueItems,
      currentId,
      currentIndex,
      drawerVisible,
      loading,
      error,
      isReady,
      selectQueueItem,
      backQueueItem,
      nextQueueItem,
      setDrawerVisible,
    }),
    [
      projectId,
      memberId,
      queueItems,
      currentId,
      currentIndex,
      drawerVisible,
      loading,
      error,
      isReady,
      selectQueueItem,
      backQueueItem,
      nextQueueItem,
      setDrawerVisible,
    ]
  );

  useEffect(() => {
    setShowHeader(false);
    return () => {
      setShowHeader(true);
      clearWorkspace();
    };
  }, []);

  const onBackButtonEvent = (e) => {
    Modal.destroyAll()
    history.replace(`/i/projects/${projectId}`);
    dispatch(projectSlice.actions.setRquestedId());
  }

  useEffect(() => {
    window.history.replaceState(null, null, window.location.href);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      onBackButtonEvent();
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  const checkForRequestQueue = ({
    isEmpty,
    isReady,
    requestQueue,
    memberId,
    projectId,
    isFinishedQueue,
    isFinished
  }) => {
    if ((!isEmpty || !isReady || isFinishedQueue) && !isFinished) {
      return;
    }
    Modal.info({
      title: "Nothing left",
      content:
        "No item left in your queue. please check other project or request more items.",
      onOk: async () => {
        const result = await requestQueueReview({ memberId, projectId });
        if (result.error) {
          return;
        }
        const { queueId } = result.payload;
        if (queueId) {
          clearWorkspace();
          history.replace(`/i/projects/${projectId}/review/${queueId}`);
        }
      },
      okCancel: true,
      onCancel: () => {
        history.replace(`/i/projects/${projectId}`);
        dispatch(projectSlice.actions.setRquestedId());
      },
      okText: "Request queue",
      cancelText: "Back to project",
    });
  };

  useEffect(() => {

    checkForRequestQueue({
      isEmpty,
      isReady,
      requestQueueReview,
      memberId,
      projectId,
      isFinished
    });
  }, [
    isEmpty,
    isReady,
    requestQueueReview,
    memberId,
    projectId,
    isFinished
  ]);
  useEffect(() => {
    if (!isFinishedQueue) {
      return;
    }

    Modal.info({
      title: "All done",
      content:
        "You have been finished all the work items of the project, please check other project for more work.",
      onOk: async () => {
        clearWorkspace();
        await dispatch(projectsActions.fetchProject({ id: projectId }))
        history.replace(`/i/projects/${projectId}`);
      },
      okCancel: false,
      okText: "Finish",
    });
  }, [history, isFinishedQueue, projectId, clearWorkspace]);

  useEffect(() => {
    return () => {
      clearWorkspace();
    };
  }, []);
  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

export function withReviewContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ReviewProvider>
        <Component {...props} />
      </ReviewProvider>
    );
  };
}

export const useReview = () => useContext(ReviewContext);

export default useReview;
