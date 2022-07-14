import {
  createEntityAdapter,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";
import * as projectApi from "../../api/projectApi";
import { dateRange } from "@utils/date";

export const fetchProjectOverview = createAsyncThunk(
  "projects/fetchProjectOverview",
  async ({ projectId, id }, { rejectWithValue }) => {
    try {
      const response = await projectApi.getProjectOverview({ projectId, id });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchLogLabeledItem = createAsyncThunk(
  "project/fetchLogLabeledItem",
  async ({ projectId, id }, { rejectWithValue }) => {
    try {
      const response = await projectApi.getLogLabeledItem({ projectId, id });
      const { data } = response;
      let total = 0;
      for (const item of data.LabeledItem_Count) {
        total += item.count;
        item.total = total;
      }
      const mappedData = data;
      return mappedData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchProjectPerformance = createAsyncThunk(
  "project/fetchProjectPerformance",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await projectApi.getProjectPerformance({ projectId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchMemberPerformance = createAsyncThunk(
  "project/fetchMemberPerformance",
  async ({ memberId }, { rejectWithValue }) => {
    try {
      const response = await projectApi.getMemberPerformance({ memberId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchProjectLabeledHistory = createAsyncThunk(
  "project/fetchProjectLabeledHistory",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const response = await projectApi.getProjectLabeledHistory({ projectId });
      const mappedData = response.data;
      const totalMap = {};
      const dateMap = {};
      let startDate = null;
      let endDate = null;

      for (const elm of mappedData) {
        const memberMap = {};
        for (const stats of elm.members) {
          const memberId = stats.member.id;
          const total = (totalMap[memberId] || 0) + stats.count;
          totalMap[memberId] = total;
          stats.total = total;
          memberMap[memberId] = stats;
        }
        elm.memberMap = memberMap;
        dateMap[elm.date] = elm;

        if (!startDate && elm.date < startDate) {
          startDate = elm.date;
        }

        if (!endDate && elm.date > endDate) {
          endDate = elm.date;
        }
      }
      const range = dateRange(startDate, endDate);
      const filledData = [];

      for (const day of range) {
        const dayStr = day.toISOString();
        const existedData = dateMap[dayStr];
        if (existedData) {
          filledData.push(existedData);
        } else {
          const previousData = filledData[filledData.length - 1];
          filledData.push({
            date: dayStr,
            ...previousData,
          });
        }
      }

      return mappedData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const projectDataSlice = createSlice({
  name: "projectData",
  initialState: {
    requestedId: null,
    overview: null,
    loading: "idle",
    error: null,
    memberStats: {},
    activities: {},
    projectPerformance: {},
    memberPerformance: {},
    listStats: [],
    history: null,
  },
  reducers: {
    resetListStat: (state, action) => {
      state.listStats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectOverview.pending, (state, action) => {
        state.requestedId = action.meta.arg.id;
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProjectOverview.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.overview = action.payload;
      })
      .addCase(fetchProjectOverview.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching projects",
        };
      });

    builder
      .addCase(fetchProjectPerformance.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProjectPerformance.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.projectPerformance = action.payload;
      })
      .addCase(fetchProjectPerformance.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });

    builder
      .addCase(fetchMemberPerformance.pending, (state, action) => {
        state.requestedId = action.meta.arg.id;
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchMemberPerformance.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.memberPerformance = action.payload;
      })
      .addCase(fetchMemberPerformance.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });
    builder
      .addCase(fetchLogLabeledItem.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchLogLabeledItem.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.memberStats = action.payload.member_id
          ? {
              ...state.memberStats,
              ...{ [String(action.payload.member_id)]: action.payload },
            }
          : { ...state.memberStats, ...{ all: action.payload } };
        state.listStats = [...state.listStats, action.payload];
      })
      .addCase(fetchLogLabeledItem.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching projects",
        };
      });
    builder
      .addCase(fetchProjectLabeledHistory.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProjectLabeledHistory.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
        state.history = action.payload;
      })
      .addCase(fetchProjectLabeledHistory.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = {
          message: "Error while fetching projects",
        };
      });
  },
});

export default projectDataSlice.reducer;
