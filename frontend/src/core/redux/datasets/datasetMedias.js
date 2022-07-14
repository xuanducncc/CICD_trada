import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getDatasetMedias, getDatasetDetail } from "../../api/datasetApi";

export const fetchDatasetMedias = createAsyncThunk(
  "datasets/fetchDatasetMedias",
  async ({ datasetId, page }, { rejectWithValue, dispatch }) => {
    try {
      const response = await getDatasetMedias({ datasetId, page });
      const { data } = response;
      const pageSize = 10;
      const totalItems = +response.headers["pagination-count"];
      const totalPages = +response.headers["pagination-limit"];
      const currentPage = +response.headers["pagination-page"];
      const mappedData = data.map((dat, index) => ({
        ...dat,
        index: currentPage * pageSize + index + 1,
        name: (dat?.image ?? "unnamed").split("/").pop(),
      }));
      const items = mappedData;

      return { items, totalItems, totalPages, currentPage };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// Since we don't provide `selectId`, it defaults to assuming `entity.id` is the right field
export const datasetMediasAdapter = createEntityAdapter({});

export const datasetMediasSlice = createSlice({
  name: "datasetMedias",
  initialState: datasetMediasAdapter.getInitialState({
    loading: "idle",
    error: null,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    requestedId: {},
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasetMedias.pending, (state, action) => {
        state.loading = "pending";
        const requestedId = action.meta.arg.memberId || "all";
        state.requestedId = requestedId;
        state.error = null;
      })
      .addCase(fetchDatasetMedias.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        datasetMediasAdapter.setAll(state, action.payload.items);
      })
      .addCase(fetchDatasetMedias.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching projects",
        };
      });
  },
});

export default datasetMediasSlice.reducer;
