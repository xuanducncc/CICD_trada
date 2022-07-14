
import useChooseData from "./ChooseDataContext";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import React from "react";
import LocalDate from "@components/LocalDate/LocalDate";
import { Button } from "antd";

const AvailableData = () => {
  const { attachDataset, availableDatasets } = useChooseData();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
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
      dataIndex: "action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (_, row) => {
        return (<Button type="primary" onClick={() => attachDataset(row.id)}>Attach</Button>)
      }
    }
  ];
  return (
    <div>
      {availableDatasets && <Table
        tableLayout="fixed"
        dataSource={availableDatasets}
        columns={columns}
        pagination={true}
      ></Table>}
    </div>
  );
};

export default AvailableData;
