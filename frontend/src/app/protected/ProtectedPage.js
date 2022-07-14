import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import FrontPage from "./front/FrontPage";
import ProtectedLayout from "../../components/Protected/ProtectedLayout";
import WorkspacePage from "./workspace";
import HeaderPage from "../../components/common/Header";
import ProfilePage from "./profile/ProfilePage";
import ProjectDetailPage from "./projects/detail";
import ProjectCreationPage from "./projects/creation/ProjectCreationPage";
import DatasetCreatePage from "./datasets/create";
import MemberCreate from "./members/create/MemberCreate";
import MemberDetailt from "./members/detailt/MemberDetailt";
import DatasetDetail from "./datasets/detail/index";
import { ProtectedProvider } from "@components/Protected/ProtectedContext";
import ValidationItemQueue from "./ValidationItemQueue";
import ReviewPage from "./review";
import PreviewQueue from "./previewQueue";
const ProtectedPage = ({ children }) => {
  const { path } = useRouteMatch();
  return (
    <ProtectedProvider>
      <ProtectedLayout header={<HeaderPage />}>
        <Switch>
          <Redirect path={`${path}`} exact to={`${path}/f`} />
          <Route path={`${path}/f`}>
            <FrontPage />
          </Route>
          <Route path={`${path}/projects/new`}>
            <ProjectCreationPage />
          </Route>
          <Route path={`${path}/projects/:pid/validation/:qid`}>
            <ValidationItemQueue />
          </Route>
          <Route path={`${path}/projects/:pid/workspace/`}>
            <WorkspacePage />
          </Route>
          <Route path={`${path}/projects/:pid/preview`}>
            <PreviewQueue />
          </Route>
          <Route path={`${path}/projects/:pid/review/:qid`}>
            <ReviewPage />
          </Route>
          <Route path={`${path}/projects/:pid`}>
            <ProjectDetailPage />
          </Route>
          <Route path={`${path}/profile`}>
            <ProfilePage />
          </Route>
          <Route path={`${path}/user/:uid/profile`}>
            <ProfilePage />
          </Route>
          <Route path={`${path}/members/new`}>
            <MemberCreate />
          </Route>
          <Route path={`${path}/members/:mid`}>
            <MemberDetailt />
          </Route>
          <Route path={`${path}/dataset/new`}>
            <DatasetCreatePage />
          </Route>
          <Route path={`${path}/dataset/:did`}>
            <DatasetDetail />
          </Route>
        </Switch>
      </ProtectedLayout>
    </ProtectedProvider>
  );
};

export default ProtectedPage;
