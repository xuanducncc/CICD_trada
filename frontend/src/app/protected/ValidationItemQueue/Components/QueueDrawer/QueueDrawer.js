import React, { useCallback } from "react";
import { Col, Row, Button } from "antd";
import QueueList from "./QueueList";
import ArrowLeftOutlined from "@ant-design/icons/ArrowLeftOutlined";
import Text from "antd/lib/typography/Text";
import useValidationItemQueue from "../../ValidationItemQueueContext";

export const QueueDrawer = ({ workItems }) => {
  const { currentId, queueId, acceptWorkItem, rejectWorkItem } = useValidationItemQueue();
  const goBack = useCallback(() => {
    history.back();
  }, [history]);
  return (
    <>
      <Row justify="space-between"
        style={{
          padding: "20px 10px",
          borderBottom: "1px solid #f0f0f0"
        }}
      >
        <Col>
          <Button onClick={goBack} type="text" icon={<ArrowLeftOutlined />}></Button>
          <Text>Label Browser</Text>
        </Col>
        <Col>
          <Button onClick={() => rejectWorkItem({ queueId })} type="primary" danger style={{ marginRight: "10px" }}>Reject All</Button>
          <Button onClick={() => acceptWorkItem({ queueId })} type="primary">Accept All</Button>
        </Col>
      </Row>
      <Col style={{ overflowY: "scroll", height: "calc(1000%/12 + 35px)" }}>
        <QueueList
          workItems={workItems}
          currentId={currentId}
        />
      </Col>
    </>
  );
};

export default QueueDrawer;
