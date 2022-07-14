import { combineReducers } from "redux";
import memberList, { fetchMember } from "./memberList";
import memberDetailt, { requestMemberId } from "./memberDetailt";
import { createSelector } from "reselect";

export default combineReducers({
    memberList,
    memberDetailt
});

const selectSelf = state => state;

const selectMembersList = createSelector(
  selectSelf,
  state => state.members
);

// const memberListSelectors = memberListAdapter.getSelectors(selectMembersList);

const selectMembersError = createSelector(
  selectMembersList,
  state => state.memberList.error
);

const selectMembersLoading = createSelector(
  selectMembersList,
  state => state.memberList.loading
);

export const membersActions = {
  fetchMember,
  requestMemberId
};

export const membersSelectors = {
  selectMembersList,
  selectMembersError,
  selectMembersLoading
};
