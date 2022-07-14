import React, { useCallback } from "react";
import useImageEditorToolConfiguration from "./ImageEditorToolConfigurationContext";
import Button from "antd/lib/button";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import RightOutlined from "@ant-design/icons/RightOutlined";
import Text from "antd/lib/typography/Text";
import { Table } from "antd";

const ImageEditorClassificationToolList = ({ tools, isSetting }) => {
  const {
    deleteTool,
    selectTool,
  } = useImageEditorToolConfiguration()
  const columns = [
    {
      title: 'color',
      dataIndex: 'color',
      key: 'color',
      // eslint-disable-next-line react/display-name
      render: color => (
        <div
          style={{
            width: "32px", height: "32px",
            backgroundColor: color
          }}
        />
      )
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line react/display-name
      render: name => (
        <Text>{name}</Text>
      )
    },
    {
      title: 'control',
      dataIndex: 'control',
      key: 'control',
      // eslint-disable-next-line react/display-name
      render: control => (
        <Text>{control}</Text>
      )
    },
    {
      title: 'action',
      dataIndex: 'id',
      key: 'id',
      width: "10%",
      // eslint-disable-next-line react/display-name 
      render: id => (
        <div style={{ display: "flex" }}>
          {isSetting ? (
            <Button
              disabled={true}
              type="text"
              title="Delete item"
              icon={<DeleteOutlined />}
            ></Button>
          ) : (
            <Button
              onClick={() => deleteTool(id)}
              type="text"
              title="Delete item"
              icon={<DeleteOutlined />}
            ></Button>
          )}
          <Button
            type="text"
            title="Item detail"
            onClick={() => selectTool(id)}
            icon={<RightOutlined />}
          ></Button>
        </div>
      )
    }
  ]
  return (
    <>
      {
        (tools.length !== 0) ?
          <Table style={{ width: "100%" }} columns={columns} size="large" dataSource={tools} pagination={false} showHeader={false} />
          :
          <></>
      }
    </>
  );
};

export default ImageEditorClassificationToolList;
