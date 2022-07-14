import React, {
    createContext,
    useContext,
    useMemo,
} from "react";
import {
    usersSelector
} from "@core/redux/users";
import useUsersListRequester from "@core/hooks/useUsersListRequester";

const UsersContext = createContext({
    users: null,
    error: null,
    loading: null
})

export const MemberListProvider = ({ children }) => {
    const { users, error, loading } = useUsersListRequester({
        usersSelector: usersSelector.selectUsersList,
    });

    const contextValue = useMemo(
        () => ({
            users,
            error,
            loading
        }),
        [users, error, loading]
    );
    return (
        <UsersContext.Provider value={contextValue}>
            {children}
        </UsersContext.Provider>
    )
}

export const useListUser = () => useContext(UsersContext);
export default useListUser;
