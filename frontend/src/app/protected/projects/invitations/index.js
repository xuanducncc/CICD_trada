import React from "react";
import ProjectInvitationsPage from "./ProjectInvitationsPage";
import { ProjectInvitationsProvider } from "./ProjectInvitationsPageContext";

const ProjectInvitationsPageWithContext = () => {
  return (
    <ProjectInvitationsProvider>
      <ProjectInvitationsPage />
    </ProjectInvitationsProvider>
  );
};

export default ProjectInvitationsPageWithContext;
