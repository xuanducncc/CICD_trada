import React, {
  useEffect,
  useMemo,
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
} from "react";
import { notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  notificationActions,
  notificationsSelectors,
} from "@core/redux/notification";
import Text from 'antd/lib/typography/Text';

const Message = ({ message }) => {
  return <Text type="danger">{message}</Text>;
};

const NotificationContext = createContext({
  hasError: false,
  errorMessage: null,
});

const NotificationProvider = ({ children }) => {
  // Notification message
  const latestNotification = useSelector(
    notificationsSelectors.selectLatestNotification
  );
  const dispatch = useDispatch();


  const addNotification = useCallback(
    (payload) => {
      dispatch(notificationActions.addNotification(payload));
    },
    [latestNotification, dispatch]
  );

  const ErrorNotificationContextValue = useMemo(
    () => ({ addNotification }),
    [addNotification]
  );

  useEffect(() => {
    if(!latestNotification) {
      return;
    }

    notification.open({
      ...latestNotification,
      description: <Message message={latestNotification.description} />,
    });
  }, [latestNotification]);

  return (
    <NotificationContext.Provider value={ErrorNotificationContextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

export const useNotificationContext = () => useContext(NotificationContext);
