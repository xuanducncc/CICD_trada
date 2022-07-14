import notificationReducer, {
  addNotification,
  ErrorAdapter,
} from "./errorMessage";
import { createSelector } from "reselect";

const selectSelf = (state) => state.notifications;

//  const selectNotifications=createSelector(selectSelf,state=>state.notifications)
const notificationsListSelectors = ErrorAdapter.getSelectors(selectSelf);

const selectLatestNotification = (state) =>
  notificationsListSelectors.selectById(state, "latest");

export const notificationsSelectors = {
  notificationsSelectAll: notificationsListSelectors.selectAll,
  selectLatestNotification,
};

export const notificationActions = {
  addNotification,
};

export default notificationReducer;

export const notificationMiddleWare = ({ dispatch }) => (next) => (action) => {
  if (
    typeof action === "object" &&
    !(action.type || "").includes("notificationMessage") &&
    action.payload?.notification
  ) {
    try {
      const notification =
        typeof action.payload?.notification === "object"
          ? action.payload?.notification
          : action.payload;
      dispatch(addNotification(notification));
    } catch (e) {
      console.error("Failed to show notification", e);
    }
  }
  return next(action);
};

export const NetworkErrorNotificationMiddleWare = ({ dispatch }) => (next) => (
  action
) => {
  if (action?.payload?.error) {
    if (action?.payload?.error?.message === "Network Error") {
      try {
        dispatch(
          addNotification({
            type: "error",
            message: "Network Error",
            description: "Please check your internet",
          })
        );
        delete action.payload.error;
      } catch (e) {
        console.error("Failed to show notification", e);
      }
    }

    return next(action);
  }
};

export const notificationMiddleWares = [
  notificationMiddleWare,
  // NetworkErrorNotificationMiddleWare,
];
