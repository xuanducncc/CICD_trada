import {
  createAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  obtainToken,
  logout,
  signUp,
  loginOauth as loginOauthApi,
} from "../../api/authenticationApi";
import { createActionLogMiddleWare } from "../logger";
import { fetchUserCurrent } from "../users/userCurrent";
import { parseJwt } from "@utils/jwt";
import { ACTION_LOG_ACTIONS, ACTION_LOG_OBJECTS } from "@utils/const";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await obtainToken({
        username,
        password,
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        grantType: "password",
      });
      return data;
    } catch (error) {
      const errorMsg1 =
        typeof error?.response?.data?.error_description === "string"
          ? error?.response?.data?.error_description
          : null;
      const errorMsg2 =
        typeof error?.response?.data?.error === "string"
          ? error?.response?.data?.error
          : null;
      const message = errorMsg1 ?? errorMsg2 ?? "Obtain token error.";
      return rejectWithValue({ message, error });
    }
  }
);

export const loginOauth = createAsyncThunk(
  "auth/loginOauth",
  async ({ accessToken }, { rejectWithValue }) => {
    try {
      const data = await loginOauthApi({
        token: accessToken,
        backend: "google-oauth2",
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        grantType: "convert_token",
      });
      return data;
    } catch (error) {
      const message = error?.response?.data?.detail ?? "Obtain token error.";
      return rejectWithValue({ message, error });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { email, password, username, first_name, last_name } = payload;
      const response = await signUp(
        email,
        username,
        password,
        first_name,
        last_name
      );
      return {
        response: response.data,
        notification: {
          type: "success",
          message: "Register account successfully",
          // description: "You can login with new account",
          notification: true,
        },
      };
    } catch (error) {
      const message =
        error?.response?.data?.error?.message ?? "Obtain token error.";
      return rejectWithValue({ message, error });
    }
  }
);

export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async (payload, { dispatch, rejectWithValue }) => {
    const result = await dispatch(fetchUserCurrent());
    if (result.error) {
      return rejectWithValue(result.payload);
    }
    return result.payload;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logout();
});

const authSlice = createSlice({
  initialState: {
    user: null,
    loading: "idle",
    error: null,
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  },
  name: "auth",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginOauth.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loginOauth.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.loading = "idle";
      })
      .addCase(loginOauth.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });

    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.loading = "idle";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });

    builder
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = "idle";
        state.user = null;
        state.accessToken = null;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.error = null;
      });

    builder
      .addCase(fetchAuthUser.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.user = action.payload;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

export const authActions = {
  loginUser,
  loginOauth,
  registerUser,
  logoutUser,
  fetchAuthUser,
};

// SELECTORS
const selectAuth = (state) => state?.auth;

const selectUser = createSelector(selectAuth, (state) => state.user);

const selectAccessToken = createSelector(
  selectAuth,
  (state) => state.accessToken
);

const selectIsLogin = createSelector(
  selectAuth,
  (state) => !!state.accessToken
);

const selectLoading = createSelector(selectAuth, (state) => state.loading);

const selectError = createSelector(selectAuth, (state) => state?.error);

const selectIsAdmin = createSelector(selectUser, (user) =>
  user ? user.is_superuser : false
);

export const authSelectors = {
  selectUser,
  selectAccessToken,
  selectIsLogin,
  selectLoading,
  selectIsAdmin,
  selectError,
};

// Middle Wares

const authActionLoggerMiddleWare = createActionLogMiddleWare((action) => {
  switch (action.type) {
    case loginUser.fulfilled.type: {
      return {
        user_id: action.payload.user.user_id,
        action: ACTION_LOG_ACTIONS.USER_LOGIN,
        object: ACTION_LOG_OBJECTS.USER,
        change_message: "Login from web",
        value: {},
      };
    }
    default:
      return null;
  }
});

export const authMiddleWares = [authActionLoggerMiddleWare];
