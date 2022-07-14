import Table from "antd/lib/table";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Text from "antd/lib/typography/Text";
import { ArrowRightOutlined } from "@ant-design/icons";
import { WORK_ITEM_STATUS } from "@utils/const";
import DropdownMenu from "../../overview/DropdownMenu";
import useValidation from "./ValidationContext";
import PageLayout from "@components/PageLayout/PageLayout";
export default function ValidationPage() {
  const history = useHistory();
  const {
    queues,
    currentPage,
    currentStatus,
    totalItems,
    updateParams,
    projectId,
    loading,
    error,
    page,
  } = useValidation();

  const ARR_WORK_ITEM_STATUS = [
    {
      label: "Validation",
      value: WORK_ITEM_STATUS.VALIDATION,
    },
    {
      label: "Completed",
      value: WORK_ITEM_STATUS.COMPLETED,
    },
    {
      label: "Rejected",
      value: WORK_ITEM_STATUS.REJECTED,
    },
  ];
  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      // eslint-disable-next-line react/display-name
      render: (id, record, index) => {
        return <Text>{(currentPage - 1) * 10 + index + 1}</Text>;
      },
    },
    {
      title: "Labeler",
      dataIndex: "member",
      key: "member",
      // eslint-disable-next-line react/display-name
      render: (member) => {
        return (
          <Link to={`/i/user/${member?.user?.id}/profile`}>
            {member?.user?.username}
          </Link>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Size",
      dataIndex: "size_item",
      key: "size_item",
    },
    {
      title: "Submitted",
      dataIndex: "submited_item",
      key: "submited_item",
    },
    {
      title: "Skipped",
      dataIndex: "skipped_item",
      key: "skipped_item",
    },
    {
      title: "Validation",
      dataIndex: "validation",
      key: "validation",
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space size="middle">
          <Button type="text" onClick={() => handleValidation(record.id)}>
            Validate <ArrowRightOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  const handleValidation = useCallback(
    (qid) => {
      history.push(`/i/projects/${projectId}/validation/${qid}`);
    },
    [projectId]
  );

  return (
    <PageLayout
      loading={loading === "pending"}
      error={error}
      isReady={loading === "fulfilled"}
      padding={0}
    >
      <Col>
        <Row justify="space-between" style={{ marginBottom: "20px" }}>
          <Col>
            <Text>Total Item : {totalItems}</Text>
          </Col>
          <Col>
            <DropdownMenu
              placeholder="select a status"
              data={ARR_WORK_ITEM_STATUS}
              onChange={(status) => updateParams({ status, page: 1 })}
              defaultValue={WORK_ITEM_STATUS.VALIDATION}
              value={currentStatus}
            />
          </Col>
        </Row>
        <Table
          style={{ marginTop: "20px" }}
          dataSource={queues}
          columns={columns}
          pagination={{
            onChange: (page) => updateParams({ page, status: currentStatus }),
            pageSize: 10,
            current: currentPage,
            total: totalItems,
          }}
          size="middle"
          rowKey="id"
        ></Table>
      </Col>
    </PageLayout>
  );
}
