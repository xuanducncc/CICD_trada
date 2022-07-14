import React, { useMemo } from "react";
import List from "antd/lib/list";
import { styled } from "@material-ui/styles";

const QueueListItemWrapper = styled("div")({
  backgroundColor: ({ active }) => (active ? "#40a9ffcc" : "transparent"),
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  padding: "10px",
  cursor: "pointer",
});

const QueueListItem = ({ workItem, index, active }) => {

  const name = useMemo(() => {
    return (workItem?.row?.image ?? "unnamed").split('/').pop();
  }, [workItem]);

  const status = useMemo(() => {
    return workItem.status;
  }, [workItem]);

  return (
    <QueueListItemWrapper active={active}>
      {/* <div>{index}</div> */}
      <div style={{ overflow: "hidden", textOverflow: "ellipsis", paddingRight: "10px", whiteSpace: "nowrap" }}>{name}</div>
      <div>{status}</div>
    </QueueListItemWrapper>
  );
};

const QueueList = ({ workItems, currentId, setCurrentId }) => {

  return (
    <List>
      {(workItems || []).map((wi, index) => (
        <List.Item onClick={() => setCurrentId(wi.id)} key={wi.id}>
          <QueueListItem
            index={index}
            active={currentId === wi.id}
            workItem={wi}
          />
        </List.Item>
      ))}
    </List>
  );
};

export default QueueList;
