import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as projectApi from "@core/api/projectApi";
import * as workItemApi from "@core/api/workitemApi";
import { WORK_ITEM_STATUS } from "@utils/const";

// Since we don't provide `selectId`, it defaults to assuming `entity.id` is the right field
export const projectActivitiesAdapter = createEntityAdapter({
});

export const fetchLogActivities = createAsyncThunk(
  "project/fetchLogActivities",
  async ({ projectId, memberId, page }, { rejectWithValue }) => {
    try {
      const response = await projectApi.getLogWorkItem({ projectId, memberId, page });

      const activities = response.data;
      const totalItems = +response.headers["pagination-count"];
      const totalPages = +response.headers["pagination-limit"];
      const currentPage = +response.headers["pagination-page"];

      return { activities, totalItems, totalPages, currentPage};
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const projectActivitiesSlice = createSlice({
  name: "projectActivities",
  initialState: projectActivitiesAdapter.getInitialState({
    loading: "idle",
    error: null,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    requestedIds: {},
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogActivities.pending, (state, action) => {
        state.loading = "pending";
        const requestedId = action.meta.arg.memberId || "all";
        state.requestedIds[requestedId] = requestedId;
        state.error = null;
      })
      .addCase(fetchLogActivities.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        const activities = action.payload.activities;
        projectActivitiesAdapter.setAll(state, activities);

        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;

      })
      .addCase(fetchLogActivities.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching projects",
        };
      });
  },
});

export default projectActivitiesSlice.reducer;
