import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";
import {
  adminAcceptJoinRequest,
  memberJoinProject,
  memberJoinRequest,
  changeRoleMember
} from "@core/api/memberApi";
import * as projectApi from "../../api/projectApi";
import { projectMemberSlice, fetchMembersProject } from "./projectMembers";

export const fetchProject = createAsyncThunk(
  "projects/fetchProject",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const response = await projectApi.getProject(id);
      dispatch(fetchListInstruction(id));
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: err?.response?.data?.error?.message ?? 'Error while fetching project',
      });
    }
  }
);

export const fetchListInstruction = createAsyncThunk(
  "projects/fetchListInstruction",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await projectApi.fetchListInstruction(id);
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: err?.response?.data?.error?.message ?? 'Error while fetching instruction',
      });
    }
  }
);

export const fetchItemInstruction = createAsyncThunk(
  "projects/fetchItemInstruction",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await projectApi.fetchItemInstruction(id);
      return response;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: err?.response?.data?.error?.message ?? 'Error while fetching instruction',
      });
    }
  }
);

export const updateProjectInstruction = createAsyncThunk(
  "projects/updateProjectInstruction",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const result = await projectApi.createInstruction(payload);
      return {
        response: result.data,
        notification: {
          type: "success",
          message: "Update instruction successfully!",
          notification: true,
        }
      };
    } catch (err) {
      return rejectWithValue({
        type: "error",
        message: "Cannot update instruction",
        description: "Please check your file",
        notification: true,
      })
    }
  }
);

export const onHandleStatusInvite = createAsyncThunk(
  "projects/onHandleStatusInvite",
  async (status, { rejectWithValue, dispatch }) => {
    try {
      const response = await memberJoinProject(status);
      if (response) {
        const id = status.project_id;
      }
    } catch (err) {
      const description = err?.response?.data?.error?.message ?? 'Please try again later';
      return rejectWithValue({
        type: 'error',
        message: 'Cannot join project',
        description,
        notification: true
      });
    }
  }
);

export const onHandleJoinRequestProject = createAsyncThunk(
  "project/handleJoinRequest",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await memberJoinRequest(payload);
      if (response) {
        const id = payload.project_id;
        dispatch(fetchProject({ id }));
      }
    } catch (err) {
      const description = err?.response?.data?.error?.message ?? 'Please try again later';
      return rejectWithValue({
        type: 'error',
        message: 'Cannot join project',
        description,
      });
    }
  }
);

export const onHandleAcceptJoinRequestProject = createAsyncThunk(
  "project/handleAcceptJoinRequest",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await adminAcceptJoinRequest(payload);
    } catch (err) {
      const description = err?.response?.data?.error?.message ?? 'Please try again later';
      return rejectWithValue({
        type: 'error',
        message: 'Cannot join project',
        description,
      });
    }
  }
);

export const onChangeRoleMember = createAsyncThunk(
  "project/changeRoleMember",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await changeRoleMember(payload);
    } catch (err) {
      const description = err?.response?.data?.error?.message ?? 'Please try again later';
      return rejectWithValue({
        type: 'error',
        message: 'Cannot join project',
        description,
      });
    }
  }
);

export const exportLabelItem = createAsyncThunk(
  "project/exportLabelItem",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await projectApi.exportLabel(projectId);
      return response;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const projectSlice = createSlice({
  name: "projectDetail",
  initialState: {
    loading: "idle",
    error: null,
    project: null,
    requestedId: null,
    preview: {
      editorDetail: {},
      editorDataDetail: {},
    },
    instruction_item: null,
    instruction_list: []
  },
  reducers: {
    setRquestedId: (state, action) => {
      state.requestedId = null;
    },
    setPreviewSetting: (state, action) => {
      state.preview = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.project = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(fetchListInstruction.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchListInstruction.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.instruction_list = action.payload;
      })
      .addCase(fetchListInstruction.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(fetchItemInstruction.pending, (state, action) => {
        // state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchItemInstruction.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.instruction_item = action.payload;
      })
      .addCase(fetchItemInstruction.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(updateProjectInstruction.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateProjectInstruction.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(updateProjectInstruction.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(onHandleStatusInvite.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(onHandleStatusInvite.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.project = action.payload;
      })
      .addCase(onHandleStatusInvite.rejected, (state, action) => {
        state.loading = "rejected";
      });
    builder
      .addCase(onHandleJoinRequestProject.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(onHandleJoinRequestProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.project = action.payload;
      })
      .addCase(onHandleJoinRequestProject.rejected, (state, action) => {
        state.loading = "rejected";
      });
    builder
      .addCase(onHandleAcceptJoinRequestProject.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(onHandleAcceptJoinRequestProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(onHandleAcceptJoinRequestProject.rejected, (state, action) => {
        state.loading = "rejected";
      });
    builder
      .addCase(onChangeRoleMember.pending, (state, action) => {
        // state.loading = "pending";
        state.error = null;
      })
      .addCase(onChangeRoleMember.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(onChangeRoleMember.rejected, (state, action) => {
        state.loading = "rejected";
      });
    builder
      .addCase(exportLabelItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
  },
});

export default projectSlice.reducer;
