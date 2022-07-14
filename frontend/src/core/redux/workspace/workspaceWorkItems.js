import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as workItemApi from "@core/api/workitemApi";
import {
  PROJECT_MEMBER_ROLES,
  WORKSPACE_MODE,
  WORK_ITEM_STATUS,
} from "@utils/const";
import { workspaceDataSlice } from "./workspaceData";

// Since we don't provide `selectId`, it defaults to assuming `entity.id` is the right field
export const workItemsAdapter = createEntityAdapter({});

export const fetchWorkItems = createAsyncThunk(
  "workspace/fetchWorkItems",
  async (
    { memberId, projectId, queueId, status, role, mode, page, label, id },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response =
        mode === WORKSPACE_MODE.ANNOTATION && !queueId
          ? null
          : await workItemApi.getMyWorkItems({
              memberId,
              projectId,
              queueId,
              status,
              role,
              page,
              label,
              page_size: page ? "10" : undefined,
              id,
            });

      const rejectedResponse =
        mode === WORKSPACE_MODE.ANNOTATION
          ? await workItemApi.getMyWorkItems({
              memberId,
              projectId,
              status: WORK_ITEM_STATUS.REJECTED,
              role,
              page,
              page_size: page ? "10" : undefined,
            })
          : null;

      const rawData = [].concat(
        rejectedResponse?.data || [],
        response?.data || []
      );

      const data = rawData.map((item) => {
        // GET STATUS
        const currentMemberWorkItem = item.memberworkitem.find((i) => {
          if (
            mode === WORKSPACE_MODE.ANNOTATION &&
            i.role !== PROJECT_MEMBER_ROLES.LABELER
          ) {
            return false;
          }
          if (
            mode === WORKSPACE_MODE.REVIEW &&
            i.role !== PROJECT_MEMBER_ROLES.REVIEWER
          ) {
            return false;
          }
          if (memberId) {
            return i?.member?.id == memberId;
          }
          if (queueId) {
            return i.queue_id == queueId;
          }
          return [
            WORK_ITEM_STATUS.VALIDATION,
            WORK_ITEM_STATUS.PENDING,
            WORK_ITEM_STATUS.SKIPPED,
            WORK_ITEM_STATUS.SUBMITTED,
          ].includes(i.status);
        });
        const workStatus = currentMemberWorkItem
          ? currentMemberWorkItem.status
          : null;
        const displayStatus =
          item.status === WORK_ITEM_STATUS.COMPLETED ||
          item.status === WORK_ITEM_STATUS.REJECTED
            ? item.status
            : workStatus;
        const isReview = item.memberworkitem.some(
          (i) => i.role === PROJECT_MEMBER_ROLES.REVIEWER
        );
        let voteUp = 0;
        let voteDown = 0;
        for (const i of item.labeleditem) {
          for (const vote of i.vote) {
            if (vote.score > 0) {
              voteUp++;
            }
            if (vote.score < 0) {
              voteDown++;
            }
          }
        }
        const review_score =
          voteDown + voteUp === 0 ? 0 : (voteUp / (voteUp + voteDown)) * 100;
        return {
          ...item,
          workStatus,
          displayStatus,
          currentMemberWorkItem,
          isReview,
          review_score,
        };
      });

      let orderStatus = [];
      if (mode === WORKSPACE_MODE.ANNOTATION) {
        orderStatus = [
          WORK_ITEM_STATUS.REJECTED,
          WORK_ITEM_STATUS.PENDING,
          WORK_ITEM_STATUS.SKIPPED,
        ];
      } else if (mode === WORKSPACE_MODE.REVIEW) {
        orderStatus = [WORK_ITEM_STATUS.VALIDATION, WORK_ITEM_STATUS.SUBMITTED];
      } else if (mode === WORKSPACE_MODE.VERIFY) {
        orderStatus = [WORK_ITEM_STATUS.VALIDATION];
      }

      // SORTING
      const sortedData = data.sort((d1, d2) => {
        const index1 = orderStatus.indexOf(d1.displayStatus);
        const index2 = orderStatus.indexOf(d2.displayStatus);
        return index2 - index1;
      });

      return sortedData;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to fetch projects",
        description: err.message,
      });
    }
  }
);

