import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as workItemApi from "@core/api/workitemApi";
import { QUEUE_STATUS, WORK_ITEM_STATUS } from "@utils/const";

// Since we don't provide `selectId`, it defaults to assuming `entity.id` is the right field
export const projectBatchAdapter = createEntityAdapter({});

export const fetchProjectBatch = createAsyncThunk(
  "project/fetchProjectBatch",
  async (
    { memberId, projectId, status = QUEUE_STATUS.VALIDATION, page = 1 },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await workItemApi.getQueueList({
        memberId,
        projectId,
        status,
        page,
      });

      const items = response.data;
      const totalItems = +response.headers["pagination-count"];
      const totalPages = +response.headers["pagination-limit"];
      const currentPage = +response.headers["pagination-page"];

      return { items, totalItems, totalPages, currentPage };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to fetch projects",
        description: err.message,
      });
    }
  }
);

export const projectBatchSlice = createSlice({
  name: "projectBatch",
  initialState: projectBatchAdapter.getInitialState({
    loading: "idle",
    error: null,
    status: null,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectBatch.pending, (state, action) => {
        state.loading = "pending";
        state.status = action.meta.arg.status;
        state.error = null;
      })
      .addCase(fetchProjectBatch.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        projectBatchAdapter.setAll(state, action.payload.items);

        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProjectBatch.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching queue",
        };
      });
  },
});

export default projectBatchSlice.reducer;
