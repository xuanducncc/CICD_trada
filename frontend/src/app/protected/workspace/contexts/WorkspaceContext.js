import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  useLayoutEffect,
} from "react";
import { useAppConfig } from "../../../../components/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  projectsActions,
  projectsSelectors,
} from "../../../../core/redux/projects";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import useProtected from "@components/Protected/ProtectedContext";
import useProjectRequester from "@core/hooks/useProjectRequester";
import useProjectEditorRequester from "@core/hooks/useProjectEditorRequester";
import { workspaceSelectors, workspaceActions } from "@core/redux/workspace";
import useWorkspaceQueue from "../../../../core/hooks/useWorkspaceQueue";
import useDrawerManager from "../../hooks/useDrawerManager";
import useWorkItemRequester from "../../../../core/hooks/useWorkItemRequester";
import Modal from "antd/lib/modal";
import useProjectDetail from "@app/protected/projects/detail/ProjectDetailContext";
import { useSearchParams } from "@core/hooks/useSearchParams";
import {
  PROJECT_MEMBER_ROLES,
  WORKSPACE_MODE,
  WORK_ITEM_STATUS,
} from "@utils/const";
import { useTimeout } from "@core/hooks/useTimeOut";
import { projectSlice } from "@core/redux/projects/projectDetail";

const WorkspaceContext = createContext({
  projectId: null,
  queueItems: null,
  instruction: null,
  currentId: null,
  currentIndex: null,
  drawerVisible: null,
  loading: null,
  error: null,
  selectQueueItem: null,
  backQueueItem: null,
  nextQueueItem: null,
  setDrawerVisible: null,
  instructionDrawerVisible: null,
  setInstructionDrawerVisible: null,
  openInstruction: null,
  closeInstruction: null,
});

export const WorkspaceProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { appConfig, fromConfig } = useAppConfig();
  const { setShowHeader } = useProtected();
  const { params } = useRouteMatch();
  const { pid: projectId } = params;
  const { wid: workItemId, qid: queueId } = useSearchParams();
  const history = useHistory();
  const instruction = useSelector(projectsSelectors.selectProjectDetailInstructionItem);
  const { drawerVisible, setDrawerVisible, instructionDrawerVisible, setInstructionDrawerVisible } = useDrawerManager();

  const {
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
    clearWorkspace,
    requestQueue,
    setCurrentId,
    backQueueItem,
    nextQueueItem,
    loadInstructions,
  } = useWorkspaceQueue({
    projectId,
    workItemId,
    queueId,
    // status: WORK_ITEM_STATUS.PENDING,
    role: PROJECT_MEMBER_ROLES.LABELER,
    mode: WORKSPACE_MODE.ANNOTATION,
  });

  const selectQueueItem = useCallback(
    (id) => {
      setCurrentId(id);
      setDrawerVisible(false);
    },
    [setCurrentId, setDrawerVisible]
  );

  const openInstruction = useCallback(() => {
    loadInstructions();
    setInstructionDrawerVisible(true);
  }, [setInstructionDrawerVisible, loadInstructions]);

  const closeInstruction = useCallback(() => {
    setInstructionDrawerVisible(false);
  }, [setInstructionDrawerVisible, loadInstructions]);

  const contextValue = useMemo(
    () => ({
      projectId,
      queueItems,
      instruction,
      currentId,
      currentIndex,
      drawerVisible,
      instructionDrawerVisible,
      loading,
      error,
      selectQueueItem,
      backQueueItem,
      nextQueueItem,
      setDrawerVisible,
      openInstruction,
      closeInstruction,
    }),
    [
      projectId,
      queueItems,
      instruction,
      currentId,
      currentIndex,
      drawerVisible,
      instructionDrawerVisible,
      loading,
      error,
      selectQueueItem,
      backQueueItem,
      nextQueueItem,
      setDrawerVisible,
      openInstruction,
      closeInstruction,
    ]
  );

  useEffect(() => {
    setShowHeader(false);
    return () => {
      setShowHeader(true);
    };
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }
    Modal.error({
      title: "Error",
      content: error.message || "Cannot Init Workspace.",
    });
  }, [error]);

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
        const result = await requestQueue({ memberId, projectId });
        if (result.error) {
          return;
        }
        const { queueId } = result.payload;
        if (queueId) {
          history.replace(`/i/projects/${projectId}/workspace/?qid=${queueId}`);
          clearWorkspace();
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
      requestQueue,
      memberId,
      projectId,
      isFinished
    });
  }, [
    isEmpty,
    isReady,
    requestQueue,
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
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export function withWorkspaceContext(Component) {
  return function WrapperComponent(props) {
    return (
      <WorkspaceProvider>
        <Component {...props} />
      </WorkspaceProvider>
    );
  };
}

export const useWorkspace = () => useContext(WorkspaceContext);

export default useWorkspace;
