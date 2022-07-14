import { Button, Input, Row, Col } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useCallback, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import useChooseData from "./ChooseDataContext";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";
import DatasetComponent from "@components/Dataset/Dataset";

const AddData = () => {
  const [open, setOpen] = React.useState(false);
  const { createDataset, uploadDataset, onHandleClose, uploadDatasetZip, numFileError, numFileSuccess } = useChooseData();
  const [value, onChange] = useState("");
  const formRef = React.createRef()
  const [isCreate, setCreateForm] = useState(false)
  const [isCreateNew, setCreateNew] = useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setCreateNew(false)
    setOpen(false);
    onHandleClose();
  };

  const onSubmit = () => {
    formRef?.current
      ?.validateFields()
      .then((values) => {
        createDataset(value);
        setCreateNew(true);
        onChange("");
      })
      .catch((error) => { });
  };


  const handleUpload = async (file) => {
    return uploadDataset(file);
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div>
      <Row justify="end">
        <Col>
          <Button type="primary" ghost onClick={handleClickOpen}>
            Add Data
          </Button>
        </Col>
      </Row>
      <Row>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth="lg"
          maxWidth="lg"
          fullScreen={fullScreen}
          style={{ minHeight: "450px", zIndex: "0" }}
        >
          <Col style={{ height: "1000px" }}>
            <DatasetComponent
              onSubmit={onSubmit}
              onChange={onChange}
              handleClose={handleClose}
              name={value}
              handleUpload={handleUpload}
              isCreate={isCreate}
              formRef={formRef}
              isCreateNew={isCreateNew}
              uploadDatasetZip={uploadDatasetZip}
              numFileError={numFileError}
              numFileSuccess={numFileSuccess}
            />
          </Col>
        </Dialog>
      </Row>
    </div>
  );
};

export default AddData;
