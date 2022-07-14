import { PROJECT_LIST_TYPES } from "@utils/const";
import Text from "antd/lib/typography/Text";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import PageLayout from "../../../../components/PageLayout/PageLayout";
import ProjectsFilteredList from "../components/ProjectsFilteredList";
import useProjectInvitations from "./ProjectInvitationsPageContext";

// import "./ProjectListPage.css";

const ProjectListPage = () => {
  const { projects, error, loading, options } = useProjectInvitations();
  return (
    <PageLayout
      loading={loading === "pending"}
      isReady={loading === "fulfilled"}
      error={error}
      height="70vh"
    >
      <ProjectsFilteredList projects={projects} options={options} />
    </PageLayout>
  );
};

export default ProjectListPage;
