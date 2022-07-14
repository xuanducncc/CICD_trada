import React from "react";
import Col from "antd/lib/col";
import Table from "antd/lib/table";
import Space from "antd/lib/space";
import Button from "antd/lib/button";
import Text from "antd/lib/typography/Text";
import LocalDate from "@components/LocalDate/LocalDate";
import useProjectDetail from "../../../ProjectDetailContext";
import useProjectDetailSettingDataset from "./ProjectDetailSettingDatasetContext";

const Tables = ({ data, onClick, isDetach }) => {
  const column = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Rows",
      dataIndex: "num_photos",
      key: "num_photos",
      // eslint-disable-next-line react/display-name
      render: (rows) => {
        return <Text>{rows ? rows : 0}</Text>
      },
    },
    {
      title: "Created",
      dataIndex: "create_date",
      key: "create_date",
      // eslint-disable-next-line react/display-name
      render: (time) => {
        return <LocalDate date={time} />
      }
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => onClick(record.id)}
            danger={isDetach}
            disabled={isDetach ? true : false}
          >
            {isDetach ? "Detach" : "Attach"}
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Table
      tableLayout="fixed"
      rowKey="id"
      dataSource={data}
      columns={column}
      size="small"
      pagination={true}
    ></Table>
  );
};

export default function DatasetPage() {
  const { project } = useProjectDetail();
  const {
    datasetList,
    attachDataset,
    detachDataset,
  } = useProjectDetailSettingDataset();
  // const { datasets } = project;

  const onClickAttach = (dataset_id) => attachDataset(dataset_id);
  const onClickDetach = (dataset_id) => detachDataset(dataset_id);

  return (
    <Col>
      <Col className="layout-content-overview">
        <Col className="trada-custom-date">Attached</Col>
        <Tables data={project?.dataset_list || []} onClick={onClickDetach} isDetach={true} />
      </Col>
      <Col className="layout-content-overview">
        <Col className="trada-custom-date">Available</Col>
        <Tables
          data={(datasetList || []).filter(
            (r) => !project?.dataset_list?.map((d) => d.id).includes(r.id) && r
          )}
          onClick={onClickAttach}
          isDetach={false}
        />
      </Col>
    </Col>
  );
}