export const memberGetQueueReview = createAsyncThunk(
  "workspace/memberGetReview",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.memberGetQueueReview(id);

      dispatch(workspaceDataSlice.actions.setIsFinished());
      return {
        queueId: response?.data?.queue_review_id,
        notification: {
          type: "success",
          message: "Get review queue successfully",
          description: "",
          notification: true,
        },
      };
    } catch (err) {
      if (err.response.status === 412) {
        return {
          isExist: true,
          queueId: err?.response?.data?.queue_review_id,
        };
      }

      return rejectWithValue({
        type: "error",
        message: "Cannot get review queue",
        description: "Got unexpected error while get review queue",
        notification: true,
      });
    }
  }
);

export const memberGetQueueLabel = createAsyncThunk(
  "workspace/memberGetQueueLabel",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.requestQueue(id);
      dispatch(workspaceDataSlice.actions.setIsFinished());
      return {
        queueId: response?.data?.queue_label_id,
        notification: {
          type: "success",
          message: "Get label queue successfully",
          description: "",
          notification: true,
        },
      };
    } catch (err) {
      if (err.response.status === 412) {
        return {
          isExist: true,
          queueId: err?.response?.data?.queue_label_id,
        };
      }
      return rejectWithValue({
        type: "error",
        message: "Cannot get label queue",
        description: "Got unexpected error while get label queue",
        notification: true,
      });
    }
  }
);

const defaultState = workItemsAdapter.getInitialState({
  loading: "idle",
  error: null,
  selectedId: null,
  empty: false,
});

export const workItemsSlice = createSlice({
  name: "workspaceWorkItems",
  initialState: workItemsAdapter.getInitialState({
    loading: "idle",
    error: null,
    selectedId: null,
    empty: false,
  }),
  reducers: {
    setEmpty: (state, action) => {
      state.empty = action.payload;
    },
    selectItemById: (state, { payload: { id } }) => {
      state.selectedId = id;
    },
    selectItemByIndex: (state, { payload: { index } }) => {
      const selectedId = state.ids[index];
      state.selectedId = selectedId;
    },
    nextQueueItem: (state) => {
      const currentIndex = state.ids.indexOf(state.selectedId);
      const nextId = state.ids[currentIndex + 1] || null;
      state.selectedId = nextId;
    },
    backQueueItem: (state) => {
      const currentIndex = state.ids.indexOf(state.selectedId);
      const nextId = state.ids[currentIndex - 1] || null;
      state.selectedId = nextId;
    },
    updateItemStatus: (state, action) => {
      const { id, status } = action.payload;
      workItemsAdapter.updateOne(state, {
        id,
        changes: { status, displayStatus: status },
      });
    },
    updateAllItemStatus: (state, action) => {
      const { status } = action.payload;
      const listUpdate = state.ids.map((id) => {
        return { id, changes: { status, displayStatus: status } };
      });
      workItemsAdapter.updateMany(state, listUpdate);
    },
    selectItemId(state, action) {
      state.selectedId = action.payload;
    },
    clearWorkspace: () => {
      return defaultState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkItems.pending, (state) => {
        workItemsAdapter.setAll(state, []);
        state.loading = "pending";
      })
      .addCase(fetchWorkItems.fulfilled, (state, action) => {
        workItemsAdapter.setAll(state, action.payload);
        state.loading = "fulfilled";
      })
      .addCase(fetchWorkItems.rejected, (state, action) => {
        state.loading = "fulfilled";
        state.error = action.payload;
      });
    builder
      .addCase(memberGetQueueReview.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(memberGetQueueReview.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(memberGetQueueReview.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });
  },
});

export default workItemsSlice.reducer;
