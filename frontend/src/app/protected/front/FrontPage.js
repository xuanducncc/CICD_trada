import React, { useCallback } from "react";
import Col from "antd/lib/col";
import Tabs from "antd/lib/tabs";
import Row from "antd/lib/row";
const { TabPane } = Tabs;
import {
  Route,
  Switch,
  useRouteMatch,
  Redirect,
  useHistory,
} from "react-router-dom";
import PageLayout from "@components/PageLayout/PageLayout";
import MyProjectListInvitationPage from "../projects/invitations";
import ExploreListPage from "../projects/explore";
import { useDispatch } from "react-redux";
import MyProjectListPage from "../projects/mine";
import ProjectListPage from "../projects/list";
import MemberListPage from "../members/list/MemberListPage";
import DatasetsPage from "../datasets";
import useProtected from "@components/Protected/ProtectedContext";
import { projectsActions } from "@core/redux/projects";
import { PROJECT_LIST_TYPES } from "@utils/const";

const FrontPage = () => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const { isAdmin } = useProtected();

  const urlKeymap = {
    projects: PROJECT_LIST_TYPES.ALL,
    my: PROJECT_LIST_TYPES.JOINED,
    invite: PROJECT_LIST_TYPES.INVITED,
    explore: PROJECT_LIST_TYPES.AVAILABLE,
  };
  return (
    <PageLayout>
      <Row>
        <Col span={24}>
          <Switch>
            <Redirect
              from={`${path}`}
              exact
              to={`${path}/${isAdmin ? "projects" : "my"}`}
            />
            <Route
              path={`${path}/:tab`}
              render={({ match, history }) => {
                return (
                  <Tabs
                    defaultActiveKey={isAdmin ? "projects" : "my"}
                    activeKey={match.params.tab}
                    onChange={(key) => {
                      const listType = urlKeymap[key];
                      dispatch(
                        projectsActions.syncProjectsOptions({ listType })
                      );
                      history.replace(`${path}/${key}`);
                    }}
                  >
                    {isAdmin && (
                      <>
                        <TabPane tab="Projects" key="projects">
                          <ProjectListPage />
                        </TabPane>
                        <TabPane tab="Members" key="members">
                          <MemberListPage />
                        </TabPane>
                        <TabPane tab="Datasets" key="datasets">
                          <DatasetsPage />
                        </TabPane>
                      </>
                    )}
                    {!isAdmin && (
                      <>
                        <TabPane tab="My Project" key="my">
                          <MyProjectListPage />
                        </TabPane>
                        <TabPane tab="Invitations" key="invite">
                          <MyProjectListInvitationPage />
                        </TabPane>
                        <TabPane tab="Explore" key="explore">
                          <ExploreListPage />
                        </TabPane>
                      </>
                    )}
                  </Tabs>
                );
              }}
            />
          </Switch>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default FrontPage;
