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
import useProtected from "@components/Protected/ProtectedContext";
import GeneralPerformance from "./GeneralPerformance";
import MemberPerformance from "./MemberPerformance";

export default function PerformancePage() {
  const { isAdmin } = useProtected();
  const { path } = useRouteMatch();
  const { pid, tab } = useParams();
  const currentPath = path.replace(":pid", pid).replace(":tab", tab);

  return (
    <Col>
      <Switch>
        <Route exact path={`${path}/`}>
          <GeneralPerformance />
        </Route>
        <Route exact path={`${path}/member/:mid`}>
          <MemberPerformance />
        </Route>
      </Switch>
    </Col>
  );
}
