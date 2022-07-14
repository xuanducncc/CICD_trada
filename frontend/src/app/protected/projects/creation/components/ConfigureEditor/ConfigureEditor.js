// import { Drawer, List, Avatar, Divider, Col, Row, Modal, Button } from 'antd';
import Drawer from "antd/lib/drawer";
import List from "antd/lib/list";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Modal from "antd/lib/modal";
import Button from "antd/lib/button";
import Text from "antd/lib/typography/Text";
import React, { useCallback, useState, useEffect } from "react";
import Title from "antd/lib/typography/Title";
import { PictureOutlined } from "@ant-design/icons";

import { MoreOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
const { TabPane } = Tabs;

import CustomEditorCreate from "./CustomEditorCreate";
import "./configureEditor.css";
import ImageEditorToolConfiguration from "@app/protected/projects/components/ImageEditorToolConfiguration/ImageEditorToolConfiguration";
import { ImageEditorToolConfigurationProvider } from "@app/protected/projects/components/ImageEditorToolConfiguration/ImageEditorToolConfigurationContext";
import useProjectCreation from "../../ProjectCreationContext";
import { useHistory } from "react-router";

// import { Typography } from 'antd';
// const { Title } = Typography;

const ConfigureEditor = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    setDrawer(false);
    window.history.pushState(null, null, window.location.pathname);
  }

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">{title}:</p>
      {content}
    </div>
  );
  const { setProjectEditor, setProjectEditorPreview, projectMutation } = useProjectCreation();
  const [drawer, setDrawer] = useState(false);
  const showDrawer = () => {
    setDrawer(true);
  };
  const onClose = () => {
    setDrawer(false);
  };

  const handleDrawerDismiss = useCallback(() => {
    setDrawer(false);
  }, [setDrawer]);

  const handleSubmit = useCallback(
    (data) => {
      setProjectEditor(data);
      setDrawer(false);
    },
    [setProjectEditor, setDrawer]
  );

  const handlePreview = useCallback(
    (editor) => {
      const editorData = {
        workItem: {
          project_id: 0,
          id: 0,
          row: {
            dataset_id: 0,
            id: 0,
            image:
              "https://images.ctfassets.net/cnu0m8re1exe/7sLmeD1tcL4UoIm0BjNaLh/22a9f42a4315361db96470f50b178e86/Dog-and-Cat.jpg?w=650&h=433&fit=fill",
          },
          status: "PENDING",
          type: "ORIGIN",
          labeledItems: [],
        },
        mediaUrl:
          "https://images.ctfassets.net/cnu0m8re1exe/7sLmeD1tcL4UoIm0BjNaLh/22a9f42a4315361db96470f50b178e86/Dog-and-Cat.jpg?w=650&h=433&fit=fill",
      };
      setProjectEditorPreview({ editor, editorData });
    },
    [setDrawer]
  );

  return (
    <div style={{ backgroundColor: "white", padding: "20px 50px 0 50px" }}>
      <List
        dataSource={[
          {
            name: "Editor",
          },
        ]}
        bordered
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <a onClick={showDrawer} key={`a-${item.id}`}>
                Setup
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <PictureOutlined
                  style={{
                    fontSize: "30px",
                    color: "#08c",
                    paddingTop: "12px",
                  }}
                />
              }
              title={<h3 href="https://ant.design/index-cn">{item.name}</h3>}
              description="Images, video, and text"
            />
          </List.Item>
        )}
      />
      <Drawer
        width={window.innerWidth}
        style={{ height: `100%` }}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={drawer}
        bodyStyle={{ padding: "0px" }}
      >
        <ImageEditorToolConfigurationProvider
          editor={projectMutation.editor}
          onSubmit={handleSubmit}
          onDismiss={handleDrawerDismiss}
          onPreview={handlePreview}
        >
          <ImageEditorToolConfiguration setDrawer={setDrawer} />
        </ImageEditorToolConfigurationProvider>
      </Drawer>

      {/* <Row className="wrapCustomEditor">
        <Col span={2}>
          <PictureOutlined
            style={{ fontSize: "30px", color: "#08c", paddingLeft: "26px" }}
          />
        </Col>
        <Col span={20}>
          <Title level={4}>Custom editor</Title>
        </Col>
        <Col span={2}>
          <Button type="link" onClick={() => setVisible(true)}>
            <Text className="textBtnCreate">Create</Text>
          </Button>
          <Modal
            title="Custom Editor"
            centered
            visible={visible}
            footer={false}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            width={1000}
          >
            <CustomEditorCreate />
          </Modal>
        </Col>
      </Row> */}
    </div>
  );
};

export default ConfigureEditor;
