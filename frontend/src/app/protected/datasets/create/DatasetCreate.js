import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Tabs from "antd/lib/tabs";
import React, { useCallback, useState } from "react";
import PageLayout from "../../../../components/PageLayout/PageLayout";
import { withDatasetPageContext, useDatasetPage } from "../DatasetPageContext";

import { InfoCircleOutlined } from "@ant-design/icons";

import { DatasetFormUpload } from "./DatasetFormUpload";
import { UploadForm } from "./DatasetSubmitForm";
import { useHistory } from "react-router-dom";
import DatasetComponent from "@components/Dataset/Dataset";
import useDatasetCreation from "./DatasetCreationContext";
const { TabPane } = Tabs;

const DatasetCreate = () => {
  const {
    createDataset,
    uploadDataset,
    formData,
    setFormData,
    uploadDatasetZip,
    numFileError,
    numFileSuccess,
    resetNumfile
  } = useDatasetCreation();
  const history = useHistory();
  const formRef = React.createRef()
  const handleUpload = async (file) => {
    return uploadDataset(file);
  };

  const handleChangeName = (name) => {
    setFormData({ name, updated: { name: true } });
  };

  const handleSubmitForm = useCallback(() => {
    const name = formData.name;
    formRef?.current
      ?.validateFields()
      .then((values) => {
        if (createDataset({ name, projects: [] })) {
          setCreateForm(true)
        }
      })
      .catch((error) => { });
  }, [formData, formRef.current])

  const handleClose = useCallback(() => {
    resetNumfile();
    history.goBack();
  }, [history]);

  const [isCreate, setCreateForm] = useState(false)

  return (
    <PageLayout>
      <DatasetComponent
        value={formData}
        handleClose={handleClose}
        onChange={handleChangeName}
        onSubmit={handleSubmitForm}
        handleUpload={uploadDataset}
        uploadDatasetZip={uploadDatasetZip}
        isCreate={isCreate}
        formRef={formRef}
        numFileError={numFileError}
        numFileSuccess={numFileSuccess}
      />
    </PageLayout>
  );
};

export default withDatasetPageContext(DatasetCreate);
