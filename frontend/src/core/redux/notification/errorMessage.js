
import { Typography, Space } from "antd";
import React from "react";

import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import { uuid } from "@utils/uuid";

export const ErrorAdapter = createEntityAdapter({
  selectId: (oneError) => oneError.id,
});

const notificationMessage = createSlice({
  name: "notificationMessage",
  initialState: ErrorAdapter.getInitialState({}),
  reducers: {
    addNotification(state, action) {
      const notification = {
        id: action.payload.id || uuid(),
        ...action.payload,
      };
      ErrorAdapter.upsertOne(state, {  ...notification, id: 'latest', });
      ErrorAdapter.upsertOne(state, notification);
    },
  },
});

export const { addNotification } = notificationMessage.actions;

export default notificationMessage.reducer;
