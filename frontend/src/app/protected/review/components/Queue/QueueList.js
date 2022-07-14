import React, { useMemo } from "react";
import List from "antd/lib/list";
import { Button } from 'antd';
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import { styled } from "@material-ui/styles";
import useReview from "../../ReviewPageContext";

const QueueListItemWrapper = styled("div")({
  backgroundColor: ({ active }) => (active ? "#2876d4" : "transparent"),
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  padding: "20px 10px 20px 20px",
  cursor: "pointer",
});

const QueueListItem = ({ workItem, active }) => {
  const { selectWorkItem } = useReview();
  const name = useMemo(() => {
    return (workItem?.row?.image ?? "unnamed").split("/").pop();
  }, [workItem]);

  const status = useMemo(() => {
    return workItem.status;
  }, [workItem]);

  const displayStatus = useMemo(() => {
    return workItem.displayStatus;
  }, [workItem])

  return (
    <QueueListItemWrapper
      onClick={() => selectWorkItem(workItem.id)}
      active={active}
    >
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", paddingRight: "10px", whiteSpace: "nowrap" }}>{name}</div>
      <div>{displayStatus}</div>
    </QueueListItemWrapper >
  );
};

const QueueList = ({ workItems, currentId, setCurrentId }) => {
  return (
    <List>
      {(workItems || []).map((workitem, index) => (
        <List.Item
          onClick={() => setCurrentId(workitem.id)}
          key={workitem.id}
          style={{ padding: "0" }}
        >
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

