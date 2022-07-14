import React, { useCallback, useEffect, useState } from "react";
import * as mediaApi from "@core/api/mediaApi";
import useAsyncEffect from "use-async-effect";
import { authActions, authSelectors } from "@core/redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

export default function useAuthUser() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isLogin = useSelector(authSelectors.selectIsLogin);
  const isAdmin = useSelector(authSelectors.selectIsAdmin);
  const user = useSelector(authSelectors.selectUser);
  const loading = useSelector(authSelectors.selectLoading);
  const error = useSelector(authSelectors.selectError);

  const logout = useCallback(() => {
    dispatch(authActions.logoutUser());
    history.push('/login');
  }, [dispatch, history]);

  const login = useCallback((payload) => {
    dispatch(authActions.loginUser(payload));
  }, []);

  const fetchUser = useCallback(() => {
    dispatch(authActions.fetchAuthUser());
  }, []);

  useEffect(() => {
    if (user || !isLogin || loading !== "idle") {
      return;
    }
    fetchUser();
  }, [user, loading, isLogin]);

  return {
    isLogin,
    user,
    error,
    loading,
    isAdmin,
    logout,
    login,
  };
}
