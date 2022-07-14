import React from "react";
import ProjectListPage from "./ProjectListPage";
import { ProjectsListProvider } from "./ProjectListPageContext";

const ProjectListPageWithContext = () => {
  return (
    <ProjectsListProvider>
      <ProjectListPage />
    </ProjectsListProvider>
  );
};

export default ProjectListPageWithContext;
