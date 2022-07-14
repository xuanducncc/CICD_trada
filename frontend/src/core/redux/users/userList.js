import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";

import * as userApi from "@core/api/userApi";

export const userListAdapter = createEntityAdapter({
});

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await userApi.getUserList();
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to fetch users",
        description: err.message
      });
    }
  }
);

export const userListSlice = createSlice({
  name: "userList",
  initialState: userListAdapter.getInitialState({
    loading: "idle",
    error: null,
    users: [],
  }),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        userListAdapter.setAll(state, action.payload);
        // state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching users"
        };
      })
  }
});


export default userListSlice.reducer;
