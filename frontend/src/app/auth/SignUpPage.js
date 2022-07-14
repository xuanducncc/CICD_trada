import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Tooltip from "antd/lib/tooltip";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import Divider from "antd/lib/divider";
import logo from "@assets/images/logo.png";
import React from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { authActions } from "@core/redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";

const openNotificationWithIcon = (type, history) => {
  const btn = (
    <Button type="primary" size="small" onClick={() => history.push('/')}>
      SignIn
    </Button>
  );
  notification[type]({
    message: 'Create success',
    description:
      'Account successfully created',
    btn
  });
};
const SignUpPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector(state => state);

  const onFinish = async (values) => {
    const { email, password, username, first_name, last_name } = values;
    const response = await dispatch(authActions.registerUser({ email, password, username, first_name, last_name }));
    if (!response.error) {
      history.push('/');
    }

  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
    labelAlign: "left"
  };
  return (
    <>
      {
        state.auth.payload == "CREATE_SUCCESS" && openNotificationWithIcon("success", history)
      }
      <Row align="middle" justify="center" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <Col style={{ padding: '40px', paddingBottom: '0' }} span={24}>
          <Row align="middle">
            <Col>
              <Col style={{ textAlign: 'center' }}>
                <img src={logo} />
              </Col>
              <div style={{ textAlign: 'center', padding: '30px', paddingBottom: '0', fontSize: '18px', fontWeight: 'bold' }}>
                <Text>Data labeling easy as drinking a cup of tea</Text>
              </div>
            </Col>
          </Row>
        </Col>
        {/* <Col md={22} lg={18} xl={14} xxl={12} style={{ top: "350px" }}> */}
        {/* <Divider orientation="left"><Title level={2}> Register </Title></Divider> */}
        <Col style={{ padding: '100px', paddingTop: '50px' }} span={24}>
          <Row type="flex" justify="start" align="top">
            <Col span={24}>
              <Title level={3}>
                Register{" "}
              </Title>
              <Row style={{ maxWidth: 'fit-content', textAlign: 'center' }}>
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
              {...formItemLayout}
              className="login-form"
              form={form}
              name="register"
              onFinish={onFinish}
              initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '86',
              }}
              scrollToFirstError
            >
              <Form.Item
                name="first_name"
                label="First name"
                rules={[{ required: true, message: 'Please input your first name!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="last_name"
                label="Last name"
                rules={[{ required: true, message: 'Please input your last name!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="username"
                label={
                  <span>
                    Username&nbsp;
                <Tooltip title="What do you want others to call you?">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    min: 8,
                    message: 'Password has at least 8 characters',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Password does not match!');
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              {/* <Form.Item> */}
              <Row justify="center">
                <Button type="primary" htmlType="submit" loading={state.auth.loading === "pending"}>
                  Register
                  </Button>
              </Row>
              {/* </Form.Item> */}
            </Form>
          </Col>
          <Row type="flex" justify="center" align="top" style={{ marginTop: "10px" }}>
            <Col span={15}>
              <Text strong>
                Already have an account?
                <Link to="/login"> Sign in</Link>
              </Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SignUpPage;
