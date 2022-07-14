import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";

import {
  createProject as createProjectApi,
  deleteProject as deleteProjectApi,
  attachProject as attachProjectApi,
  detachProject as detachProjectApi,
  createProjectFinish as createProjectFinishApi,
  createInstruction as createInstructionApi
} from "../../api/projectApi";

import {
  adminInviteMember as adminInviteMemberApi,
  removeMember as adminRemoveMemberApi,
} from "../../api/memberApi";

import { createWorkItem as createWorkItemApi } from "@core/api/workitemApi";
import { createProjectSettings } from "./projectSettings";
import { createProjectEditor } from "./projectEditor";
import { addMember, removeMember } from "./projectMembers";
import { datasetAction } from "../datasets";

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (payload, { rejectWithValue }) => {
    assert({
      id: Legalize.any(),
      name: Legalize.string().required(),
      description: Legalize.string().optional(),
    })(payload);

    try {
      const response = await createProjectApi(payload);
      return {
        response: response.data
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        type: "error",
        message: "Cannot create general information",
        description: "Got unexpected error while create general information",
        notification: true,
      });
    }
  }
);

export const attachProject = createAsyncThunk(
  "projects/attachProject",
  async (payload, { rejectWithValue }) => {
    assert({
      dataset_id: Legalize.number().integer().required(),
      project_id: Legalize.number().integer().required(),
    })(payload);
    try {
      const response = await attachProjectApi(payload);
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const detachProject = createAsyncThunk(
  "projects/detachProject",
  async (payload, { rejectWithValue, dispatch }) => {
    assert({
      dataset_id: Legalize.number().integer().required(),
      project_id: Legalize.number().integer().required(),
    })(payload);

    try {
      const response = await detachProjectApi(payload);
      await dispatch(datasetAction.fetchDataset());
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async ({ id }, { rejectWithValue }) => {
    assert(Legalize.string().numeric().required())(id);

    try {
      const response = await deleteProjectApi({ id });
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "Delete this project successfully!",
          description: "",
          notification: true,
        }
      };
    } catch (err) {
      return rejectWithValue({
        type: "error",
        message: "Cannot delete this project",
        description: "Got unexpected error while delete project",
        notification: true,
      });
    }
  }
);

const createNewProjectSettings = createAsyncThunk(
  "projects/createNewProjectSettings",
  async (settings, { rejectWithValue, dispatch }) => {
    const result = await dispatch(createProjectSettings(settings));
    if (result.error) {
      return rejectWithValue(result.error);
    }
    return result.payload.response;
  }
);

const createNewProjectEditor = createAsyncThunk(
  "projects/createNewProjectEditor",
  async (editor, { rejectWithValue, dispatch }) => {
    const result = await dispatch(createProjectEditor(editor));
    if (result.error) {
      return rejectWithValue(result.error);
    }
    return result.payload.response;
  }
);

export const createNewProjectInstruction = createAsyncThunk(
  "projects/createNewProjectInstruction",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const result = await createInstructionApi(payload);
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
)

export const requestSetCurrentStep = createAsyncThunk(
  "projects/requestSetCurrentStep",
  async (step, { getState, rejectWithValue, dispatch }) => {
    try {
      const rootState = getState();
      const state = rootState.projects.projectMutation;
      if (state.updated.info) {
        const result = await dispatch(createProject(state.info));
        if (result.error) {
          return rejectWithValue(result.error);
        }
      }
      if (state.updated.editor) {
        const result = await dispatch(createNewProjectEditor(state.editor));
        if (result.error) {
          return rejectWithValue(result.error);
        }
      }
      if (state.updated.settings) {
        const result = await dispatch(createNewProjectSettings(state.settings));
        if (result.error) {
          return rejectWithValue(result.error);
        }
      }
      return step;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addNewMember = createAsyncThunk(
  "projects/addNewMember",
  async (member, { rejectWithValue, dispatch }) => {
    try {
      const response = await dispatch(addMember(member));
      return response;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const removeNewMember = createAsyncThunk(
  "projects/removeNewMember",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await dispatch(removeMember(id));
      return { id: id };
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const createProjectFinish = createAsyncThunk(
  "projects/createProjectFinish",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const response = await createProjectFinishApi({ id });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const defaultState = {
  loading: "idle",
  error: null,
  createdId: null,
  currentStep: 0,
  totalStep: 7,
  finished: false,
  info: {
    id: null,
    name: "",
    description: null,
  },
  data: {
    project_id: null,
    attachedDatasets: [],
  },
  editor: {
    project_id: null,
  },
  instruction: {
    project_id: null,
    title: null,
    attachment: null
  },
  settings: {
    project_id: null,
    overlap_enable: true,
    overlap_percent: 30,
    overlap_time: 3,
    review_enable: true,
    review_percent: 30,
    queue_size: 10,
    review_vote: 3
  },
  members: {
    project_id: null,
    memberList: [],
  },
  updated: {
    info: false,
    data: false,
    editor: false,
    settings: false,
  },
  preview: {
    editor: {},
    editorData: {},
  },
};

export const projectMutationSlice = createSlice({
  name: "projectMutation",
  initialState: {
    loading: "idle",
    error: null,
    createdId: null,
    currentStep: 0,
    totalStep: 7,
    finished: false,
    info: {
      id: null,
      name: "",
      description: null,
    },
    data: {
      project_id: null,
      attachedDatasets: [],
    },
    editor: {
      project_id: null,
    },
    instruction: {
      project_id: null,
      title: null,
      attachment: null
    },
    settings: {
      project_id: null,
      overlap_enable: true,
      overlap_percent: 30,
      overlap_time: 3,
      review_enable: true,
      review_percent: 30,
      queue_size: 10,
      review_vote: 3
    },
    members: {
      project_id: null,
      memberList: [],
    },
    updated: {
      info: false,
      data: false,
      editor: false,
      settings: false,
    },
    preview: {
      editor: {},
      editorData: {},
    },
  },
  reducers: {
    setProjectInfo: (state, action) => {
      state.info = {
        ...state.info,
        ...action.payload,
      };
      state.updated.info = true;
    },
    setProjectEditor: (state, action) => {
      state.editor = {
        ...state.editor,
        ...action.payload,
      };
      state.updated.editor = true;
    },
    setProjectSettings: (state, action) => {
      let review_percent = state.settings.review_percent;
      if (action.payload.review_enable !== undefined) {
        if (
          action.payload.review_enable === false &&
          state.settings.review_enable === true
        ) {
          review_percent = 0;
        }
        if (
          action.payload.review_enable === true &&
          state.settings.review_enable === false
        ) {
          review_percent = 30;
        }
      }
      if (action.payload.review_percent !== undefined) {
        review_percent = action.payload.review_percent;
      }
      state.settings = {
        ...state.settings,
        ...action.payload,
        review_percent: review_percent,
      };

      state.updated.settings = true;
    },
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
    resetAllStatus: (state, action) => {
      return defaultState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        const project = action.payload.response;
        state.info = { ...project };
        state.updated.info = false;
        state.createdId = project.id;
        state.editor.project_id = project.id;
        state.data.project_id = project.id;
        state.settings.project_id = project.id;
        state.members.project_id = project.id;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(deleteProject.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(attachProject.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(attachProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.data.attachedDatasets = [
          ...state.data.attachedDatasets,
          action.payload,
        ];
        state.error = null;
      })
      .addCase(attachProject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching attack",
        };
      });

    builder
      .addCase(detachProject.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(detachProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.data.attachedDatasets = state.data.attachedDatasets.filter(
          (data) => data.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(detachProject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching detach",
        };
      });

    builder
      .addCase(requestSetCurrentStep.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(requestSetCurrentStep.fulfilled, (state, action) => {
        state.loading = state.currentStep == 5 ? "pending" : "fulfilled"
        state.currentStep = action.payload;
      })
      .addCase(requestSetCurrentStep.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while requesting to next step",
        };
      });

    builder
      .addCase(createNewProjectEditor.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createNewProjectEditor.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.editor = action.payload;
        state.updated.editor = false;
      })
      .addCase(createNewProjectEditor.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(createNewProjectInstruction.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createNewProjectInstruction.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.instruction = action.payload.response
      })
      .addCase(createNewProjectInstruction.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(createNewProjectSettings.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = null;
        state.error = null;
      })
      .addCase(createNewProjectSettings.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.settings = action.payload;
        state.updated.settings = false;
      })
      .addCase(createNewProjectSettings.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(addNewMember.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(addNewMember.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.members.memberList =
          action.payload.payload?.response.status !== "Exist user"
            ? [...state.members.memberList, action.payload.payload.response]
            : state.members.memberList;
        state.updated.editor = false;
      })
      .addCase(addNewMember.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(removeNewMember.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(removeNewMember.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.members.memberList = state.members.memberList.filter(
          (member) => member.id !== action.payload.id
        );
      })
      .addCase(removeNewMember.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(createProjectFinish.fulfilled, (state) => {
        state.loading = "fulfilled";
      })
      .addCase(createProjectFinish.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload.response.data.Error
          ? action.payload.response.data.Error[0]
          : "Can not create empty project!";
      });
  },
});

export default projectMutationSlice.reducer;
