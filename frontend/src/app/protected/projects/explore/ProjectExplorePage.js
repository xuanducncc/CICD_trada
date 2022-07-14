import { PROJECT_LIST_TYPES } from "@utils/const";
import Text from "antd/lib/typography/Text";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import PageLayout from "../../../../components/PageLayout/PageLayout";
import ProjectsFilteredList from "../components/ProjectsFilteredList";
import useProjectExplorePage from "./ProjectExplorePageContext";

// import "./ProjectListPage.css";

const ProjectExplorePage = () => {
  const { projects, error, loading, options } = useProjectExplorePage();
  return (
    <PageLayout
      loading={loading === "pending"}
      isReady={loading === "fulfilled"}
      error={error}
    >
      <ProjectsFilteredList projects={projects} options={options} />
    </PageLayout>
  );
};

export default ProjectExplorePage;
