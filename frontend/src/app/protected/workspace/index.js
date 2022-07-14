import React from "react";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import WorkspacePage from "./WorkspacePage";

const WorkspacePageWithContext = () => {
  return (
    <WorkspaceProvider>
      <WorkspacePage />
    </WorkspaceProvider>
  );
};

export default WorkspacePageWithContext;
