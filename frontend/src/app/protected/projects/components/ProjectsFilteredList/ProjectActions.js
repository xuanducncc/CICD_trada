import React, { useState } from "react";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import { Popconfirm, Popover } from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import useProjectsFilteredList from "./ProjectsFilteredListContext";
import { PROJECT_MEMBER_ROLES } from "@utils/const";
import useProtected from "@components/Protected/ProtectedContext";

const ProjectActions = ({ projectId, project }) => {
  const [visible, setVisible] = useState(false);
  const { deleteProject } = useProjectsFilteredList();
  const { isAdmin, user } = useProtected();

  const menu = () => {
    const handleDelete = () => {
      setVisible(false);
      deleteProject(projectId);
    };
    return (
      <Menu style={{ width: "150px" }} align="middle">
        {(isAdmin || project.owner_id === user.id) && (
          <Menu.Item>
            <Popconfirm
              title="Are you sure to delete this project?"
              onConfirm={handleDelete}
              onCancel={() => {
                setVisible(false);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ width: "100%" }}
                type="text"
                danger
                size="middle"
              >
                Delete
              </Button>
            </Popconfirm>
          </Menu.Item>
        )}
      </Menu>
    );
  };
  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  return (
    <Button
      style={{
        border: "none",
        fontSize: "1.5rem",
        padding: "0 5px",
        borderRadius: "50%",
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <MoreOutlined />
      </Dropdown>
    </Button>
  );
};

export default ProjectActions;
