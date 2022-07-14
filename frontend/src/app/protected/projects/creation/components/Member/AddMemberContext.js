import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { projectsActions } from "@core/redux/projects";
import useProjectCreation from "../../ProjectCreationContext";
import { membersSelectors } from '@core/redux/members';

const AddMemberContext = createContext({
  memberList: null,
  addMemberList: null,
  addMember: null,
  removeMember: null,
})

export const AddMemberProvider = ({ children }) => {
  const dispatch = useDispatch();
  const memberList = useSelector(membersSelectors.selectMembersList);
  const { projectMutation, createdProjectId } = useProjectCreation();
  const addMemberList = projectMutation.members?.memberList;

  const addMember = useCallback((member) => {
    const roleList = member.organizationRole.map((role) => {
      return { name: role };
    })
    const newMember = { user_id: parseInt(member.id), role: roleList, project_id: createdProjectId }
    dispatch(
      projectsActions.addNewMember(newMember)
    );
  }, [dispatch, createdProjectId]);

  const removeMember = useCallback((id) => {
    dispatch(
      projectsActions.removeNewMember(parseInt(id))
    );
  }, [dispatch]);

  const contextValue = useMemo(
    () => ({
      memberList,
      addMemberList,
      addMember,
      removeMember,
    }),
    [
      memberList,
      addMemberList,
      addMember,
      removeMember,
    ]
  );
  return (
    <AddMemberContext.Provider value={contextValue}>
      {children}
    </AddMemberContext.Provider>
  )
};

export function withAddMemberContext(Component) {
  return function WrapperComponent(props) {
    return (
      <AddMemberProvider>
        <Component {...props} />
      </AddMemberProvider>
    )
  }
}

export const useAddMember = () => useContext(AddMemberContext);

export default useAddMember;