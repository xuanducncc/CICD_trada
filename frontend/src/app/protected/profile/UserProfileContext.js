import useAuthUser from "@core/auth/useAuthUser";
import useUsersListRequester from "@core/hooks/useUsersListRequester";
import { usersAction } from "@core/redux/users";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useRouteMatch } from 'react-router'
const UserProfileContext = createContext({
  userDetail: null,
  loading: null,
  error: null,
  userPerformance: null
});
export const UserProfileProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const { user } = useAuthUser();
  const { userDetail, userPerformance, loading, error } = useUsersListRequester({ userId: params.uid ? params.uid : user.id });

  const contextValue = useMemo(
    () => ({
      userDetail,
      loading,
      error,
      userPerformance
    }),
    [userDetail, loading, error, userPerformance]
  );

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

export function withUserProfileContext(Component) {
  return function WrapperComponent(props) {
    return (
      <UserProfileProvider>
        <Component {...props} />
      </UserProfileProvider>
    );
  }
}

export const useUserProfile = () => useContext(UserProfileContext);
export default useUserProfile;