import {
    createEntityAdapter,
    createSlice,
    createSelector,
    createAsyncThunk
  } from "@reduxjs/toolkit";
  import * as yup from "yup";
  import { assert } from "@utils/assert";

  import { getProject } from "../../api/projectApi";
  import { dataMember } from "./fakeData";

  export const fetchMember = createAsyncThunk(
    "projects/fetchMember",
    async ({ id }, { rejectWithValue, dispatch }) => {
      // assert({
      //   id: Legalize.string()
      //     .numeric()
      //     .required()
      // })({ id });

      try {
        const response = await dataMember();
        return response.members.find(r => r.id ==id);
      } catch (err) {
        console.error(err);
        return rejectWithValue(err);
      }
    }
  );

  export const requestMemberId = createAsyncThunk(
    "projects/requestMemberId",
    async (payload, { getState, dispatch, rejectWithValue }) => {
      // assert(
      //   Legalize.object().keys({
      //     id: Legalize.string()
      //       .numeric()
      //       .required(),
      //     useCache: Legalize.bool().optional()
      //   })
      // )(payload);

      const { requestedId } = getState();
      const { id, useCache } = payload;
      if (requestedId !== id || !useCache) {
        await dispatch(fetchMember({ id }));
      } else {
        rejectWithValue({
          message: "member already requested"
        });
      }
    }
  );

  export const memberSlice = createSlice({
    name: "memberDetailt",
    initialState: {
      loading: "idle",
      error: null,
      member: null,
      requestedId: null
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
          state.member = action.payload;
        })
        .addCase(fetchMember.rejected, (state, action) => {
          state.loading = "rejected";
          state.error = {
            message: "Error while fetching member"
          };
        });
    }
  });

  export default memberSlice.reducer;
