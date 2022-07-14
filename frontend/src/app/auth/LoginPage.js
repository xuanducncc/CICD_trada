import React, { useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { authActions } from "@core/redux/auth";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Input from "antd/lib/input";
import Row from "antd/lib/row";
import Form from "antd/lib/form";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { Link } from "react-router-dom";
import logo from "@assets/images/logo.png";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import GoogleLoginButton from "./GoogleLoginButton";
import Divider from "antd/lib/divider";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const LoginPage = ({ history }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const onFinish = async (values) => {
    const { username, password } = values;
    const result = await dispatch(
      authActions.loginUser({ username, password })
    );
    if (!result.error) {
      history.replace("/i/f");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onGoogleFinish = async (payload) => {
    const { accessToken, profileObj } = payload;
    const result = await dispatch(
      authActions.loginOauth({ accessToken, profileObj })
    );
    if (!result.error) {
      history.replace("/i/f");
    }
  };

  const onGoogleFailure = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <Col style={{ padding: "40px", paddingBottom: "0" }} span={24}>
        <Row align="middle">
          <Col>
            <Col style={{ textAlign: "center" }}>
              <img src={logo} />
            </Col>
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                paddingBottom: "0",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <Text>Data labeling easy as drinking a cup of tea</Text>
            </div>
          </Col>
        </Row>
      </Col>
      <Col style={{ padding: "100px", paddingTop: "0" }} span={24}>
        <Row type="flex" justify="start" align="top">
          <Col span={24}>
            <Title level={3}>Login </Title>
            <Row style={{ maxWidth: "fit-content", textAlign: "center" }}>
              {state.auth.error ? (
                <Text style={{ color: "#ff4d4f", marginBottom: "10px" }}>
                  {state.auth.error?.message}
                </Text>
              ) : (
                <></>
              )}
            </Row>
          </Col>
        </Row>
        <Col>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                placeholder="Username"
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                autoComplete="current-password"
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Password"
                type="password"
              />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                }}
              >
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="td-login-btn"
                  loading={state.auth.loading === "pending"}
                  style={{
                    boxShadow: 'rgb(0 0 0 / 24%) 0px 2px 2px 0px, rgb(0 0 0 / 24%) 0px 0px 1px 0px'
                  }}
                >
                  Sign in
                </Button>
              </div>
              <div>
                <GoogleLoginButton
                  text="Sign in with Google"
                  clientId={GOOGLE_CLIENT_ID}
                  onSuccess={onGoogleFinish}
                  onFailure={onGoogleFailure}
                />
              </div>
            </div>
          </Form>
        </Col>
        <Row>
          <Col style={{ paddingTop: "30px" }}>
            <Text strong>
              New to Trada? Create
              <Link to="/sign-up"> an account</Link>
            </Text>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

LoginPage.propTypes = {
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default LoginPage;
