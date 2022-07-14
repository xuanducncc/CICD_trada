import React from "react";
import Tabs from "antd/lib/tabs";
import Row from "antd/lib/row";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  Redirect,
  useHistory,
} from "react-router-dom";
import GeneralPage from "./components/General";
import DatasetPage from "./components/Dataset";
import LabelEditorPage from "./components/LabelEditor";
import MemberPage from "./components/Member";
import DangerZonePage from "./components/DangerZone/DangerZone";
import { ProjectDetailSettingProvider } from "./contexts/ProjectDetailSettingContext";
import { useLocation } from "react-use";
import Instruction from "./components/Instruction/Instruction";

export default function SettingPage() {
  const { path } = useRouteMatch();
  const { pid, tab } = useParams();
  const currentPath = path.replace(":pid", pid).replace(":tab", tab);
  return (
    <ProjectDetailSettingProvider>
      <Switch>
        <Route
          path={`${currentPath}/:subTab`}
          render={({ match, history }) => (
            <Tabs
              activeKey={match.params.subTab}
              onChange={(key) => {
                history.replace(`${currentPath}/${key}`);
              }}
              size="large"
              tabPosition="left"
            >
              <Tabs.TabPane tab="General" key="general">
                <GeneralPage />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Datasets" key="datasets">
                <DatasetPage />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Editor" key="editor">
                <LabelEditorPage />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Instructions" key="instruction">
                <Instruction />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Members" key="members">
                <MemberPage />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Danger zone" key="danger">
                <DangerZonePage />
              </Tabs.TabPane>
            </Tabs>
          )}
        />
      </Switch>
    </ProjectDetailSettingProvider>
  );
}
