import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { DatasetFormUpload } from "../../create/DatasetFormUpload";
import useAddData from "./AddDataContext";

const AddData = () => {
  const {
    datasetId,
    handleUploadFile,
    uploadDatasetZip,
    numFileSuccess,
    numFileError,
  } = useAddData();
  const history = useHistory();
  const handleClose = useCallback(() => {
    history.replace(`/i/datasets/${datasetId}`);
  }, [history]);

  return (
    <DatasetFormUpload
      isSetting={true}
      setActiveForm={handleClose}
      handleUpload={handleUploadFile}
      uploadDatasetZip={uploadDatasetZip}
      numFileSuccess={numFileSuccess}
      numFileError={numFileError}
    />
  );
};

export default AddData;
