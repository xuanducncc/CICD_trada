
import Text from "antd/lib/typography/Text";
import React from "react";
import Table from 'antd/lib/table';
import { Button } from "antd";
import LocalDate from "@components/LocalDate/LocalDate";
import useChooseData from "./ChooseDataContext";

const AttachedData = () => {
  const { detachDataset, attachedDatasets } = useChooseData();
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
        return time ? <LocalDate date={time} /> : "-"
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (_, row) => {
        return (<Button type="primary" onClick={() => detachDataset(row.id)} danger>Detach</Button>)
      }
    }
  ];

  return (
    <div>
      <Table tableLayout="fixed" dataSource={attachedDatasets || []} columns={columns} pagination={false}></Table>
    </div>
  );
};

export default AttachedData;
