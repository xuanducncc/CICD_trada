import Col from "antd/lib/col";
import Avatar from "antd/lib/avatar";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Row from "antd/lib/row";
import Table from "antd/lib/table";
import Input from "antd/lib/input";

import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import useDatasetPage from "@app/protected/datasets/DatasetPageContext";
import ButtonConfirmDelete from "@app/protected/datasets/components/ButtonConfirmDelete";
import PageLayout from "@components/PageLayout/PageLayout";
export default function DatasetsComponent() {
  const history = useHistory();
  const historyCallback = useCallback(() => history.push("/i/dataset/new"));
  const {
    datasets,
    datasetLoading,
    error,
    setSearchTerm,
    searchTerm,
  } = useDatasetPage();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line react/display-name
      render: (_, data) => {
        return (
          <Row justify="start" align="middle">
            <Avatar>{data.name.split("")[0]}</Avatar>
            <Col style={{ padding: "10px" }}>
              <Col style={{ fontSize: "1rem", fontWeight: "600" }}>
                {data.name}
              </Col>
            </Col>
          </Row>
        );
      },
    },
    {
      title: "Row",
      dataIndex: "row",
      key: "row",
      // eslint-disable-next-line react/display-name
      render: (_, data) => {
        return (
          <Row justify="end" align="middle">
            <Col style={{ textAlign: "end" }}>
              <Col className="project-info-style">
                {data.projects.length} projects
              </Col>
              <Col className="project-info-style">{data.num_photos} items</Col>
            </Col>
            <Row>
              <Col>
                <ButtonConfirmDelete selectedId={data.id} />
              </Col>
            </Row>
          </Row>
        );
      },
    },
  ];
  return (
    <Col>
      <Row align="top" justify="space-between" style={{ marginBottom: "20px" }}>
        <Row>
          <Input
            placeholder="Search datasets"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            prefix={<SearchOutlined />}
          ></Input>
        </Row>
        <Button type="primary" onClick={historyCallback}>
          New Dataset
        </Button>
      </Row>
      <PageLayout
        padding={0}
        loading={datasetLoading === "pending"}
        isReady={datasetLoading === "fulfilled"}
        error={error}
        height="60vh"
      >
        <Table
          size="middle"
          columns={columns}
          dataSource={datasets}
          pagination={true}
          showHeader={false}
          rowKey="id"
          onRow={(row) => ({
            onClick: () => history.push(`/i/dataset/${row.id}`),
          })}
        ></Table>
      </PageLayout>
    </Col>
  );
}
