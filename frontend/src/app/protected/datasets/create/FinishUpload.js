import React, { useCallback, useState } from "react";
import Form from "antd/lib/form";
import { InboxOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, List, Typography, Divider, Tag, Result } from "antd";
import Text from "antd/lib/typography/Text";
import useDatasetCreation from "./DatasetCreationContext";
import { SmileOutlined } from '@ant-design/icons';

export const FinishUpload = ({ files, filesError, setActiveForm, isSetting, numFileError, numFileSuccess }) => {
  const history = useHistory();
  const { fetchDataset, resetNumfile, formData } = useDatasetCreation();
  const onBack = () => {
    history.replace(`/i/dataset/${formData.id}/medias`);
  }
  const padding = isSetting ? "20px" : "20px 0";
  return (
    (files - numFileSuccess > 0) ? (
      <Row style={{ display: "grid", padding: padding }}>
        <Row style={{ marginBottom: "20px", justifyContent: "space-between" }}>
          <Col>
            <Tag style={{ padding: "5px 5px" }} color="success">You have {numFileSuccess} file success and {files - numFileSuccess} file error</Tag>
          </Col>
          {isSetting ? (
            <Col>
              <Button type="primary" onClick={onBack}>Finish</Button>
            </Col>
          ) : (
            <></>
          )}
        </Row>
        <Row>
          <List
            style={{ width: "100%" }}
            header={<div>List File Error!</div>}
            bordered
            dataSource={filesError}
            renderItem={item => (
              <List.Item>
                <Typography.Text>{item}</Typography.Text>
              </List.Item>
            )}
          />
        </Row>
      </Row>
    ) : (
      <Row style={{ display: "grid", padding: padding }}>
        <Row style={{ marginBottom: "20px", justifyContent: "space-between" }}>
          <Col>
            <Tag style={{ padding: "5px 5px" }} color="success">You have {numFileSuccess} file success and {files - numFileSuccess} file error</Tag>
          </Col>
        </Row>
        <Result
          icon={<SmileOutlined />}
          title="Upload all file successfully!"
          extra={isSetting ? <Button onClick={onBack} type="primary">Finish</Button> : <></>}
        />
      </Row>
    )
  );
};
