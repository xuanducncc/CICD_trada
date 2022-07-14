import { combineReducers } from "redux";

import workspaceConfig, {
  initWorkspace,
  requestQueue,
  requestQueueReview,
  workspaceConfigSlice,
} from "./workspaceConfig";
import workspaceCanvas from "./workspaceCanvas";
import workSpaceWorkItems, {
  workItemsAdapter,
  workItemsSlice,
  memberGetQueueReview,
  memberGetQueueLabel,
} from "./workspaceWorkItems";
import {
  createAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import workspaceData, {
  fetchWorkItem,
  updateWorkItem,
  skipWorkItem,
  submitWorkItem,
  acceptWorkItem,
  rejectWorkItem,
  voteDownLabeledItem,
  voteUpLabeledItem,
  initWorkspaceData,
  workspaceDataLoggerMiddleWare,
  workspaceDataSlice,
} from "./workspaceData";
import { WORK_ITEM_STATUS } from "@utils/const";

export default combineReducers({
  workspaceConfig,
  workspaceCanvas,
  workSpaceWorkItems,
  workspaceData,
});

export const workspaceActions = {
  initWorkspace,
  fetchWorkItem,
  updateWorkItem,
  skipWorkItem,
  submitWorkItem,
  initWorkspaceData,
  memberGetQueueReview,
  memberGetQueueLabel,
  requestQueue,
  requestQueueReview,
  acceptWorkItem,
  rejectWorkItem,
  voteDownLabeledItem,
  voteUpLabeledItem,
  nextQueueItem: workItemsSlice.actions.nextQueueItem,
  backQueueItem: workItemsSlice.actions.backQueueItem,
  selectItemById: workItemsSlice.actions.selectItemById,
  selectItemByIndex: workItemsSlice.actions.selectItemByIndex,
  clearWorkspace: workItemsSlice.actions.clearWorkspace,
  resetWorkspaceConfig: workspaceConfigSlice.actions.resetWorkspaceConfig,
  resetWorkspaceData: workspaceDataSlice.actions.resetWorkspaceData,
  selectLabeledItemId: workspaceDataSlice.actions.selectLabeledItemId,
};

const selectSelf = (state) => state.workspace;

const selectWorkspaceConfig = createSelector(
  selectSelf,
  (state) => state.workspaceConfig
);

const selectWorkSpaceConfigError = createSelector(
  selectWorkspaceConfig,
  (state) => state.error
);

const selectWorkspaceConfigIsFinished = createSelector(
  selectWorkspaceConfig,
  (state) => state.isFinished
);

const selectWorkspaceLoading = createSelector(
  selectWorkspaceConfig,
  (state) => state.loading
);

const selectWorkspaceEditor = createSelector(
  selectWorkspaceConfig,
  (state) => state.editor
);

const selectWorkSpaceWorkItems = createSelector(
  selectSelf,
  (state) => state.workSpaceWorkItems
);

const selectWorkSpaceWorkItemsSelectors = workItemsAdapter.getSelectors(
  selectWorkSpaceWorkItems
);

const selectWorkSpaceWorkItemsLoading = createSelector(
  selectWorkSpaceWorkItems,
  (state) => state.loading
);

const selectWorkspaceIsReady = createSelector(
  selectWorkspaceLoading,
  selectWorkSpaceWorkItemsLoading,
  (configLoading, itemsLoading) =>
    configLoading === "fulfilled" && itemsLoading === "fulfilled"
);

const selectWorkSpaceWorkItemsSelectedId = createSelector(
  selectWorkSpaceWorkItems,
  (state) => state.selectedId
);

const selectWorkSpaceWorkItemsEntities =
  selectWorkSpaceWorkItemsSelectors.selectEntities;

const selectWorkSpaceWorkItemsSelectedItem = createSelector(
  selectWorkSpaceWorkItemsEntities,
  selectWorkSpaceWorkItemsSelectedId,
  (entities, id) => entities[id]
);

const selectWorkSpaceWorkItemsAll = selectWorkSpaceWorkItemsSelectors.selectAll;

const selectWorkSpaceWorkItemsIds = selectWorkSpaceWorkItemsSelectors.selectIds;

const selectWorkSpaceWorkItemsTotal =
  selectWorkSpaceWorkItemsSelectors.selectTotal;

const selectWorkSpaceWorkItemsSelectedIndex = createSelector(
  selectWorkSpaceWorkItemsIds,
  selectWorkSpaceWorkItemsSelectedId,
  (ids, id) => ids.indexOf(id)
);

const selectWorkSpaceWorkItemsHasNext = createSelector(
  selectWorkSpaceWorkItemsTotal,
  selectWorkSpaceWorkItemsSelectedIndex,
  (total, index) => index < total - 1
);

const selectWorkSpaceWorkItemsHasPrev = createSelector(
  selectWorkSpaceWorkItemsSelectedIndex,
  (index) => index > 0
);

const selectWorkSpaceWorkItemsError = createSelector(
  selectWorkSpaceWorkItems,
  (state) => state.error
);

const selectWorkSpaceWorkItemsIsEmpty = createSelector(
  selectWorkSpaceWorkItems,
  (state) => state.empty
);

const selectWorkspaceData = createSelector(
  selectSelf,
  (state) => state.workspaceData
);

const selectWorkspaceDataRequestedId = createSelector(
  selectWorkspaceData,
  (state) => state.requestedId
);

const selectWorkspaceDataIsFinished = createSelector(
  selectWorkspaceData,
  (state) => state.isFinished
);

const selectWorkSpaceWorkItemsMemberId = createSelector(
  selectWorkspaceConfig,
  (state) => state?.member?.id ?? null
);

const selectWorkSpaceWorkItemsIsFinished = createSelector(
  selectWorkspaceConfig,
  (state) => state.isFinished
);

const selectWorkspaceDataEditorData = createSelector(
  selectWorkspaceData,
  ({ workItem, mediaUrl }) => ({ workItem, mediaUrl })
);

const selectWorkspaceDataSelectedLabeledItemId = createSelector(
  selectWorkspaceData,
  (state) => state.selectedLabeledItemId
);

const selectWorkspaceDataLoading = createSelector(
  selectWorkspaceData,
  (state) => state.loading
);

const selectWorkspaceDataIsLoading = createSelector(
  selectWorkspaceData,
  (state) => state.loading === "pending"
);

const selectWorkspaceDataError = createSelector(
  selectWorkspaceData,
  (state) => state.error
);

const selectWorkspaceError = createSelector(
  selectWorkSpaceWorkItemsError,
  selectWorkSpaceConfigError,
  (err1, err2) => err1 || err2
);

export const workspaceSelectors = {
  selectWorkspaceLoading,
  selectWorkSpaceConfigError,
  selectWorkspaceError,
  selectWorkSpaceWorkItemsAll,
  selectWorkSpaceWorkItemsSelectedItem,
  selectWorkSpaceWorkItemsSelectedId,
  selectWorkSpaceWorkItemsHasPrev,
  selectWorkSpaceWorkItemsHasNext,
  selectWorkSpaceWorkItemsSelectedIndex,
  selectWorkSpaceWorkItemsError,
  selectWorkspaceEditor,
  selectWorkspaceData,
  selectWorkspaceDataEditorData,
  selectWorkspaceDataRequestedId,
  selectWorkSpaceWorkItemsMemberId,
  selectWorkspaceDataLoading,
  selectWorkspaceDataError,
  selectWorkspaceDataIsLoading,
  selectWorkSpaceWorkItemsIsEmpty,
  selectWorkspaceDataIsFinished,
  selectWorkspaceConfigIsFinished,
  selectWorkSpaceWorkItemsIsFinished,
  selectWorkspaceIsReady,
  selectWorkspaceDataSelectedLabeledItemId,
};

export const workspaceMiddleWares = [workspaceDataLoggerMiddleWare];
