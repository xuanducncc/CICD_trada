import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useHistory, useRouteMatch } from "react-router-dom";
import { authActions } from "@core/redux/auth";
import Col from "antd/lib/col";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Row from "antd/lib/row";
import logoSmall from "@assets/images/logo-small.png";
import Avatar from "antd/lib/avatar";
import Modal from "antd/lib/modal";
import Descriptions from "antd/lib/descriptions";
import {
  MailOutlined,
  LogoutOutlined,
  CaretDownOutlined,
  UserOutlined,
  ProfileOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import DescriptionsItem from "antd/lib/descriptions/Item";
import useProtected from "@components/Protected/ProtectedContext";
import { Link } from 'react-router-dom';
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { path } = useRouteMatch();
  const { user, logout } = useProtected();

  const switchRouter = async (link) => {
    if (link.key === "/logout") {
      logout();
    }

    if (link.key === "/about") {
      showModal();
      return;
    }

    if (link.key === "/docs") {
      history.push(`${link.key}`);
    }

    if (link.key === "/profile") {
      history.push(`${path}${link.key}`);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const menuUser = () => {
    return (
      <Menu
        style={{ width: 200, margin: 10 }}
        defaultSelectedKeys={["/"]}
        defaultOpenKeys={["/"]}
        onClick={switchRouter}
      >
        <Menu.Item key="/profile" icon={<ProfileOutlined />}>
          User Profile
        </Menu.Item>
        <Menu.Item key="/about" icon={<ProfileOutlined />}>
          About
        </Menu.Item>
        <Menu.Item key="/docs" icon={<FileSearchOutlined />}>
          User Guide
        </Menu.Item>
        <Menu.Item key="/logout" icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <nav>
      {/* {accessToken ? ( */}
      <Row justify="space-between">
        <Col>
          <Row
            onClick={() => switchRouter({ key: "/" })}
            style={{ cursor: "pointer" }}
          >
            <Link to="/">
              <img
                style={{ padding: "5px", width: "56px" }}
                shape="square"
                src={logoSmall}
              />
            </Link>
          </Row>
        </Col>

        <Dropdown
          overlay={menuUser}
          trigger={["click"]}
          className="headerProfile"
        >
          <Row style={{}} justify="space-around" align="middle" gutter="10px">
            <Col>
              <Text type="text">
                <UserOutlined /> {user.username} <CaretDownOutlined />
              </Text>
            </Col>
          </Row>
        </Dropdown>
      </Row>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <div>
          <h2>TRADA {`${(process?.env?.ENV_NAME ?? "").toUpperCase()}`}</h2>
        </div>
        <Descriptions column={1}>
          <DescriptionsItem label="Build date">
            {new Date(process.env.BUILD_DATE).toString()}
          </DescriptionsItem>
          <DescriptionsItem label="Build version">
            {process.env.BUILD_VERSION}
          </DescriptionsItem>
          <DescriptionsItem label="Build environment">
            {process.env.ENV_NAME}
          </DescriptionsItem>
          <DescriptionsItem label="Build commit">
            {process.env.BUILD_COMMIT}
          </DescriptionsItem>
          <DescriptionsItem label="Build branch">
            {process.env.BUILD_BRANCH}
          </DescriptionsItem>
          <DescriptionsItem label="Package version">
            {process.env.PACKAGE_VERSION}
          </DescriptionsItem>
          <DescriptionsItem label="Release notes">
            <a
              href="https://github.com/autobotasia/trada/releases"
              target="blank"
            >
              releases
            </a>
          </DescriptionsItem>
        </Descriptions>
      </Modal>
    </nav>
  );
};

export default Header;
