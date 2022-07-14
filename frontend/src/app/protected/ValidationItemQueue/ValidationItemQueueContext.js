import useProjectQueuesRequester from "@core/hooks/useProjectQueuesRequester";
import useWorkspaceQueue from "@core/hooks/useWorkspaceQueue";
import { projectsActions } from "@core/redux/projects";
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
import { WORKSPACE_MODE } from "@utils/const";

const ValidationItemQueueContext = createContext({
  queues: null,
  error: null,
  loading: null,
  currentId: null,
  acceptWorkItem: null,
  rejectWorkItem: null,
  selectWorkItem: null,
  queueItems: null,
  queueId: null,
});

export const ValidationItemQueueProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { setShowHeader } = useProtected();
  const history = useHistory();
  const { pid: projectId, qid: queueId } = useParams();
  const { queueItems, error, loading, currentId, clearWorkspace } =
    useWorkspaceQueue({ projectId, queueId, mode: WORKSPACE_MODE.VERIFY });

  const acceptWorkItem = useCallback(
    ({ id, queueId }) => {
      if (id) {
        dispatch(
          workspaceActions.acceptWorkItem({ workitem_id: parseInt(id) })
        );
      } else {
        dispatch(workspaceActions.acceptWorkItem({ queue_id: +queueId }));
      }
    },
    [dispatch]
  );

  const rejectWorkItem = useCallback(
    ({ id, queueId }) => {
      if (id) {
        dispatch(
          workspaceActions.rejectWorkItem({ workitem_id: parseInt(id) })
        );
      } else {
        dispatch(workspaceActions.rejectWorkItem({ queue_id: +queueId }));
      }
    },
    [dispatch]
  );

  const selectWorkItem = useCallback(
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
      acceptWorkItem,
      rejectWorkItem,
      selectWorkItem,
      queueId,
    }),
    [
      queueItems,
      error,
      loading,
      currentId,
      acceptWorkItem,
      rejectWorkItem,
      selectWorkItem,
      queueId,
    ]
  );

  useEffect(() => {
    setShowHeader(false);
    return () => {
      setShowHeader(true);
      clearWorkspace();
    };
  }, []);

  return (
    <ValidationItemQueueContext.Provider value={contextValue}>
      {children}
    </ValidationItemQueueContext.Provider>
  );
};
export function withValidationItemQueueContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ValidationItemQueueProvider>
        <Component {...props} />
      </ValidationItemQueueProvider>
    );
  };
}

export const useValidationItemQueue = () =>
  useContext(ValidationItemQueueContext);

export default useValidationItemQueue;
