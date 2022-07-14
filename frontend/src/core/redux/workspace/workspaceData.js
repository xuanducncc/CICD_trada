import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";

import * as workItemApi from "../../api/workitemApi";
import * as mediaApi from "../../api/mediaApi";
import { workItemsSlice } from "./workspaceWorkItems";
import {
  ACTION_LOG_ACTIONS,
  ACTION_LOG_OBJECTS,
  WORK_ITEM_STATUS,
} from "@utils/const";
import { createActionLogMiddleWare } from "../logger";

export const fetchWorkItem = createAsyncThunk(
  "workspace/fetchWorkItem",
  async ({ id, memberId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.getWorkItemDetail(id);
      const workItem = response.data;
      // CALCULATE VOTES
      for (const li of workItem.labeledItems) {
        const myVote = memberId
          ? li?.vote?.find((vot) => vot.member_id === memberId)
          : null;
        li.myVote = myVote;
      }
      return workItem;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const updateWorkItem = createAsyncThunk(
  "workspace/updateWorkItem",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await workItemApi.updateWorkItem(payload);
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const submitWorkItem = createAsyncThunk(
  "workspace/submitWorkItem",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.submitWorkItem(payload);
      dispatch(
        workItemsSlice.actions.updateItemStatus({
          id: payload.id,
          status: "VALIDATION",
        })
      );
      dispatch(workItemsSlice.actions.nextQueueItem());
      return response?.status;
    } catch (err) {
      const description =
        err?.response?.data?.error?.message ?? "Please check and try again";
      return rejectWithValue({
        type: "error",
        message: "Cannot submit item",
        description,
        notification: true,
      });
    }
  }
);

export const skipWorkItem = createAsyncThunk(
  "workspace/skipWorkItem",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.skipWorkItem(payload);
      dispatch(
        workItemsSlice.actions.updateItemStatus({
          id: payload.id,
          status: "SKIPPED",
        })
      );
      dispatch(workItemsSlice.actions.nextQueueItem());
      return response?.status;
    } catch (err) {
      return rejectWithValue({
        type: "error",
        message: "Cannot skip item",
        description: "Please check and try again",
        notification: true,
      });
    }
  }
);

export const acceptWorkItem = createAsyncThunk(
  "project/acceptWorkItem",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.verifyWorkItem({
        ...payload,
        action: "accept",
      });
      if (payload.workitem_id) {
        dispatch(
          workItemsSlice.actions.updateItemStatus({
            id: payload.workitem_id,
            status: "COMPLETED",
          })
        );
        dispatch(workItemsSlice.actions.nextQueueItem());
      } else {
        dispatch(
          workItemsSlice.actions.updateAllItemStatus({ status: "COMPLETED" })
        );
      }
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "accept work item successfully",
        },
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to accept Work item",
        description: err?.response?.data?.error?.message || "Please try again",
        notification: true,
      });
    }
  }
);

export const rejectWorkItem = createAsyncThunk(
  "project/rejectWorkItem",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.verifyWorkItem({
        ...payload,
        action: "reject",
      });
      if (payload.workitem_id) {
        dispatch(
          workItemsSlice.actions.updateItemStatus({
            id: payload.workitem_id,
            status: "REJECTED",
          })
        );
        dispatch(workItemsSlice.actions.nextQueueItem());
      } else {
        dispatch(
          workItemsSlice.actions.updateAllItemStatus({ status: "REJECTED" })
        );
      }
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "reject work item successfully",
        },
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed reject Work item",
        description: err?.response?.data?.error?.message || "Please try again",
        notification: true,
      });
    }
  }
);

export const voteLabeledItem = createAsyncThunk(
  "project/voteLabeledItem",
  async (
    { score, labeledItemId, memberId, trustScore },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await workItemApi.voteLabeledItem({
        score,
        labeleditem_id: labeledItemId,
        member_id: memberId,
        trust_score: trustScore,
      });
      const { data } = response;
      dispatch(
        workItemsSlice.actions.updateItemStatus({
          id: data.workitem_id,
          status: "REVIEWED",
        })
      );
      return response;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to vote item",
        description: err?.response?.data?.error?.message || "Please try again",
        notification: true,
      });
    }
  }
);

export const voteUpLabeledItem = createAsyncThunk(
  "project/voteUpLabeledItem",
  async ({ labeledItemId, memberId }, { rejectWithValue, dispatch }) => {
    return dispatch(
      voteLabeledItem({ score: 1, labeledItemId, memberId, trustScore: 0 })
    );
  }
);

export const voteDownLabeledItem = createAsyncThunk(
  "project/voteDownLabeledItem",
  async ({ labeledItemId, memberId }, { rejectWithValue, dispatch }) => {
    return dispatch(
      voteLabeledItem({ score: -1, labeledItemId, memberId, trustScore: 0 })
    );
  }
);

