import React, { useState } from "react";
import ProjectDetailOverview from "./ProjectDetailOverview";
import { ProjectDetailOverviewProvider } from "./ProjectOverviewContext";

const ProjectDetailOverviewPage = () => {
    return (
        <ProjectDetailOverviewProvider>
            <ProjectDetailOverview />
        </ProjectDetailOverviewProvider>
    )
};

export default ProjectDetailOverviewPage;