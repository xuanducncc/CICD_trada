import { InfoCircleOutlined } from "@ant-design/icons";
import Button from "antd/lib/button";
import Upload from "antd/lib/upload";
import Form from "antd/lib/upload";
import Text from "antd/lib/typography/Text";
import { useHistory } from "react-router-dom";
import { DatasetFormUpload } from "@app/protected/datasets/create/DatasetFormUpload";
import { UploadForm } from "@app/protected/datasets/create/DatasetSubmitForm";
import { Col, Row, Tabs } from "antd";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import PageHeaderLayout from "@components/PageHeader/PageHeader";
import React, { useState } from "react";

const { TabPane } = Tabs;
const DatasetComponent = ({
  onSubmit,
  onChange,
  value,
  handleUpload,
  handleSubmit,
  handleClose,
  isCreate,
  formRef,
  isCreateNew,
  name,
  uploadDatasetZip,
  numFileError,
  numFileSuccess
}) => {
  const history = useHistory();
  const onBack = () => history.push(`/i/dataset/${value?.id}`);
  const title = `Dataset: ${value?.name}`;
  return (
    !isCreate ? (
      <Row className="layout-content" justify="center">
        <Col md={22} lg={18} xl={16} xxl={14}>
          <Row justify="space-between">
            <h1>Add data source</h1>
            <h1>
              <Button
                type="ghost"
                onClick={handleClose}
                icon={<CloseOutlined />}
              ></Button>
            </h1>
          </Row>
          <hr />
          <Row justify="space-between">
            <Col style={{ padding: "0px 20px" }}>
              <UploadForm
                onSubmit={onSubmit}
                onChange={onChange}
                value={value?.name}
                formRef={formRef}
              />
              {isCreateNew ? (
                <DatasetFormUpload
                  isSetting={false}
                  handleUpload={handleUpload}
                  uploadDatasetZip={uploadDatasetZip}
                  numFileError={numFileError}
                  numFileSuccess={numFileSuccess}
                />
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    ) : (
      <>
        <Row justify="center">
          <Col md={22} lg={18} xl={16} xxl={14}>
            <PageHeaderLayout
              onBack={onBack}
              title={title}
            />
            <DatasetFormUpload
              isSetting={true}
              setActiveForm={() => onBack()}
              handleUpload={handleUpload}
              uploadDatasetZip={uploadDatasetZip}
              numFileError={numFileError}
              numFileSuccess={numFileSuccess}
            />
          </Col>
        </Row>
      </>
    )
  );
};
export default DatasetComponent;
