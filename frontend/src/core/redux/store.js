import { combineReducers, configureStore } from "@reduxjs/toolkit";

// We'll use redux-logger just as an example of adding another middleware
import logger from "redux-logger";

// And use redux-batch as an example of adding enhancers
import { reduxBatch } from "@manaflair/redux-batch";

import authReducer, { authMiddleWares } from "./auth";
import projectReducer, { projectsMiddleWares } from "./projects";
import workspaceReducer, { workspaceMiddleWares } from "./workspace";
import memberReducer from "./members";
import datasetReducer from "./datasets";
import usersReducer from "./users";
import loggerReducer from "./logger";
import notificationReducer, { notificationMiddleWares } from "./notification";

const reducer = {
  auth: authReducer,
  projects: projectReducer,
  workspace: workspaceReducer,
  members: memberReducer,
  datasets: datasetReducer,
  user: usersReducer,
  logger: loggerReducer,
  notifications: notificationReducer,
};

const rootReducer = combineReducers(reducer);

const resettableReducer = (state, action) => {
  if (action.type === "auth/logout/fulfilled") {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

const preloadedState = {};

const DEV_MIDDLE_WARES = [logger];

const PROD_MIDDLE_WARES = [];

const COMMON_MIDDLE_WARES = [].concat(
  authMiddleWares,
  projectsMiddleWares,
  workspaceMiddleWares,
  notificationMiddleWares
);

const ENV_MIDDLE_WARES =
  process.env.NODE_ENV === "production" ? PROD_MIDDLE_WARES : DEV_MIDDLE_WARES;

const ALL_MIDDLE_WARES = [...COMMON_MIDDLE_WARES, ...ENV_MIDDLE_WARES];

export const store = configureStore({
  reducer: resettableReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["datasets/uploadDataset/pending"],
        ignoredActionPaths: ["meta.arg", "payload.error"],
      },
    }).concat(...ALL_MIDDLE_WARES),
  devTools: process.env.NODE_ENV !== "production",
  preloadedState,
  enhancers: [reduxBatch],
});
