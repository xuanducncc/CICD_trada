import React, { useCallback, useState } from "react";
import Upload from "antd/lib/upload";
import Form from "antd/lib/form";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Col } from "antd";
import { FinishUpload } from "./FinishUpload";
import Text from "antd/lib/typography/Text";
const { Dragger } = Upload;

export const DatasetFormUpload = ({ handleUpload, uploadDatasetZip, onCompleted, setActiveForm, isSetting, numFileSuccess, numFileError }) => {
  const [files, setFiles] = useState([]);
  const [finish, setFinish] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [uploadToBrowser, setUploadToBrowser] = useState(false);
  const [filesError, setFilesError] = useState();

  const handleRequest = useCallback(
    async ({ onSuccess, onError, file, data }) => {
      try {
        onSuccess()
      } catch (error) {
        onError(error)
      }
    },
    [files, handleUpload, finish]
  );

  const handleChangeFile = (e) => {
    setFiles(e.fileList);
    const fileUploading = e.fileList.filter((file) => file.status === "uploading");
    if (fileUploading.length === 0) {
      setCanUpload(true)
      setUploadToBrowser(false);
    }
  }

  const handleUploadFile = useCallback(async () => {
    setUploadToBrowser(true)
    const listErr = []
    for (let idx = 0; idx < files.length; idx++) {
      if (files[idx].type === "application/x-zip-compressed") {
        const response = await uploadDatasetZip(files[idx].originFileObj);
        if (response.error) {
          listErr.push(files[idx].name)
        }
      } else {
        const response = await handleUpload(files[idx].originFileObj);
        if (response.error) {
          listErr.push(files[idx].name)
        }
      }
      setFilesError(listErr)
      if (Object.is(files.length - 1, idx)) {
        setFinish(true)
      }
    }
  }, [files, filesError, setFilesError, setUploadToBrowser, setFinish]);

  return (
    <>
      {finish ? (
        <FinishUpload
          isSetting={isSetting}
          setActiveForm={setActiveForm}
          files={files.length}
          numFileError={numFileError}
          numFileSuccess={numFileSuccess}
          filesError={filesError}
        />
      ) : (
        <Form.Item>
          <Col
            className="layout-content-text-title"
            style={{ marginBottom: "10px" }}
          >
            {files.length} files selected
      </Col>
          <Dragger
            disabled={uploadToBrowser === true}
            name={"file"}
            multiple={true}
            onChange={async (e) => {
              await handleChangeFile(e)
            }}
            showUploadList={false}
            customRequest={handleRequest}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Drop PNG, JPEG, MP4, or TXT files to upload.
            </p>
            <p>- OR -</p>
            <p className="ant-upload-hint">
              Contact support about upgrading to use self-hosted data.
            </p>
          </Dragger>
          <div style={{ marginTop: "30px" }}>
            <Text> Uploading : {numFileSuccess + numFileError}/ {files.length}</Text>
          </div>
          { canUpload === true && (
            <Button
              loading={(numFileError + numFileSuccess) !== files.length && (numFileError + numFileSuccess) !== 0}
              style={{ marginTop: "30px" }}
              type="primary"
              onClick={() => handleUploadFile()}
            >
              Start upload
            </Button>
          )}
        </Form.Item>
      )}
    </>

  );
};
