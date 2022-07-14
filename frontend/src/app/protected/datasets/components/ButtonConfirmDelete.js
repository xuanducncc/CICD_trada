import React, { useState } from "react";
import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import { Popconfirm, Popover } from 'antd';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons'
import useDatasetPage from "../DatasetPageContext";


const ButtonConfirmDelete = ({ selectedId }) => {
  const [visible, setVisible] = useState(false);
  const { deleteDataset } = useDatasetPage();

  const menu = () => {
    const handleDelete = () => {
      setVisible(false);
      deleteDataset(selectedId);
    }
    return (
      <Menu style={{ width: "150px" }}
        align="middle"
      >
        <Menu.Item>
          <Popconfirm
            title="Are you sure to delete this dataset?"
            onConfirm={handleDelete}
            onCancel={() => { setVisible(false) }}
            okText="Yes"
            cancelText="No"
          >
            <Button style={{ width: "100%" }} type="text" danger size="middle" >Delete</Button>
          </Popconfirm>,
          </Menu.Item>
      </Menu>
    )
  };
  const handleVisibleChange = (visible) => {
    setVisible(visible);
  }
  return (
    <Button
      style={{
        border: "none",
        fontSize: "1.5rem",
        padding: "0 5px",
        borderRadius: "50%"
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Dropdown
        overlay={menu}
        trigger={['click']}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <MoreOutlined />
      </Dropdown>
    </Button>
  )
}

export default ButtonConfirmDelete;