import Text from "antd/lib/typography/Text";
import React, { useCallback, useMemo, useState } from "react";
import {
  Route,
  Switch,
  useRouteMatch,
  Redirect,
  useHistory,
  useParams,
} from "react-router-dom";
import PageLayout from "../../../../components/PageLayout/PageLayout";
import useProjectDetail from "./ProjectDetailContext";
import OverviewEmptyComponent from "./overview/overviewEmpty";
import OverviewPage from "./overview/index";
import StartLabelingButton from "./StartLabelingButton";
import StartValidatingButton from "./StartValidatingButton";
import LabelsPage from "./labels/index";
import PerformancePage from "./performance";
import ExportPage from "./export/index";
import SettingPage from "./settings/index";
import Tabs from "antd/lib/tabs";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
import PageHeader from "antd/lib/page-header";
import PageHeaderLayout from "@components/PageHeader/PageHeader";
import useProtected from "@components/Protected/ProtectedContext";
import ProjectDetailOverviewPage from "./overview/index";
import StartReviewingButton from "./StartReviewingButton";

const { TabPane } = Tabs;

const ButtonView = ({
  status,
  onHandleStatusInvite,
  onHandleJoinProject,
  setSttTab,
  isAdminOrProjectAdmin,
  isProjectReviewer,
  isProjectLabeler,
}) => {
  return (
    <>
      {status === "INVITED" ? (
        <>
          <Button onClick={() => onHandleStatusInvite("accept")} type="primary">
            Accept
          </Button>
          <Button
            danger
            onClick={() => {
              setSttTab("invite");
              onHandleStatusInvite("reject");
            }}
            type="primary"
          >
            Reject
          </Button>
        </>
      ) : status === "JOINED" ? (
        <>
          {isProjectReviewer && <StartReviewingButton />}
          {isProjectLabeler && <StartLabelingButton />}
          {isAdminOrProjectAdmin && <StartValidatingButton />}
        </>
      ) : status === "REQUESTED" ? (
        <Button type="dashed" danger>
          pending
        </Button>
      ) : (
        <Button onClick={() => onHandleJoinProject()} type="primary">
          Join
        </Button>
      )}
    </>
  );
};

const ProjectDetailPage = () => {
  const history = useHistory();
  const { isAdmin } = useProtected();
  const { path } = useRouteMatch();
  const [sttTab, setSttTab] = useState("my");
  const {
    project,
    projectId,
    loading,
    error,
    handleStatusInvite,
    handleJoinRequestProject,
    isAdminOrProjectAdmin,
    isProjectLabeler,
    isProjectReviewer,
  } = useProjectDetail();

  const currentPath = path.replace(":pid", projectId);
  const status = project?.member?.status;

  const projectName = useMemo(() => {
    return project ? project.name : "   ";
  }, [project]);

  const onHandleStatusInvite = (status) => {
    handleStatusInvite(status);
  };
  const onHandleJoinProject = () => {
    handleJoinRequestProject();
  };
  return (
    <PageLayout
      error={error}
      isReady={loading === "fulfilled"}
      loading={loading === "pending"}
      height="80vh"
    >
      <Row className="layout-content" justify="center">
        <Col md={22} lg={18} xl={16} xxl={14}>
          <PageHeaderLayout
            onBack={() => history.goBack()}
            title={projectName}
            subTitle=""
            extra={
              <ButtonView
                onHandleStatusInvite={onHandleStatusInvite}
                status={status}
                isAdminOrProjectAdmin={isAdminOrProjectAdmin}
                isProjectLabeler={isProjectLabeler}
                isProjectReviewer={isProjectReviewer}
                onHandleJoinProject={onHandleJoinProject}
                setSttTab={setSttTab}
              />
            }
          />
          <Switch>
            <Redirect path={path} exact to={`${path}/overview`}></Redirect>
            <Redirect
              path={`${path}/labels`}
              exact
              to={`${path}/labels/works`}
            ></Redirect>
            <Redirect
              path={`${path}/settings`}
              exact
              to={`${path}/settings/general`}
            ></Redirect>
            <Route
              path={`${path}/:tab`}
              render={({ match, history }) => (
                <Tabs
                  activeKey={match.params.tab}
                  style={{ padding: "20px" }}
                  onChange={(key) => {
                    const [slug] = key.split("/");
                    history.replace(`${currentPath}/${slug}`);
                  }}
                >
                  <TabPane tab="Overview" key="overview">
                    <ProjectDetailOverviewPage />
                  </TabPane>
                  <TabPane tab="Labels" key="labels">
                    <LabelsPage />
                  </TabPane>
                  <TabPane tab="Performance" key="performance">
                    <PerformancePage />
                  </TabPane>
                  {isAdmin ? (
                    <>
                      <TabPane tab="Export" key="export">
                        <ExportPage />
                      </TabPane>
                      <TabPane tab="Settings" key="settings">
                        <SettingPage />
                      </TabPane>
                    </>
                  ) : (
                    <></>
                  )}
                </Tabs>
              )}
            />
          </Switch>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default ProjectDetailPage;
