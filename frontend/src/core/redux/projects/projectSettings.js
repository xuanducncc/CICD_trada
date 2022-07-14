import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";

import { getProject, createProjectSettings as createProjectSettingsApi } from "../../api/projectApi";

export const createProjectSettings = createAsyncThunk(
  "projects/createProjectSettings",
  async (settings, { rejectWithValue, dispatch }) => {
    // TODO: validate settings
    try {
      const response = await createProjectSettingsApi(settings);
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "Setting general successfully",
          description: "",
          notification: true,
        }
      };
    } catch (err) {
      return rejectWithValue({
        type: "error",
        message: "Cannot setting general for project",
        description: "Got unexpected error while setting general",
        notification: true,
      });
    }
  }
);


export const projectSettingsSlice = createSlice({
  name: "projectSettings",
  initialState: {
    loading: "idle",
    error: null,
    settings: null,
    requestedId: null,
  },
  reducers: {
    setUpdateProjectSetting: (state, action) => {
      let review_percent = state.settings?.review_percent;
      if (action.payload?.review_enable !== undefined) {
        if ((action.payload?.review_enable === false && state.settings?.review_enable === true)) {
          review_percent = 0;
        }
        if ((action.payload?.review_enable === true && state.settings?.review_enable === false)) {
          review_percent = 30;
        }
      }
      if (action.payload?.review_percent !== undefined) {
        review_percent = action.payload?.review_percent;
      }
      state.settings = {
        ...state.settings,
        ...action.payload,
        review_percent: review_percent
      };
    }
  },
  extraReducers: builder => {
    builder
      .addCase("projects/fetchProject/fulfilled", (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.settings = action.payload?.setting;
      })
    builder
      .addCase(createProjectSettings.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = null;
        state.error = null;
      })
      .addCase(createProjectSettings.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.settings = action.payload.response;
      })
      .addCase(createProjectSettings.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project"
        };
      });
  }
});

export default projectSettingsSlice.reducer;
