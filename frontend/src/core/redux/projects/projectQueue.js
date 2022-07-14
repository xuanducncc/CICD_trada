import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as workItemApi from "@core/api/workitemApi";
import { MEMBER_WORK_ITEM_ROLES } from "@utils/const";

// Since we don't provide `selectId`, it defaults to assuming `entity.id` is the right field
export const projectQueueAdapter = createEntityAdapter({});

export const fetchProjectQueue = createAsyncThunk(
  "project/fetchProjectQueue",
  async (
    { memberId, projectId, queueId, status, page, label },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await workItemApi.getMyWorkItems({
        memberId,
        projectId,
        queueId,
        status,
        page,
        label,
      });

      const totalItems = +response.headers["pagination-count"];
      const totalPages = +response.headers["pagination-limit"];
      const currentPage = +response.headers["pagination-page"];
      const workItems = response.data?.map((workItem, index) => {
        const myMemberWorkItem =
          workItem.memberworkitem?.find((mw) => mw.member_id === memberId) ??
          null;
        const labelerMemberWorkItem =
          workItem.memberworkitem?.find(
            (mw) => mw.role === MEMBER_WORK_ITEM_ROLES.LABELER
          ) ?? null;
        return {
          ...workItem,
          myMemberWorkItem,
          labelerMemberWorkItem,
          index: index + 1,
        };
      });

      return { workItems, totalItems, totalPages, currentPage };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to fetch projects",
        description: err.message,
      });
    }
  }
);

export const acceptWorkItem = createAsyncThunk(
  "project/acceptWorkItem",
  async ({ ids }, { rejectWithValue, dispatch }) => {
    try {
      const response = {};
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to acceptWork item",
        description: err.message,
      });
    }
  }
);

export const rejectWorkItem = createAsyncThunk(
  "project/rejectWorkItem",
  async ({ ids }, { rejectWithValue, dispatch }) => {
    try {
      const response = {};
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to acceptWork item",
        description: err.message,
      });
    }
  }
);

export const projectQueueSlice = createSlice({
  name: "projectQueues",
  initialState: projectQueueAdapter.getInitialState({
    loading: "idle",
    selectedId: null,
    error: null,
    status: null,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  }),
  reducers: {
    selectQueueItem(state, action) {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectQueue.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProjectQueue.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.status = action.meta.arg.status;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        projectQueueAdapter.setAll(state, action.payload.workItems);
        if (state.ids.length > 0) {
          state.selectedId = state.ids[0];
        }
      })
      .addCase(fetchProjectQueue.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching queue",
        };
      });
  },
});

export default projectQueueSlice.reducer;
