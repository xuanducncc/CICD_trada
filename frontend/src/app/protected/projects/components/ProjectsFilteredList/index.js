import React from "react";
import { ProjectsFilteredListProvider } from "./ProjectsFilteredListContext";
import ProjectsFilteredList from "./ProjectsFilteredList";

const ProjectsFilteredListWithContext = ({ projects, options }) => {
  return (
    <ProjectsFilteredListProvider projects={projects} options={options}>
      <ProjectsFilteredList />
    </ProjectsFilteredListProvider>
  );
};

export default ProjectsFilteredListWithContext;
