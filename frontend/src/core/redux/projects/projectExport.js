import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as projectApi from "../../api/projectApi";
export const exportProject = createAsyncThunk(
  "project/exportProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const data = await projectApi.exportLabel(projectId);
      return {
        data: data.data,
        notification: {
          type: "success",
          message: "Export project successfully",
          description: "",
        }
      };
    } catch (err) {
      return rejectWithValue({
        type: "error",
        message: "Cannot export Project",
        description: "Got unexpected error while export project",
        notification: true,
      });
    }
  }
);

export const projectExportSlice = createSlice({
  name: "projectSlice",
  initialState: {
    error: null,
    loading: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(exportProject.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(exportProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(exportProject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching projects",
        };
      });
  },
});

export default projectExportSlice.reducer;
