import useAuthUser from "@core/auth/useAuthUser";
import React, { createContext, useContext, useMemo, useState } from "react";
import { useAppConfig } from "../AppConfig";

const ProtectedContext = createContext({
  showHeader: null,
  setShowHeader: null,
  user: null,
  loading: null,
  isLogin: null,
  isAdmin: null,
  error: null,
  logout: null,
});

export const ProtectedProvider = ({ children }) => {
  const { appConfig, fromConfig } = useAppConfig();
  const [showHeader, setShowHeader] = useState(true);
  const { user, loading, error, isLogin, isAdmin, logout } = useAuthUser();

  const contextValue = useMemo(
    () => ({
      showHeader,
      user,
      error,
      loading,
      isLogin,
      isAdmin,
      setShowHeader,
      logout,
    }),
    [showHeader, user, error, loading, isAdmin, isLogin, setShowHeader, logout]
  );

  return (
    <ProtectedContext.Provider value={contextValue}>
      {children}
    </ProtectedContext.Provider>
  );
};

export const useProtected = () => useContext(ProtectedContext);

export default useProtected;
