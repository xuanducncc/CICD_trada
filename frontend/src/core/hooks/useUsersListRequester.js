import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersSelector, usersAction } from "@core/redux/users"

export default function useUsersListRequester({ userId }) {
  const dispatch = useDispatch();
  const users = useSelector(usersSelector.selectAllUsers);
  const error = useSelector(usersSelector.selectUsersError);
  const loading = useSelector(usersSelector.selectUsersLoading);
  const userDetail = useSelector(usersSelector.selectUserDetail);
  const userPerformance = useSelector(usersSelector.selectUserPerformance);

  useEffect(() => {
    if (loading !== 'idle') {
      return;
    }
    else {
      dispatch(usersAction.fetchUsers());
    }
  }, [loading, dispatch, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(usersAction.fetchUser({ id: parseInt(userId) }));
      dispatch(usersAction.fetchUserPerformance({ id: parseInt(userId) }));
    }
  }, [userId, dispatch])


  return {
    users,
    error,
    loading,
    userDetail,
    userPerformance
  };
}
