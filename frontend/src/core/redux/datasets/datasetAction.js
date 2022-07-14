import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk
} from "@reduxjs/toolkit";
import * as yup from "yup";
import { assert } from "@utils/assert";

import {
  createDataset as createDatasetApi,
  deleteDataset as deleteDatasetApi,
  uploadDataset as uploadDatasetApi,
  uploadDatasetZip as uploadDatasetZipApi
} from "../../api/datasetApi";

export const createDataset = createAsyncThunk(
  "datasets/createDataset",
  async (payload, { rejectWithValue }) => {
    yup.object().shape({
      name: yup.string().required(),
      projects: yup.array().of(
        yup.number(),
      )
    }).validateSync(payload);

    try {
      const response = await createDatasetApi(payload);
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "Create dataset successfully",
          description: "",
          notification: true,
        }
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        type: "error",
        message: "Cannot create dataset",
        description: "Got unexpected error while create dataset",
        notification: true,
      });
    }
  }
);
export const uploadDataset = createAsyncThunk(
  "datasets/uploadDataset",
  async (payload, { rejectWithValue }) => {
    try {

      const response = await uploadDatasetApi(payload);
      return response.data;
    } catch (err) {
      return rejectWithValue({ err });
    }
  }
);

export const uploadDatasetZip = createAsyncThunk(
  "datasets/uploadDatasetZip",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await uploadDatasetZipApi(payload);
      return {
        notification: {
          notification: true,
          type: "success",
          message: "upload zip file successfully"
        }
      };
    } catch (err) {
      return rejectWithValue({ err });
    }
  }
);

export const deleteDataset = createAsyncThunk(
  "datasets/deleteDataset",
  async ({ datasetId }, { rejectWithValue }) => {
    yup.number().validateSync(datasetId);

    try {
      const response = await deleteDatasetApi(datasetId);
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "Delete this dataset successfully",
          description: "",
          notification: true,
        }
      };
    } catch (err) {
      console.error(err);
      return rejectWithValue({
        type: "error",
        message: "Cannot delete dataset",
        description: "Got unexpected error while delete dataset",
        notification: true,
      });
    }
  }
);

export const datasetSlice = createSlice({
  name: "datasetAction",
  initialState: {
    loading: "idle",
    error: null,
    requestedId: null,
    numFileSuccess: 0,
    numFileError: 0
  },
  reducers: {
    resetNumfile: (state, action) => {
      state.numFileError = 0;
      state.numFileSuccess = 0;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createDataset.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createDataset.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.createDataset = action.payload;
      })
      .addCase(createDataset.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching dataset"
        };
      });

    builder
      .addCase(deleteDataset.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(deleteDataset.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      })
      .addCase(deleteDataset.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching dataset"
        };
      });

    builder
      .addCase(uploadDataset.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(uploadDataset.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.numFileSuccess = state.numFileSuccess + 1;
      })
      .addCase(uploadDataset.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching dataset"
        };
        state.numFileError = state.numFileError + 1
      });
    builder
      .addCase(uploadDatasetZip.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(uploadDatasetZip.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.numFileSuccess = state.numFileSuccess + 1;
      })
      .addCase(uploadDatasetZip.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching dataset"
        };
        state.numFileError = state.numFileError + 1
      });
  }
});

export default datasetSlice.reducer;
