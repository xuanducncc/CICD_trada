import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import PageNotFound from "./PageNotFound";
import PrivateRoute from "../components/authentication/PrivateRoute";
import LoginPage from "./auth/LoginPage";
import SignUpPage from "./auth/SignUpPage";
import DocPage from "../docs/index";

import Layout from "antd/lib/layout";

import "./App.css";
import ProtectedPage from "./protected/ProtectedPage";

function App() {
  return (
    <Layout className="layout">
      <Switch>
        <PrivateRoute path="/i" component={ProtectedPage}></PrivateRoute>
        <Redirect path="/" exact to="/i"></Redirect>
        <Route path="/login" component={LoginPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/docs" component={DocPage} />
        <Route component={PageNotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
