import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";
import * as userAPI from "@core/api/userApi";

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async ({ id }, { rejectWithValue, dispatch }) => {
    try {
      const response = await userAPI.getUserDetail(id);
      return response;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const fetchUserPerformance = createAsyncThunk(
  "user/fetchUserPerformance",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUserPerformance(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
)


export const userSlice = createSlice({
  name: "userDetail",
  initialState: {
    loading: "idle",
    error: null,
    user: null,
    requestedId: null
  },
  reducers: {
    resetUserDetail(state, action) {
      return {
        loading: "idle",
        error: null,
        user: null,
        userPerformance: null,
        requestedId: null
      };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.user = action.payload.data;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching user"
        };
      });
    builder
      .addCase(fetchUserPerformance.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchUserPerformance.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.userPerformance = action.payload.data;
      })
      .addCase(fetchUserPerformance.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching user"
        };
      });
  }
});

export default userSlice.reducer;
