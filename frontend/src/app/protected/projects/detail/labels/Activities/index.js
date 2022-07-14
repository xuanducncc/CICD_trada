import { useSearchParams } from "@core/hooks/useSearchParams";
import React from "react";
import { useLocation } from "react-use";
import { ProjectDetailActivitiesProvider } from "./ActivitiesContext";
import ActivityPage from "./Activity";

const ProjectDetailActivitiesWithContext = () => {
  const { state } = useLocation();
  const { page = 1 } = useSearchParams();
  return (
    <ProjectDetailActivitiesProvider page={page}>
      <ActivityPage />
    </ProjectDetailActivitiesProvider>
  );
};

export default ProjectDetailActivitiesWithContext;
