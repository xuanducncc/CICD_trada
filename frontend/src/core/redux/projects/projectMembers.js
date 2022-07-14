import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as memberApi from "../../api/memberApi";

export const fetchMembersProject = createAsyncThunk(
  "project/members",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await memberApi.getMembersProject(projectId);
      const mappedData = response.data.map((member) => ({
        ...member,
        key: member.id,
      }));
      return mappedData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateMemberActivation = createAsyncThunk(
  "projects/updateMemberActivation",
  async ({ memberId, active }, { rejectWithValue }) => {
    try {
      const response = await memberApi.updateMemberActivation({
        memberId,
        active,
      });
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        type: "error",
        message: "Cannot change member activation",
        description: "Got unexpected error while requesting server",
        notification: true,
      });
    }
  }
);

export const addMember = createAsyncThunk(
  "projects/addMember",
  async (member, { rejectWithValue }) => {
    try {
      const response = await memberApi.adminInviteMember(member);
      return { response: response.data };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        type: "error",
        message: "Cannot add new member",
        description: "Got unexpected error while add new member",
        notification: true,
      });
    }
  }
);

export const removeMember = createAsyncThunk(
  "projects/removeMember",
  async (id, { rejectWithValue }) => {
    try {
      const response = await memberApi.removeMember(id);
      return { id: id };
    } catch (err) {
      return rejectWithValue({
        type: "error",
        message: "Cannot remove member",
        description: "Got unexpected error while remove member",
        notification: true,
      });
    }
  }
);

export const fetchMember = createAsyncThunk(
  "projects/fetchMember",
  async (id, { rejectWithValue }) => {
    try {
      const response = memberApi.getMemberLists();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const projectMembersAdapter = createEntityAdapter({
  selectId: (rec) => rec.id,
});

export const projectMemberSlice = createSlice({
  name: "projectMembers",
  initialState: projectMembersAdapter.getInitialState({
    loading: "idle",
    error: null,
    requestedId: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembersProject.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = action.meta.arg.projectId;
        state.error = null;
      })
      .addCase(fetchMembersProject.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        projectMembersAdapter.addMany(state, action.payload);
      })
      .addCase(fetchMembersProject.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(addMember.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        projectMembersAdapter.addOne(state, action.payload.response);
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(removeMember.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        projectMembersAdapter.removeOne(state, action.payload.id);
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });

    builder
      .addCase(updateMemberActivation.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateMemberActivation.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        console.log('-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0', action.payload.is_active, state.entities[action.payload.member_id].is_active);
        return projectMembersAdapter.updateOne(state, {
          id: +action.payload.member_id ,
          changes: { is_active: action.payload.is_active, a: 1 },
        });
      })
      .addCase(updateMemberActivation.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching project",
        };
      });
  },
});

export default projectMemberSlice.reducer;
