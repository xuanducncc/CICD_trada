import { combineReducers, createSelector } from '@reduxjs/toolkit';
import userList, { fetchUsers, userListAdapter } from './userList';
import userDetail, { fetchUser, fetchUserPerformance, userSlice } from './userDetail';
import userCurrent from './userCurrent';

const usersReducer = combineReducers({
  userList,
  userDetail,
  userCurrent,
});

const selectSelf = state => state.user;

const selectUsersList = createSelector(
  selectSelf,
  state => state.userList
);

const selectUsersError = createSelector(
  selectUsersList,
  state => state.error
);

const selectUsersLoading = createSelector(
  selectUsersList,
  state => state.loading
);

const selectUserDetail = createSelector(
  selectSelf,
  state => state.userDetail?.user
)

const selectUserPerformance = createSelector(
  selectSelf,
  state => state.userDetail?.userPerformance
)

export const usersAction = {
  fetchUsers,
  fetchUser,
  fetchUserPerformance,
  resetUserDetail: userSlice.actions.resetUserDetail
};

const userListSelectors = userListAdapter.getSelectors(
  selectUsersList,
)


const selectAllUsers = userListSelectors.selectAll

export const usersSelector = {
  selectAllUsers,
  selectUsersList,
  selectUsersLoading,
  selectUsersError,
  selectUserDetail,
  selectUserPerformance
}

export default usersReducer;
