import React, { useState } from "react";
import LocalDate from "@components/LocalDate/LocalDate";
import { ACTION_LOG_ACTIONS } from "@utils/const";
import Tag from "antd/lib/tag";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import useProjectDetailActivities from "./ActivitiesContext";
import { Link } from "react-router-dom";
import PageLayout from "@components/PageLayout/PageLayout";
import { Col } from "antd";
import FormatNumber from "@components/FormatNumber/FormatNumber";
import useProjectDetail from "../../ProjectDetailContext";

export default function ActivityPage() {
  const { projectId } = useProjectDetail();
  const {
    fetchActivities,
    activities,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
  } = useProjectDetailActivities();

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   // eslint-disable-next-line react/display-name
    //   render: (id, record, index) => {
    //     return <Text>{(currentPage - 1) * 10 + index + 1}</Text>;
    //   },
    // },
    {
      title: "Date",
      dataIndex: "action_time",
      key: "action_time",
      // eslint-disable-next-line react/display-name
      render: (time) => {
        return <LocalDate date={time} relative={true} />;
      },
    },
    {
      title: "Actor",
      dataIndex: "user",
      key: "username",
      // eslint-disable-next-line react/display-name
      render: (user) => {
        return (
          <Link to={`/i/user/${user?.id}/profile`}>
            {user?.username ?? "Unknown"}
          </Link>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (action) => {
        switch (action) {
          case ACTION_LOG_ACTIONS.WORK_ITEM_SKIP: {
            return <Tag color="default">{action}</Tag>;
          }
          case ACTION_LOG_ACTIONS.WORK_ITEM_SUBMIT: {
            return <Tag color="blue">{action}</Tag>;
          }
          case ACTION_LOG_ACTIONS.WORK_ITEM_REVIEWED: {
            return <Tag color="purple">{action}</Tag>;
          }
          case ACTION_LOG_ACTIONS.WORK_ITEM_ACCEPTED: {
            return <Tag color="green">{action}</Tag>;
          }
          case ACTION_LOG_ACTIONS.WORK_ITEM_REJECTED: {
            return <Tag color="red">{action}</Tag>;
          }
          default:
            return <Tag color="lime">{action}</Tag>;
        }
      },
    },
    {
      title: "Work item",
      dataIndex: "workitem_id",
      key: "workitem_id",
      // eslint-disable-next-line react/display-name
      render: (workItemId) => {
        return (
          <Link to={`/i/projects/${projectId}/preview/?id=${workItemId}`}>
            #{workItemId}
          </Link>
        );
      },
    },
  ];
  return (
    <PageLayout
      loading={loading === "pending"}
      isReady={loading === "fulfilled"}
      error={error}
      padding={0}
    >
      <Col>
        <Table
          dataSource={activities}
          columns={columns}
          pagination={{
            onChange: (page) => fetchActivities({ page }),
            pageSize: 10,
            current: currentPage,
            total: totalItems,
          }}
          rowKey="id"
          size="small"
        ></Table>
      </Col>
    </PageLayout>
  );
}
