import React from "react";
import Drawer from "antd/lib/drawer";
import QueueList from "./QueueList";

export const QueueDrawer = ({
  drawerVisible,
  setDrawerVisible,
  workItems,
  currentId,
  setCurrentId,
}) => {
  return (
    <Drawer
      title="My Working Queue"
      placement="left"
      closable={true}
      width={600}
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
