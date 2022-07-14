import Table from "antd/lib/table";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Text from "antd/lib/typography/Text";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button";
import Popover from "antd/lib/popover";
import { Link, useHistory, useLocation } from "react-router-dom";
import Space from "antd/lib/space";
import useProjectDetailQueue from "./QueueContext";
import { ArrowRightOutlined } from "@ant-design/icons";
import { WORK_ITEM_STATUS, PROJECT_MEMBER_ROLES } from "@utils/const";
import DropdownMenu from "../../overview/DropdownMenu";
import PageLayout from "@components/PageLayout/PageLayout";

export default function QueuePage() {
  const history = useHistory();
  const {
    queues,
    user,
    isAdminOrProjectAdmin,
    projectId,
    member,
    label,
    status,
    page,
    currentStatus,
    currentPage,
    totalPages,
    totalItems,
    updateParams,
    loading,
    error,
  } = useProjectDetailQueue();
  const ARR_WORK_ITEM_STATUS = [
    {
      label: "Pending",
      value: WORK_ITEM_STATUS.PENDING,
    },
    {
      label: "Reviewing",
      value: WORK_ITEM_STATUS.REVIEWING,
    },
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

  if (isAdminOrProjectAdmin) {
    ARR_WORK_ITEM_STATUS.push({
      label: "Annotation",
      value: WORK_ITEM_STATUS.ANNOTATION,
    });
  }

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      // eslint-disable-next-line react/display-name
      render: (id, record, index) => {
        return <Text>{currentPage * 10 + index + 1}</Text>;
      },
    },
    {
      title: "Labeler",
      dataIndex: "memberworkitem",
      key: "memberworkitem",
      // eslint-disable-next-line react/display-name
      render: (memberworkitem) => {
        // const selectedUser = isAdminOrProjectAdmin
        //   ? users?.find((u) => u.status !== WORK_ITEM_STATUS.ANNOTATION)
        //   : users?.find((u) => u.id === user.id);
        // const selectedUser = users?.find((u) => u.status !== WORK_ITEM_STATUS.ANNOTATION)
        // return <Link to={`/i/user/${selectedUser?.user_id}/profile`}>{selectedUser?.username || "None"}</Link>;
        const selectedUser = memberworkitem?.find(
          (m) => m?.role === PROJECT_MEMBER_ROLES.LABELER
        );
        return selectedUser?.member?.user?.username ? (
          <Link to={`/i/user/${selectedUser?.member?.user_id}/profile`}>
            {selectedUser?.member?.user?.username}
          </Link>
        ) : (
          "none"
        );
      },
    },
    {
      title: "Reviewer",
      dataIndex: "memberworkitem",
      key: "memberworkitem",
      // eslint-disable-next-line react/display-name
      render: (memberworkitem) => {
        // const selectedUser = isAdminOrProjectAdmin
        //   ? users?.find((u) => u.status !== WORK_ITEM_STATUS.ANNOTATION)
        //   : users?.find((u) => u.id === user.id);
        const selectedUser = memberworkitem?.filter(
          (m) => m?.role === PROJECT_MEMBER_ROLES.REVIEWER
        );
        const userReview = selectedUser?.filter((u) => u.status === "REVIEWED");
        const content = selectedUser?.map((u) => {
          return u?.member?.user?.username ? (
            <Link
              style={{ display: "flex", marginBottom: "5px" }}
              key={u?.id}
              to={`/i/user/${u?.member?.user_id}/profile`}
            >
              <Tag color={u.status === "REVIEWED" ? "green" : "yellow"}>
                {u?.member?.user?.username}
              </Tag>
            </Link>
          ) : (
            ""
          );
        });
        return (
          <Popover
            disabled={selectedUser.length === 0}
            content={content}
            trigger="hover"
          >
            <Text>
              {userReview?.length}/{selectedUser.length}
            </Text>
          </Popover>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space size="middle">
          <Button type="text" onClick={() => handlePreview(record)}>
            Preview <ArrowRightOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  const handlePreview = useCallback(
    (workItem) => {
      // const qid = workItem?.labelerMemberWorkItem?.queue_id;
      const wid = workItem.id;
      const workItemIdSlug = wid ? `wid=${wid}` : "";
      // const queueIdSlug = qid ? `qid=${qid}` : "";
      const statusSlug = page ? `status=${status}` : "";
      const pageSlug = page ? `page=${page}` : "";
      const labelSlug = label ? `label=${label}` : "";
      const searchParams = [workItemIdSlug, statusSlug, pageSlug, labelSlug]
        .filter((x) => x)
        .join("&");
      const searchUrl = searchParams ? `?${searchParams}` : "";
      history.push(`/i/projects/${projectId}/preview/${searchUrl}`);
    },
    [projectId, status, page, label]
  );

  return (
    <Col style={{ height: "100%" }}>
      <Row justify="space-between">
        <Col>
          <Text>Total Item : {totalItems}</Text>
        </Col>
        <Col>
          <DropdownMenu
            data={ARR_WORK_ITEM_STATUS}
            placeholder="select a status"
            onChange={(status) => updateParams({ status, page: 1 })}
            defaultValue={WORK_ITEM_STATUS.PENDING}
            value={currentStatus}
          />
        </Col>
      </Row>
      <PageLayout
        loading={loading === "pending"}
        isReady={loading === "fulfilled"}
        error={error}
        padding={0}
        height="80%"
      >
        <Table
          style={{ marginTop: "20px" }}
          dataSource={queues}
          columns={columns}
          pagination={{
            onChange: (page) => updateParams({ status: currentStatus, page }),
            pageSize: 10,
            current: currentPage,
            total: totalItems,
          }}
          size="middle"
          rowKey="id"
        ></Table>
      </PageLayout>
    </Col>
  );
}
