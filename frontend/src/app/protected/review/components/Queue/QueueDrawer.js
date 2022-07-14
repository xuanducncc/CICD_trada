import React, { useCallback } from "react";
import { Col, Row, Button } from "antd";
import QueueList from "./QueueList";
import ArrowLeftOutlined from "@ant-design/icons/ArrowLeftOutlined";
import Text from "antd/lib/typography/Text";
import Drawer from "antd/lib/drawer";
import useReview from "../../ReviewPageContext";

export const QueueDrawer = ({
  workItems,
  drawerVisible,
  setDrawerVisible,
  currentId,
  setCurrentId,
}) => {
  const goBack = useCallback(() => {
    history.back();
  }, [history]);
  return (
    <Drawer
      title="My Working Queue"
      placement="left"
      closable={true}
      width={500}
      onClose={() => setDrawerVisible(false)}
      visible={drawerVisible}
    >
      <QueueList
        workItems={workItems}
        currentId={currentId}
        setCurrentId={setCurrentId}
      />
    </Drawer>
  );
};

export default QueueDrawer;
