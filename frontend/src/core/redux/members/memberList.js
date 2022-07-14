import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";

import { getProject } from "../../api/projectApi";
import { dataMember } from "./fakeData";
import { getMemberLists } from "@core/api/memberApi"

export const fetchMember = createAsyncThunk(
  "members/fetchMember",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // const response = await dataMember();
      const response = await getMemberLists();
      return response.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        message: "Failed to fetch projects",
        description: err.message
      });
    }
  }
);

export const memberSlice = createSlice({
  name: "memberDetailt",
  initialState: {
    loading: "idle",
    error: null,
    members: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMember.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchMember.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.members = action.payload;
      })
      .addCase(fetchMember.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching members"
        };
      });
  }
});

export default memberSlice.reducer;
