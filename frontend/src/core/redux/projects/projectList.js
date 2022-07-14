import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";

import { getProjects } from "../../api/projectApi";
import { fetchProject } from "./projectDetail";
import { PROJECT_LIST_TYPES } from "@utils/const";

export const projectListAdapter = createEntityAdapter({});

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // throw new Error("Lỗi")
      const response = await getProjects(payload);
      return response.data;
    } catch (err) {
      // console.error(err);
      return rejectWithValue({
        type:"error",
        message: "Failed to fetch projects",
        description: err.message,
        notification: true,
      });
    }
  }
);

export const updateProjectsOptions = createAction(
  "projects/updateProjectsOptions"
);

export const syncProjectsOptions = createAsyncThunk(
  "projects/syncProjectsOptions",
  async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(updateProjectsOptions(payload));
      dispatch(fetchProjects(payload));
    } catch (err) {
      return rejectWithValue({
        message: "Failed to fetch projects",
        description: err.message,
      });
    }
  }
);

export const projectListSlice = createSlice({
  name: "projectList",
  initialState: projectListAdapter.getInitialState({
    loading: "idle",
    error: null,
    options: {
      listType: PROJECT_LIST_TYPES.ALL,
    },
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        projectListAdapter.setAll(state, action.payload);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching projects",
        };
      });
    builder.addCase(updateProjectsOptions, (state, action) => {
      state.options = {
        ...state.options,
        ...action.payload,
      };
    });
  },
});

export default projectListSlice.reducer;