export const fetchMedia = createAsyncThunk(
  "workspace/fetchMedia",
  async ({ id }, { rejectWithValue }) => {
    try {
      const url = await mediaApi.getMediaUrl(id);
      return { url };
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const initWorkspaceData = createAsyncThunk(
  "workspace/initWorkspaceData",
  async ({ id, memberId }, { rejectWithValue, dispatch }) => {
    try {
      const workItemResult = await dispatch(fetchWorkItem({ id, memberId }));
      if (workItemResult.error) {
        return rejectWithValue(workItemResult.error);
      }

      const workItem = workItemResult.payload;
      const mediaId = workItem.row.id;
      const mediaResult = await dispatch(fetchMedia({ id: mediaId }));
      if (mediaResult.error) {
        return rejectWithValue(mediaResult.error);
      }

      const media = mediaResult.payload;
      return {
        workItem,
        media,
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const workspaceDataSlice = createSlice({
  name: "workspaceData",
  initialState: {
    loading: "idle",
    error: null,
    workItem: null,
    mediaUrl: null,
    requestedId: null,
    selectedLabeledItemId: null,
    isFinished: false
  },
  reducers: {
    setIsFinished(state, action) {
      state.isFinished = false
    },
    resetWorkspaceData(state) {
      return {
        loading: "idle",
        error: null,
        workItem: null,
        selectedLabeledItemId: null,
        mediaUrl: null,
        requestedId: null,
        isFinished: false
      };
    },
    selectLabeledItemId(state, action) {
      state.selectedLabeledItemId = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initWorkspaceData.pending, (state, action) => {
      state.loading = "idle";
      state.error = null;
      state.workItem = null;
      state.mediaUrl = null;
      state.selectedLabeledItemId = null;
      state.requestedId = action.meta.arg.id;
    });

    builder
      .addCase(fetchWorkItem.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchWorkItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.workItem = action.payload;
      })
      .addCase(fetchWorkItem.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching workItem",
        };
      });

    builder
      .addCase(updateWorkItem.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateWorkItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateWorkItem.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching workitem",
        };
      });

    builder
      .addCase(submitWorkItem.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(submitWorkItem.fulfilled, (state, action) => {
        state.loading = "idle";
        state.error = null;
        state.isFinished = action?.payload === 205 ? true : false
      })
      .addCase(submitWorkItem.rejected, (state, action) => {
        state.loading = "rejected";
      });

    builder
      .addCase(skipWorkItem.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(skipWorkItem.fulfilled, (state, action) => {
        state.loading = "idle";
        state.error = null;
        state.isFinished = action?.payload === 205 ? true : false
      })
      .addCase(skipWorkItem.rejected, (state, action) => {
        state.loading = "rejected";
      });

    builder
      .addCase(fetchMedia.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.mediaUrl = action.payload.url;
        state.error = null;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching workitem",
        };
      });
    builder
      .addCase(acceptWorkItem.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(acceptWorkItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(acceptWorkItem.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while accept workitem",
        };
      });
    builder
      .addCase(rejectWorkItem.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(rejectWorkItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(rejectWorkItem.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while reject workitem",
        };
      });

    builder.addCase(voteLabeledItem.fulfilled, (state, action) => {
      state.isFinished = action.payload?.status === 202 ? true : false
      const voteResult = action.payload.data;
      for (const li of state.workItem.labeledItems) {
        if (li.id === voteResult.labeleditem_id) {
          li.myVote = voteResult;
          li.vote = li.vote.map((vot) =>
            vot.member_id === voteResult.member_id ? voteResult : vot
          );
        }
      }
    });
  },
});

export default workspaceDataSlice.reducer;

export const workspaceDataLoggerMiddleWare = createActionLogMiddleWare(
  (action, getState) => {
    if (action.type === initWorkspaceData.fulfilled.type) {
      const state = getState();
      return {
        user_id: state.auth.user.id,
        object: ACTION_LOG_OBJECTS.WORK_ITEM,
        action: ACTION_LOG_ACTIONS.WORK_ITEM_START,
        change_message: "Init from web",
        value: {},
        member_id: state.projects.projectDetail.project.member.id,
        project_id: state.projects.projectDetail.project.id,
        workitem_id: state.workspace.workspaceData.requestedId,
        label_id: null,
        tool_id: null,
        labeleditem_id: null,
      };
    }
    // if (action.type === skipWorkItem.fulfilled.type) {
    //   const state = getState();
    //   return {
    //     user_id: state.auth.user.id,
    //     object: ACTION_LOG_OBJECTS.WORK_ITEM,
    //     action: ACTION_LOG_ACTIONS.WORK_ITEM_SKIP,
    //     changeMessage: 'Skip from web',
    //     value: {},
    //     member_id: state.projects.projectDetail.project.member_id,
    //     project_id: state.projects.projectDetail.project.id,
    //     workitem_id: state.workspace.workspaceData.requestedId,
    //     label_id: null,
    //     tool_id: null,
    //     labeleditem_id: null,
    //   }
    // }
    // if (action.type === submitWorkItem.fulfilled.type) {
    //   const state = getState();
    //   return {
    //     user_id: state.auth.user.id,
    //     object: ACTION_LOG_OBJECTS.WORK_ITEM,
    //     action: ACTION_LOG_ACTIONS.WORK_ITEM_SUBMIT,
    //     changeMessage: 'Submit from web',
    //     value: {},
    //     member_id: state.projects.projectDetail.project.member_id,
    //     project_id: state.projects.projectDetail.project.id,
    //     workitem_id: state.workspace.workspaceData.requestedId,
    //     label_id: null,
    //     tool_id: null,
    //     labeleditem_id: null,
    //   }
    // }
  }
);
