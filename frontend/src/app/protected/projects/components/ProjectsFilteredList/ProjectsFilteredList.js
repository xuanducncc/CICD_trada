import React, { useCallback, useState } from "react";
import Avatar from "antd/lib/avatar";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Dropdown from "antd/lib/dropdown";
import Input from "antd/lib/input";
import Menu from "antd/lib/menu";
import Row from "antd/lib/row";
import Table from "antd/lib/table";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useProjectsFilteredList } from "./ProjectsFilteredListContext";
import useProtected from "@components/Protected/ProtectedContext";
import ProjectActions from "./ProjectActions";
const getDate = (date) => {
  const newDate = new Date();
  const currDate = new Date(date);
  const day = Math.round((newDate - currDate) / (1000 * 60 * 60 * 24));
  let timeString;
  if (day) {
    timeString = day + " day";
  } else {
    const hour = Math.round((newDate - currDate) / (1000 * 60 * 60));
    if (hour) {
      timeString = hour + " hour";
    } else {
      const minutes = Math.round((newDate - currDate) / (1000 * 60));
      timeString = minutes + " minutes";
    }
  }
  return timeString;
};

export default function ProjectsFilteredList() {
  const { path, url } = useRouteMatch();
  const { isAdmin, user } = useProtected();
  const history = useHistory();
  const { projects, setSearchTerm, searchTerm } = useProjectsFilteredList();
  const data = projects;

  const columns = [
    {
      title: "A",
      dataIndex: "a",
      key: "a",
      // eslint-disable-next-line react/display-name
      render: (_, data) => {
        return (
          <Row justify="start" align="middle">
            <Avatar>{data.name.split("")[0]}</Avatar>
            <Col style={{ padding: "10px" }}>
              <Col style={{ fontSize: "1rem", fontWeight: "600" }}>
                {data.name}
              </Col>
              <Col>{data.description}</Col>
            </Col>
          </Row>
        );
      },
    },
    {
      title: "D",
      dataIndex: "d",
      key: "d",
      // eslint-disable-next-line react/display-name
      render: (_, data) => {
        return (
          <Row justify="end" align="middle">
            <Col style={{ textAlign: "end" }}>
              <Col className="project-info-style">{data.l} labels</Col>
              <Col className="project-info-style">
                Active {getDate(data.create_date)}
              </Col>
            </Col>
            {(isAdmin || data.owner_id === user.id) && (
              <Row>
                <Col>
                  <ProjectActions project={data} projectId={data.id} />
                </Col>
              </Row>
            )}
          </Row>
        );
      },
    },
  ];

  const handleNewProject = useCallback(() => {
    history.push("/i/projects/new");
  }, []);

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: "20px" }}>
        <Row>
          <Input
            placeholder="Search projects"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            prefix={<SearchOutlined />}
          ></Input>
        </Row>
        {isAdmin ? (
          <Button onClick={handleNewProject} type="primary">
            New Project
          </Button>
        ) : null}
      </Row>
      <Table
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={true}
        showHeader={false}
        rowKey="id"
        onRow={(b) => ({
          onClick: () =>
            history.replace({
              pathname: `/i/projects/${b.id}`,
              state: { isActive: true },
            }),
        })}
      ></Table>
    </div>
  );
}
