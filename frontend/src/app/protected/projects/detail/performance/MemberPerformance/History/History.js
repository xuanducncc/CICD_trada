import React from "react";
import LocalDate from "@components/LocalDate/LocalDate";
import { ACTION_LOG_ACTIONS } from "@utils/const";
import Tag from "antd/lib/tag";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import useMemberPerformance from "../MemberPerformanceContext";
import FormatNumber from "@components/FormatNumber/FormatNumber";

const History = () => {
  const { activities } = useMemberPerformance();
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // eslint-disable-next-line react/display-name
      render: (id, record, index) => {
        return <Text>{index + 1}</Text>;
      },
    },
    {
      title: "Type",
      dataIndex: "action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (action) => {
        switch (action) {
          case ACTION_LOG_ACTIONS.WORK_ITEM_SKIP: {
            return <Tag color="default">{action}</Tag>;
          }
          case ACTION_LOG_ACTIONS.WORK_ITEM_SUBMIT: {
            return <Tag color="success">{action}</Tag>;
          }
          default:
            return <Tag color="lime">{action}</Tag>;
        }
      },
    },
    {
      title: "Date Created",
      dataIndex: "action_time",
      key: "action_time",
      // eslint-disable-next-line react/display-name
      render: (time) => {
        return <LocalDate date={time} relative={true} />;
      },
    },
    {
      title: "Related",
      dataIndex: "value",
      key: "is_related",
      // eslint-disable-next-line react/display-name
      render: (value) => {
        return <Text>{value?.is_related ? "yes" : "No"}</Text>;
      },
    },
    {
      title: "Benchmark score",
      dataIndex: "value",
      key: "benchmark_score",
      // eslint-disable-next-line react/display-name
      render: (value) => {
        if (!value?.is_related) {
          return <Text>-</Text>;
        }
        return <Text>{<FormatNumber number={value?.accuracy} /> || "0"}%</Text>;
      },
    },
    {
      title: "Label time",
      dataIndex: "value",
      key: "label_time",
      // eslint-disable-next-line react/display-name
      render: (value) => {
        return <Text>{value?.working_time}s</Text>;
      },
    },
    {
      title: "Dataset",
      dataIndex: "value",
      key: "dataset_name",
      // eslint-disable-next-line react/display-name
      render: (value) => {
        return <Text>{value?.dataset_name}</Text>;
      },
    },
  ];

  return (
    <Table
      dataSource={activities}
      columns={columns}
      rowKey="id"
      size="small"
    ></Table>
  )
};

export default History;
