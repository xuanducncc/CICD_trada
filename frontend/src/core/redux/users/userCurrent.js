import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";

import { getUserCurrent } from "../../api/userApi";

export const fetchUserCurrent = createAsyncThunk(
  "users/fetchUserCurrent",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await getUserCurrent();
      return response.data;
    } catch (err) {
      console.error(err);
      const message = err.title || "Error while fetching current user";
      const description =
        err?.response?.data?.error?.message ?? err?.message ?? "Unexpected error";
      return rejectWithValue({
        message,
        description,
      });
    }
  }
);

export const userSlice = createSlice({
  name: "userCurrent",
  initialState: {
    loading: "idle",
    error: null,
    user: null,
    requestedId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCurrent.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = "me";
        state.error = null;
      })
      .addCase(fetchUserCurrent.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.user = action.payload;
      })
      .addCase(fetchUserCurrent.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching user",
        };
      });
  },
});

export default userSlice.reducer;
