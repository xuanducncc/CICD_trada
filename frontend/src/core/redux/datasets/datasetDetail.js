import { assert } from "@utils/assert";
import * as yup from "yup";
import { dataDataset } from "./fakeData";
import { getDatasetDetail } from "../../api/datasetApi";

const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

export const fetchDatasetById = createAsyncThunk(
  "datasets/fetchDatasetById",
  async ({ id }, { rejectWithValue, dispatch }) => {
    yup.number().validateSync(id);

    try {
      const response = await getDatasetDetail(+id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const requestDatasetId = createAsyncThunk(
  "datasets/requestDatasetId",
  async ({ id, useCache }, { getState, dispatch, rejectWithValue }) => {
    return await dispatch(fetchDatasetById({ id }));
  }
);

export const datasetSlice = createSlice({
  name: "datasetDetail",
  initialState: {
    loading: "idle",
    error: null,
    dataset: null,
    requestedId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDatasetById.fulfilled, (state, action) => {
      state.error = null;
      state.dataset = action.payload;
    });

    builder
      .addCase(requestDatasetId.pending, (state, action) => {
        state.loading = "pending";
        state.requestedId = action.meta.arg.id;
      })
      .addCase(requestDatasetId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(requestDatasetId.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });
  },
});

export default datasetSlice.reducer;
