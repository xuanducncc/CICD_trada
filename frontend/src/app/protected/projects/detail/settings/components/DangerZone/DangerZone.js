import Button from "antd/lib/button";
import React from "react";
import { useHistory } from "react-router";
import Modal from "antd/lib/modal";
import useProjectDetailSetting from "../../contexts/ProjectDetailSettingContext";
export default function DangerZonePage() {
    const history = useHistory();
    const { deleteProject } = useProjectDetailSetting();
    const handleDelete = () => {
        Modal.info({
            title: "Do you want to delete this project!",
            content:
                "this project will be delete",
            onOk: async () => {
                await deleteProject();
                history.push("/");
            },
            okCancel: true,
            onCancel: () => {
            },
            okText: "Delete",
            cancelText: "Cancel",
        });
    }
    return (
        <Button
            type="primary"
            onClick={() => {
                handleDelete()
            }}
            danger
        >Delete Project</Button>
    );
}
