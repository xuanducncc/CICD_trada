import {
  createAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { obtainToken, logout, signUp } from "../../api/authenticationApi";
import * as loggerApi from "@core/api/loggerApi";

export const createActionLog = createAsyncThunk(
  "logger/createActionLog",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loggerApi.createActionLog(payload);
      return response.data;
    } catch (error) {
      console.error("Error creating action log. ", error);
      return rejectWithValue(error);
    }
  }
);

const loggerSlice = createSlice({
  initialState: {
    user: null,
    loading: "idle",
  },
  name: "auth",
  reducers: {},
  extraReducers: (builder) => {},
});

export default loggerSlice.reducer;

export const loggerActions = {};

export const createActionLogMiddleWare = (factory) => {
  return ({ getState, dispatch }) => (next) => (action) => {
    try {
      const payload = factory(action, getState);
      if (payload) {
        dispatch(createActionLog(payload));
      }
    } catch (e) {
      console.error("Failed to create action log.", e);
    }

    return next(action);
  };
};

// SELECTORS
const selectLogger = (state) => state.logger;

export const loggerSelectors = {};
