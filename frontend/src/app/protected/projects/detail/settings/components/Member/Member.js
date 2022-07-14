import React, { useEffect, useCallback } from "react";
import useProjectDetail from "../../../ProjectDetailContext";
import ProjectMemberSettingsForm from '@app/protected/projects/components/ProjectMemberSettingsForm/ProjectMemberSettingsForm';
import useProjectDetailSettingMembers from "./ProjectDetailSettingMembersContext";

const MemberPage = () => {
  const {
    allMembers,
    addMember,
    removeMember,
    acceptMember,
    handleChangeRoleMember,
    updateMemberActivation,
  } = useProjectDetailSettingMembers();
  const onAddMember = useCallback(
    (member) => {
      addMember(member);
    },
    [addMember]
  );

  const onRemoveMember = useCallback(
    (id) => {
      removeMember(id);
    },
    [removeMember]
  );

  const onAcceptMember = useCallback(
    (member) => {
      acceptMember(member);
    },
    [acceptMember]
  );
  return (
    <div>
      <ProjectMemberSettingsForm
        members={allMembers}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
        onAcceptMember={onAcceptMember}
        handleChangeRoleMember={handleChangeRoleMember}
        updateMemberActivation={updateMemberActivation}
        isSetting={true}
      />
    </div>
  );
};

export default MemberPage;
