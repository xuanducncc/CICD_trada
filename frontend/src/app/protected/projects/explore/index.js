import React from "react";
import ProjectExplorePage from "./ProjectExplorePage";
import { ProjectExploreListListProvider } from "./ProjectExplorePageContext";

const ProjectExplorePageWithContext = () => {
  return (
    <ProjectExploreListListProvider>
      <ProjectExplorePage />
    </ProjectExploreListListProvider>
  );
};

export default ProjectExplorePageWithContext;
