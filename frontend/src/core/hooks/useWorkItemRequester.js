import { workspaceActions, workspaceSelectors } from "@core/redux/workspace";
import { notificationActions } from "@core/redux/notification";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAsyncEffect from "use-async-effect";

export default function useWorkItemRequester({ id, memberId }) {
  const dispatch = useDispatch();
  const editor = useSelector(workspaceSelectors.selectWorkspaceEditor);
  const selectedLabeledItemId = useSelector(
    workspaceSelectors.selectWorkspaceDataSelectedLabeledItemId
  );
  const workItemRequestedId = useSelector(
    workspaceSelectors.selectWorkspaceDataRequestedId
  );
  const editorData = useSelector(
    workspaceSelectors.selectWorkspaceDataEditorData
  );
  const loading = useSelector(workspaceSelectors.selectWorkspaceDataIsLoading);
  const error = useSelector(workspaceSelectors.selectWorkspaceDataError);

  const updateWorkItem = useCallback(
    (item) => {
      return dispatch(workspaceActions.updateWorkItem(item));
    },
    [dispatch]
  );

  const submitWorkItem = useCallback(
    (item) => {
      for (const tool of editor.tools) {
        for (const control of tool.controls) {
          if (control.required) {
            const labeledItem = item.labeledItems.find(
              (li) => li.toolId === tool.id && li.controlType === control.type
            );

            if (!labeledItem || !labeledItem.labelValue) {
              const controlName = control.name;
              const message = `${controlName} is required`;
              dispatch(
                notificationActions.addNotification({
                  type: "error",
                  message: "Invalid Label",
                  description: message,
                })
              );
              return { error: { message } };
            }
          }
        }
      }
      return dispatch(workspaceActions.submitWorkItem(item));
    },
    [dispatch, editor]
  );

  const skipWorkItem = useCallback(
    (item) => {
      return dispatch(workspaceActions.skipWorkItem(item));
    },
    [dispatch]
  );

  const voteUpLabeledItem = useCallback(
    (item) => {
      return dispatch(workspaceActions.voteUpLabeledItem(item));
    },
    [dispatch]
  );

  const voteDownLabeledItem = useCallback(
    (item) => {
      return dispatch(workspaceActions.voteDownLabeledItem(item));
    },
    [dispatch]
  );

  const selectLabeledItemId = useCallback(
    ({ id }) => {
      return dispatch(workspaceActions.selectLabeledItemId({ id }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!editor || !id || workItemRequestedId === id || loading) {
      return;
    }

    dispatch(workspaceActions.initWorkspaceData({ id, memberId }));
  }, [id, memberId, workItemRequestedId, editor, loading]);

  return {
    error,
    editor,
    loading,
    editorData,
    selectedLabeledItemId,
    updateWorkItem,
    submitWorkItem,
    skipWorkItem,
    voteUpLabeledItem,
    voteDownLabeledItem,
    selectLabeledItemId,
  };
}
