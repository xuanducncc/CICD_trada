import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import LocalDate from "@components/LocalDate/LocalDate";
import { useHistory } from "react-router";
import useProjectDetail from "../../ProjectDetailContext";
import FormatNumber from "@components/FormatNumber/FormatNumber";

export default function MembersPerformance({ labelers }) {
  const { projectId } = useProjectDetail();
  const history = useHistory();
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
      title: "Labeler",
      dataIndex: "user",
      key: "user_username",
      // eslint-disable-next-line react/display-name
      render: (user) => {
        return <Text>{user?.username}</Text>;
      },
    },
    {
      title: "Last benchmark",
      dataIndex: "benchmark_date",
      key: "benchmark_date",
      // eslint-disable-next-line react/display-name
      render: (time) => {
        return <LocalDate date={time} relative={true} />;
      },
      sorter: (a, b) =>
        Date.parse(a.benchmark_date) - Date.parse(b.benchmark_date),
    },
    {
      title: "Total items",
      dataIndex: "submit_count",
      key: "submit_count",
      // defaultSortOrder: 'descend',
      sorter: (a, b) => a.submit_count - b.submit_count,
    },
    {
      title: "Submitted rate",
      dataIndex: "completed_rate",
      key: "completed_rate",
      sorter: (a, b) => a.completed_rate - b.completed_rate,
    },
    {
      title: "Average score",
      dataIndex: "accuracy",
      key: "accuracy",
      // eslint-disable-next-line react/display-name
      render: (accuracy) => {
        return <FormatNumber number={accuracy} />;
      },
      sorter: (a, b) => a.accuracy - b.accuracy,
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="text"
            onClick={() =>
              history.push(
                `/i/projects/${projectId}/performance/member/${record.id}`
              )
            }
          >
            View Results <ArrowRightOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={labelers} columns={columns} size="small"></Table>;
}
