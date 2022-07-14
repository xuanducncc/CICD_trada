import React, { useMemo } from "react";
import List from "antd/lib/list";
import { Button, Radio, Tag } from "antd";
import { styled } from "@material-ui/styles";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import useValidationItemQueue from "../../ValidationItemQueueContext";
import { WORK_ITEM_STATUS, WORK_ITEM_TYPE } from "@utils/const";
import FormatNumber from "@components/FormatNumber/FormatNumber";

const QueueListItemWrapper = styled("div")({
  backgroundColor: ({ active }) => (active ? "#2876d4" : "transparent"),
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  padding: "10px 10px 10px 20px",
  cursor: "pointer",
});

const QueueListItem = ({ workItem, index, active }) => {
  const { selectWorkItem, acceptWorkItem, rejectWorkItem } = useValidationItemQueue();
  const name = useMemo(() => {
    return (workItem?.row?.image ?? "unnamed").split("/").pop();
  }, [workItem]);

  const status = useMemo(() => {
    return workItem.status;
  }, [workItem]);

  const displayStatus = useMemo(() => {
    return workItem.displayStatus;
  }, [workItem])

  const accuracy = useMemo(() => {
    return workItem.currentMemberWorkItem.accuracy;
  }, [workItem])

  const isOverlapped = useMemo(() => {
    return workItem.type === WORK_ITEM_TYPE.OVERLAP;
  }, [workItem])

  const isReview = useMemo(() => {
    return workItem.isReview;
  }, [workItem])

  const isSkipped = useMemo(() => {
    return workItem?.currentMemberWorkItem?.status === WORK_ITEM_STATUS.SKIPPED;
  })

  const reviewScore = useMemo(() => {
    return workItem.review_score;
  }, [workItem])

  return (
    <QueueListItemWrapper
      onClick={() => selectWorkItem(workItem.id)}
      active={active}
    >
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", paddingRight: "10px", alignSelf: "center", whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ display: "flex" }}>
        {isSkipped ? (
          <Tag color="red" style={{ marginRight: "20px", alignSelf: "center" }}>{workItem?.currentMemberWorkItem?.status}</Tag>
        ) : (
          <></>
        )}
        <div style={{ marginRight: "20px", alignSelf: "center" }}>{isOverlapped ? <FormatNumber number={accuracy} /> : '-'}</div>
        <div style={{ marginRight: "20px", alignSelf: "center" }}>{isReview ? <FormatNumber number={reviewScore} /> : '-'}</div>
        {active ? (
          status === "VALIDATION" ? (
            <Button.Group>
              <Button onClick={() => rejectWorkItem(workItem)} type="dashed" icon={<CloseOutlined />}></Button>
              <Button onClick={() => acceptWorkItem(workItem)} type="dashed" icon={<CheckOutlined />}></Button>
            </Button.Group>
          ) : status === "REVIEWING" ? (
            <Button.Group>
              <Button type="dashed" icon={<CloseOutlined />}></Button>
              <Button type="dashed" icon={<CheckOutlined />}></Button>
            </Button.Group>
          ) : status === "COMPLETED" ? (
            <Button.Group>
              <Button onClick={() => rejectWorkItem(workItem)} type="dashed" icon={<CloseOutlined />}></Button>
              <Button type="primary" icon={<CheckOutlined />}></Button>
            </Button.Group>
          ) : (
            <Button.Group>
              <Button type="primary" danger icon={<CloseOutlined />}></Button>
              <Button onClick={() => acceptWorkItem(workItem)} type="dashed" icon={<CheckOutlined />}></Button>
            </Button.Group>
          )
        ) : (
          status === "VALIDATION" ? (
            <Button.Group>
              <Button type="dashed" icon={<CloseOutlined />}></Button>
              <Button type="dashed" icon={<CheckOutlined />}></Button>
            </Button.Group>
          ) : status === "REVIEWING" ? (
            <Button.Group>
              <Button type="dashed" icon={<CloseOutlined />}></Button>
              <Button type="dashed" icon={<CheckOutlined />}></Button>
            </Button.Group>
          ) : status === "COMPLETED" ? (
            <Button.Group>
              <Button type="dashed" icon={<CloseOutlined />}></Button>
              <Button type="primary" icon={<CheckOutlined />}></Button>
            </Button.Group>
          ) : (
            <Button.Group>
              <Button type="primary" danger icon={<CloseOutlined />}></Button>
              <Button type="dashed" icon={<CheckOutlined />}></Button>
            </Button.Group>
          )
        )}
      </div>
    </QueueListItemWrapper >
  );
};

const QueueList = ({ workItems, currentId }) => {
  return (
    <List>
      {(workItems || []).map((workitem, index) => (
        <List.Item key={workitem.id} style={{ padding: "0" }}>
          <QueueListItem
            active={currentId === workitem.id}
            workItem={workitem}
          />
        </List.Item>
      ))}
    </List>
  );
};

export default QueueList;
