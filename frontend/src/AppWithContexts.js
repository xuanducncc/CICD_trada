import React, { Suspense } from "react";
import Theme from "./components/Theme";
import App from "./app/App";
import { Provider as ReduxProvider } from "react-redux";
import { ToastProvider } from "./components/Toasts";
import { AppConfigProvider } from "./components/AppConfig";
import { AuthProvider } from "./utils/auth/AuthContext";
import { HotkeyStorageProvider } from "./components/HotkeyStorage";
import AppErrorBoundary from "./components/AppErrorBoundary";
import NotificationProvider from "@core/notification/NotificationContext";
import Loading from "./components/Loading";
import { BrowserRouter as Router } from "react-router-dom";

import { store } from "./core/redux/store";

// Importing Internalization file
import "./core/i18n";

export const AppWithContexts = () => {
  return (
    <Router>
      <AppErrorBoundary>
        <ReduxProvider store={store}>
          <Suspense fallback={Loading}>
            <Theme>
              <AppConfigProvider>
                <NotificationProvider>
                  <AuthProvider>
                    <ToastProvider>
                      <HotkeyStorageProvider>
                        <App />
                      </HotkeyStorageProvider>
                    </ToastProvider>
                  </AuthProvider>
                </NotificationProvider>
              </AppConfigProvider>
            </Theme>
          </Suspense>
        </ReduxProvider>
      </AppErrorBoundary>
    </Router>
  );
};

export default AppWithContexts;
