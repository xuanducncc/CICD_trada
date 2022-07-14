import {
    createEntityAdapter,
    createSlice,
    createSelector,
    createAsyncThunk
  } from "@reduxjs/toolkit";

  import { getDatasets } from "../../api/datasetApi";
  import { dataDataset } from "./fakeData";

  export const fetchDataset = createAsyncThunk(
    "datasets/fetchDataset",
    async (payload, { rejectWithValue, dispatch }) => {
      try {
        const response = await getDatasets();
        return response.data;
      } catch (err) {
        console.error(err);
        return rejectWithValue({
          message: "Failed to fetch datasets",
          description: err.message
        });
      }
    }
  );

  export const datasetListSlice = createSlice({
    name: "datasetList",
    initialState: {
      loading: "idle",
      error: null,
      datasets: null,
    },
    reducers: {},
    extraReducers: builder => {
      builder
        .addCase(fetchDataset.pending, (state, action) => {
          state.loading = "pending";
          state.error = null;
        })
        .addCase(fetchDataset.fulfilled, (state, action) => {
          state.loading = "fulfilled";
          state.error = null;
          state.datasets = action.payload;
        })
        .addCase(fetchDataset.rejected, (state, action) => {
          state.loading = "rejected";
          state.error = {
            message: "Error while fetching datasets"
          };
        });
    }
  });

  export default datasetListSlice.reducer;
