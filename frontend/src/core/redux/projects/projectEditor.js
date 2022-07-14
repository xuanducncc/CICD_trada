import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as yum from "yup";
import {
  createEditor as createEditorApi,
  fetchEditor as fetchEditorEditorApi,
  updateEditor as updateEditorApi,
} from "@core/api/editorApi";

export const fetchEditor = createAsyncThunk(
  "projects/fetchEditor",
  async ({ projectId }, { rejectWithValue, dispatch }) => {
    yum.number().integer().positive().validateSync(projectId);

    try {
      const response = await fetchEditorEditorApi({ projectId });
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to fetch projects",
        description: err.message,
      });
    }
  }
);

export const createProjectEditor = createAsyncThunk(
  "projects/createProjectEditor",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await createEditorApi(payload);
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "Create editor successfully",
          description: "",
          notification: true,
        }
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        type: "error",
        message: "Failed to create editor",
        description: err.message,
      });
    }
  }
);

export const requestEditorProjectId = createAsyncThunk(
  "projects/requestEditorProjectId",
  async ({ projectId, useCache }, { getState, dispatch, rejectWithValue }) => {
    const { requestedId } = getState();
    if (requestedId !== projectId || !useCache) {
      const result = await dispatch(fetchEditor({ projectId }));
      return result.payload;
    } else {
      return rejectWithValue({
        message: "project already requested",
      });
    }
  }
);

export const updateProjectEditor = createAsyncThunk(
  "projects/updateProjectEditor",
  async ({ editor, projectId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateEditorApi({ editor, projectId });
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to fetch projects",
        description: err.message,
      });
    }
  }
);

export const projectEditorSlice = createSlice({
  name: "projectEditor",
  initialState: {
    loading: "idle",
    error: null,
    requestedId: null,
    editor: null,
  },
  reducers: {
    setProjectEditor: (state, action) => {
      state.editor = {
        ...state.editor,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProjectEditor.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createProjectEditor.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.editor = action.payload.response;
      })
      .addCase(createProjectEditor.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(updateProjectEditor.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateProjectEditor.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.editor = action.payload;
      })
      .addCase(updateProjectEditor.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(fetchEditor.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = action.meta.arg.projectId;
        state.error = null;
      })
      .addCase(fetchEditor.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.editor = action.payload;
      })
      .addCase(fetchEditor.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });
  },
});

export default projectEditorSlice.reducer;
