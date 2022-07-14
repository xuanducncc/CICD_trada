import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import useProjectDetail from "../../../ProjectDetailContext";
import useProjectMembersRequester from "@core/hooks/useProjectMembersRequester";

const ProjectDetailSettingMembersContext = createContext({
  allMembers: null,
  addMember: null,
  removeMember: null,
  acceptMember: null,
  handleChangeRoleMember: null,
  updateMemberActivation: null,
});
export const ProjectDetailSettingMembersProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { projectId } = useProjectDetail();
  const { allMembers, loading } = useProjectMembersRequester({ projectId });

  const addMember = useCallback(
    (member) => {
      const roleList = member?.organizationRole?.map((role) => {
        return { name: role };
      });
      const newMember = {
        user_id: parseInt(member.id),
        role: roleList,
        project_id: projectId,
      };
      dispatch(projectsActions.addMember(newMember));
    },
    [dispatch, projectId]
  );

  const removeMember = useCallback(
    (id) => {
      dispatch(projectsActions.removeMember(id));
    },
    [dispatch]
  );

  const acceptMember = useCallback(async (member) => {
    const newMember = {
      user_id: member.user.id,
      role: "LABELER",
      project_id: parseInt(projectId),
      status: member.action,
    };
    await dispatch(projectsActions.onHandleAcceptJoinRequestProject(newMember));
    dispatch(projectsActions.fetchMembersProject({ projectId }));
    dispatch(projectsActions.fetchProject({ id: projectId }));
  }, []);

  const handleChangeRoleMember = useCallback(
    async (payload) => {
      if (payload.action === true) {
        await dispatch(
          projectsActions.onChangeRoleMember({
            role: payload.role,
            member_id: payload.id,
            action: "add",
          })
        );
        await dispatch(projectsActions.fetchMembersProject({ projectId }));
      } else {
        await dispatch(
          projectsActions.onChangeRoleMember({
            role: payload.role,
            member_id: payload.id,
            action: "remove",
          })
        );
        await dispatch(projectsActions.fetchMembersProject({ projectId }));
      }
    },
    [dispatch]
  );

  const updateMemberActivation = useCallback(
    ({ memberId, active }) => {
      return dispatch(
        projectsActions.updateMemberActivation({ memberId, active })
      );
    },
    [dispatch]
  );

  const contextValue = useMemo(
    () => ({
      allMembers,
      addMember,
      removeMember,
      acceptMember,
      handleChangeRoleMember,
      updateMemberActivation,
    }),
    [
      allMembers,
      addMember,
      removeMember,
      acceptMember,
      handleChangeRoleMember,
      updateMemberActivation,
    ]
  );

  return (
    <ProjectDetailSettingMembersContext.Provider value={contextValue}>
      {children}
    </ProjectDetailSettingMembersContext.Provider>
  );
};

export function withProjectDetailSettingMembersContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailSettingMembersProvider>
        <Component {...props} />
      </ProjectDetailSettingMembersProvider>
    );
  };
}

export const useProjectDetailSettingMembers = () =>
  useContext(ProjectDetailSettingMembersContext);

export default useProjectDetailSettingMembers;
