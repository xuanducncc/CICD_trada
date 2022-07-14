import React, { useCallback, useState } from "react";
import useAddMember from "./AddMemberContext";
import { withAddMemberContext } from "./AddMemberContext"
import ProjectMemberSettingsForm from "@app/protected/projects/components/ProjectMemberSettingsForm/ProjectMemberSettingsForm";
const AddMember = () => {
  const { addMemberList, addMember, removeMember } = useAddMember();

  const onAddMember = useCallback(
    (member) => {
      addMember(member);
    },
    [addMember]
  )

  const onRemoveMember = useCallback(
    (id) => {
      removeMember(id);
    },
    [removeMember]
  )
  return (
    <div style={{ padding: "0px 49px", backgroundColor: "white" }}>
      <ProjectMemberSettingsForm
        members={addMemberList}
        onAddMember={onAddMember}
        onRemoveMember={onRemoveMember}
      />
    </div>
  );
};

export default withAddMemberContext(AddMember);
