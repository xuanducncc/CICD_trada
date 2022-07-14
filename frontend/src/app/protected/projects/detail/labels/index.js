import React from "react";
import Col from "antd/lib/col";
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
import ActivityPage from "./Activities";
import BenchmarksPage from "./Benchmarks";
import QueuePage from "./Queue";
import ValidationPage from "./Validation";
import useProtected from "@components/Protected/ProtectedContext";
import { useLocation } from "react-use";
import "./style.css";

export default function LabelsPage() {
  const { isAdmin } = useProtected();
  const { path } = useRouteMatch();
  const { pid, tab } = useParams();
  const currentPath = path.replace(":pid", pid).replace(":tab", tab);
  return (
    <Col>
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
              <Tabs.TabPane tab="Works" key="works">
                <QueuePage />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Activities" key="activities">
                <ActivityPage />
              </Tabs.TabPane>
              {isAdmin && (
                <>
                  <Tabs.TabPane tab="Validation" key="validation">
                    <ValidationPage />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Benchmarks" key="benchmarks">
                    <BenchmarksPage />
                  </Tabs.TabPane>
                </>
              )}
            </Tabs>
          )}
        />
      </Switch>
    </Col>
  );
}
