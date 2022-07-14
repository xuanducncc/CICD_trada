import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import React, { useMemo, useState } from "react";
import { Popconfirm, Switch, Tag } from "antd";
import AddMemberComponent from "../../../../../components/Projects/add-member";
import useUsersListRequester from "@core/hooks/useUsersListRequester";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Checkbox } from "antd";

export default function ProjectMemberSettingsForm({
  members,
  onAddMember,
  onRemoveMember,
  onAcceptMember,
  handleChangeRoleMember,
  isSetting,
  updateMemberActivation,
}) {
  const { users } = useUsersListRequester({});
  const history = useHistory();

  const availableUsers = useMemo(() => {
    return users?.filter(
      (u) =>
        members?.every((m) => m.user.id !== u.id) && u.is_superuser === false
    );
  }, [users, members]);

  const PROJECT_MEMBER_ROLES = [
    {
      label: "Admin",
      value: "ADMIN",
    },
    {
      label: "Labeler",
      value: "LABELER",
    },
    {
      label: "Reviewer",
      value: "REVIEWER",
    },
  ];

  const deleteView = (_, record) => {
    if (record.status === "REQUESTED") {
      return (
        <Row style={{ flexDirection: "column" }}>
          <Popconfirm
            title="Sure to accept?"
            onConfirm={() => handleJoinStatus({ ...record, action: "accept" })}
          >
            <a>Accept</a>
          </Popconfirm>
          <Popconfirm
            title="Sure to reject?"
            onConfirm={() => handleJoinStatus({ ...record, action: "reject" })}
          >
            <a>Reject</a>
          </Popconfirm>
        </Row>
      );
    }
    return (
      <Popconfirm
        title="Sure to delete?"
        onConfirm={() => handleDelete(record.id)}
      >
        <a>Delete</a>
      </Popconfirm>
    );
  };

  const renderUser = (member) => {
    return member.user ? (
      <Link to={`/i/user/${member?.user?.id}/profile`}>
        {member.user.username}
      </Link>
    ) : null;
  };

  const columns = [
    {
      title: "User",
      key: "user",
      width: "30%",
      render: renderUser,
    },
    {
      title: "Admin",
      dataIndex: "role",
      key: "role",
      // eslint-disable-next-line react/display-name
      render: (role, row, index) => {
        return (
          <Checkbox
            checked={role.find((r) => r.name === "ADMIN") ? true : false}
            onChange={(e) => {
              if (isSetting) {
                handleChangeRoleMember({
                  role: "ADMIN",
                  id: row.id,
                  action: e.target.checked,
                });
              } else {
                e.preventDefault();
              }
            }}
          ></Checkbox>
        );
      },
    },
    {
      title: "Labeler",
      dataIndex: "role",
      key: "role",
      // eslint-disable-next-line react/display-name
      render: (role, row, index) => {
        return (
          <Checkbox
            checked={role.find((r) => r.name === "LABELER") ? true : false}
            onChange={(e) => {
              if (isSetting) {
                handleChangeRoleMember({
                  role: "LABELER",
                  id: row.id,
                  action: e.target.checked,
                });
              } else {
                e.preventDefault();
              }
            }}
          ></Checkbox>
        );
      },
    },
    {
      title: "Reviewer",
      dataIndex: "role",
      key: "role",
      // eslint-disable-next-line react/display-name
      render: (role, row, index) => {
        return (
          <Checkbox
            checked={role.find((r) => r.name === "REVIEWER") ? true : false}
            onChange={(e) => {
              if (isSetting) {
                handleChangeRoleMember({
                  role: "REVIEWER",
                  id: row.id,
                  action: e.target.checked,
                });
              } else {
                e.preventDefault();
              }
            }}
          ></Checkbox>
        );
      },
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Activation",
      dataIndex: "is_active",
      key: "is_active",
      // eslint-disable-next-line react/display-name
      render: (activate, record) => {
        return (
          <Switch
            onChange={(checked) =>
              updateMemberActivation({ memberId: record.id, active: checked })
            }
            checked={activate}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: deleteView,
    },
  ].filter((col) => (!isSetting ? !["activate"].includes(col.key) : true));

  const handleDelete = (id) => {
    onRemoveMember(id);
  };
  const handleAddMember = (newMember) => {
    onAddMember(newMember);
  };
  const handleJoinStatus = (member) => {
    onAcceptMember(member);
  };
  return (
    <Col>
      <AddMemberComponent
        users={availableUsers}
        onAddMember={handleAddMember}
      />
      <Table
        tableLayout="fixed"
        rowKey="id"
        columns={columns}
        dataSource={members}
        size="large"
        pagination={true}
      ></Table>
    </Col>
  );
}
