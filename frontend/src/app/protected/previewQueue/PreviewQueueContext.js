import useProjectQueuesRequester from "@core/hooks/useProjectQueuesRequester";
import useWorkspaceQueue from "@core/hooks/useWorkspaceQueue";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { workspaceActions } from "@core/redux/workspace";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import useProtected from "@components/Protected/ProtectedContext";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSearchParams } from "@core/hooks/useSearchParams";
import { WORKSPACE_MODE } from "@utils/const";

const PreviewQueueContext = createContext({
  error: null,
  loading: null,
  currentId: null,
  queueItems: null,
  member: null,
  selectQueueItem: null,
});

export const PreviewQueueProvider = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setShowHeader } = useProtected();
  const { pid: projectId } = useParams();
  const {
    id,
    wid: workItemId,
    qid: queueId,
    status,
    page,
    label,
  } = useSearchParams();
  const member = useSelector(projectsSelectors.selectProjectDetailMember);
  const { queueItems, error, loading, currentId, clearWorkspace } =
    useWorkspaceQueue({
      projectId,
      workItemId,
      queueId,
      status,
      page,
      label,
      id,
      mode: WORKSPACE_MODE.PREVIEW,
    });

  const selectQueueItem = useCallback(
    (id) => {
      dispatch(workspaceActions.selectItemById({ id }));
    },
    [dispatch]
  );

  const contextValue = useMemo(
    () => ({
      queueItems,
      error,
      loading,
      currentId,
      selectQueueItem,
      member,
    }),
    [queueItems, error, loading, currentId, selectQueueItem, member]
  );

  useEffect(() => {
    setShowHeader(false);
    return () => {
      setShowHeader(true);
      clearWorkspace();
    };
  }, []);

  return (
    <PreviewQueueContext.Provider value={contextValue}>
      {children}
    </PreviewQueueContext.Provider>
  );
};
export function withPreviewQueueContext(Component) {
  return function WrapperComponent(props) {
    return (
      <PreviewQueueProvider>
        <Component {...props} />
      </PreviewQueueProvider>
    );
  };
}

export const usePreviewQueue = () => useContext(PreviewQueueContext);

export default usePreviewQueue;
