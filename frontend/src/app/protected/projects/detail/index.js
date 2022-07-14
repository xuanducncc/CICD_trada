import React from "react";
import { useParams } from "react-router";
import ProjectDetailPage from "./ProjectDetail";
import { ProjectDetailProvider } from "./ProjectDetailContext";

const ProjectDetailQueueWithContext = () => {
  const {
    pid
  } = useParams();

  return (
    <ProjectDetailProvider pid={pid}>
      <ProjectDetailPage />
    </ProjectDetailProvider>
  );
};

export default ProjectDetailQueueWithContext;
