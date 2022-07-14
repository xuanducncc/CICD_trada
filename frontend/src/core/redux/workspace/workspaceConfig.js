import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectsActions } from "../projects";
import { fetchWorkItems, workItemsSlice } from "./workspaceWorkItems";
import * as workItemApi from "../../api/workitemApi";
import {
  PROJECT_MEMBER_ROLES,
  WORKSPACE_MODE,
  WORK_ITEM_STATUS,
} from "@utils/const";
import { workspaceDataSlice } from "./workspaceData";

export const fetchWorkspaceEditor = createAsyncThunk(
  "workspace/fetchWorkspaceEditor",
  async ({ projectId }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(
      projectsActions.requestEditorProjectId({ projectId })
    );
    if (result.error) {
      return rejectWithValue(result.error);
    }
    return result.payload;
  }
);

export const initWorkspace = createAsyncThunk(
  "workspace/initWorkspace",
  async (
    { projectId, queueId, workItemId, status, role, mode, page, label, id },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(workItemsSlice.actions.clearWorkspace());

      const projectResult = await dispatch(
        projectsActions.requestProjectId({ id: projectId })
      );
      if (projectResult.error) {
        return rejectWithValue(projectResult.payload);
      }
      const editorResult = await dispatch(fetchWorkspaceEditor({ projectId }));
      if (editorResult.error) {
        return rejectWithValue(editorResult.payload);
      }
      const member = projectResult.payload.member;
      if (!member) {
        return rejectWithValue({
          message: "member is not join project",
        });
      }
      const memberId = projectResult.payload.member.id;
      const memberRole = projectResult.payload.member.role;
      const isProjectAdmin =
        memberRole?.some((role) => role.name === PROJECT_MEMBER_ROLES.ADMIN) ??
        false;

      const workItemsResult = await dispatch(
        fetchWorkItems({
          projectId,
          memberId: isProjectAdmin ? undefined : memberId,
          queueId,
          status,
          role,
          mode,
          page,
          label,
          id,
        })
      );

      if (workItemsResult.error) {
        return rejectWithValue(workItemsResult.payload);
      }

      const workItems = workItemsResult.payload;

      const defaultItem = workItems.find((it) => {
        if (workItemId) {
          return it.id === +workItemId;
        }
        if (mode === WORKSPACE_MODE.ANNOTATION) {
          return it.workStatus === WORK_ITEM_STATUS.PENDING;
        }
        if (mode === WORKSPACE_MODE.REVIEW) {
          return it.workStatus === WORK_ITEM_STATUS.REVIEWING;
        }
        if (mode === WORKSPACE_MODE.VERIFY) {
          return it.workStatus === WORK_ITEM_STATUS.VALIDATION;
        }
        return true;
      });

      if (
        (mode === WORKSPACE_MODE.REVIEW ||
          mode === WORKSPACE_MODE.VERIFY ||
          mode === WORKSPACE_MODE.ANNOTATION) &&
        !defaultItem
      ) {
        dispatch(workItemsSlice.actions.setEmpty(true));
      } else {
        dispatch(workItemsSlice.actions.setEmpty(false));
      }
      const [firstItem] = workItems;
      if (defaultItem || firstItem) {
        dispatch(
          workItemsSlice.actions.selectItemById(defaultItem || firstItem)
        );
      }

      return {
        editor: editorResult.payload,
        member: projectResult.payload.member,
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        type: "error",
        message: "Error creating workspace",
        description: "Please try again",
        notification: true,
      });
    }
  }
);

export const requestQueue = createAsyncThunk(
  "workspace/requestQueue",
  async ({ memberId, projectId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.requestQueue(memberId);
      dispatch(workspaceDataSlice.actions.setIsFinished());
      return response.data;
    } catch (err) {
      if (err?.response?.status === 412) {
        return {
          isExist: true,
          queueId: err?.response?.data?.queue_label_id,
        };
      }

      if (err?.response?.status === 409) {
        return rejectWithValue({
          message: "Finished queue.",
          isFinished: true,
        });
      }

      return rejectWithValue({
        message: "Cannot request queue",
      });
    }
  }
);

export const requestQueueReview = createAsyncThunk(
  "workspace/requestQueueReview",
  async ({ memberId, projectId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await workItemApi.memberGetQueueReview(memberId);
      dispatch(workspaceDataSlice.actions.setIsFinished());
      return response.data;
    } catch (err) {
      if (err?.response?.status === 412) {
        return {
          isExist: true,
          queueId: err?.response?.data?.queue_review_id,
        };
      }

      if (err?.response?.status === 409) {
        return rejectWithValue({
          message: "Finished queue.",
          isFinished: true,
        });
      }

      return rejectWithValue({
        message: "Cannot request queue",
      });
    }
  }
);

export const workspaceConfigSlice = createSlice({
  name: "config",
  initialState: {
    editor: null,
    member: null,
    loading: "idle",
    isFinished: false,
    error: null,
  },
  reducers: {
    setEditor: (state, action) => {
      state.editor = action.payload;
    },
    resetWorkspaceConfig: (state, action) => {
      return {
        editor: null,
        member: null,
        loading: "idle",
        isFinished: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaceEditor.fulfilled, (state, action) => {
      state.editor = action.payload;
    });

    builder
      .addCase(initWorkspace.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(initWorkspace.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.member = action.payload.member;
        state.error = null;
        state.isFinished = false;
      })
      .addCase(initWorkspace.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });

    builder
      .addCase(requestQueue.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(requestQueue.rejected, (state, action) => {
        if (action.payload.isFinished) {
          state.isFinished = true;
        }
      });

    builder
      .addCase(requestQueueReview.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(requestQueueReview.rejected, (state, action) => {
        if (action.payload.isFinished) {
          state.isFinished = true;
        }
      });
  },
});

export default workspaceConfigSlice.reducer;
