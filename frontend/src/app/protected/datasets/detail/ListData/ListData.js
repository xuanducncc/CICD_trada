import React, { useState } from "react";
import Table from "antd/lib/table";
import MediaDetail from "./MediaDetail";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import useListData from "./ListDataContext";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ListData = () => {
  const modalStyles = useStyles();
  const {
    error,
    medias,
    loading,
    deleteDataset,
    currentPage,
    totalPages,
    totalItems,
    updateParams,
  } = useListData();
  const [selectedImageId, setSelectedImageId] = useState(-1);

  const handleSelectImage = (id) => {
    setSelectedImageId(id);
  };
  const handleCloseModal = () => {
    setSelectedImageId(-1);
  };

  const handleDelete = () => {
    Modal.info({
      title: "Do you want to delete this dataset!",
      content: "this dataset will be delete",
      onOk: async () => {
        await deleteDataset();
      },
      okCancel: true,
      onCancel: () => {},
      okText: "Delete",
      cancelText: "Cancel",
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  const columns = [
    { title: "Dataset", dataIndex: "index", key: "index" },
    {
      title: "Image",
      dataIndex: "name",
      key: "image",
      // eslint-disable-next-line react/display-name
      render: (name, row) => {
        return <p onClick={() => handleSelectImage(row.id)}>{name}</p>;
      },
    },
    { title: "Created", dataIndex: "created", key: "created" },
  ];
  return (
    <>
      <Modal
        open={selectedImageId != -1}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={modalStyles.modal}
      >
        <MediaDetail id={selectedImageId} />
      </Modal>
      <Table
        loading={loading === "pending"}
        error={error}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={medias}
        pagination={{
          onChange: (page) => updateParams({ page }),
          current: currentPage,
          total: totalItems,
        }}
        size="small"
      />
    </>
  );
};
export default ListData;
