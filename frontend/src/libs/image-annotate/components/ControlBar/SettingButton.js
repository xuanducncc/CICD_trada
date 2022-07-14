import React, { useMemo } from "react";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import Dropdown from 'antd/lib/dropdown';
import List from "antd/lib/list";
import Button from "antd/lib/button";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import { Link } from "react-router-dom";

const ShortcutButton = () => {
  const overlay = useMemo(
    () => (
      <List>
        <List.Item style={{ padding: 6 }}>
          <div>
            <Link to={"/docs"} target="_blank" style={{ color: "#000" }}>User guide</Link>
            <div></div>
          </div>
        </List.Item>
      </List>
    ),
    []
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type="text" icon={<SettingOutlined />}></Button>
    </Dropdown>
  );
};

export default ShortcutButton;
