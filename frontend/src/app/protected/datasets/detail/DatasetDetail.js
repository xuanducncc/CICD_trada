import React, { useCallback, useState } from "react";

import Row from "antd/lib/row";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
// import PageHeader from "antd/lib/page-header";
import PageLayout from "../../../../components/PageLayout/PageLayout";
import { Redirect, useHistory, useRouteMatch } from "react-router-dom";
import DatasetListDetail from "./DatasetDetail";
import PageHeaderLayout from "@components/PageHeader/PageHeader";
import {
  withDatasetDetailContext,
  useDatasetDetail,
  DatasetDetailProvider,
} from "./DatasetDetailContext";
import { DatasetFormUpload } from "../create/DatasetFormUpload";
import Modal from "antd/lib/modal";
import Text from "antd/lib/typography/Text";
import { Switch, Route } from "react-router-dom";
import { useSearchParams } from "@core/hooks/useSearchParams";
import ListData from "./ListData";
import AddData from "./AddData";

const DatasetDetail = () => {
  const history = useHistory();
  const { dataset, datasetId, loading, error } = useDatasetDetail();

  const onBack = () => history.push("/i/f/datasets");
  const title = `Dataset / ${dataset?.name ?? datasetId}`;
  const subTitle = `#${datasetId}`;
  const { path } = useRouteMatch();

  const extra = (
    <>
      <Button
        key="3"
        type="primary"
        onClick={() => {
          history.push(`/i/dataset/${datasetId}/add`);
        }}
      >
        Add more data
      </Button>
    </>
  );

  return (
    <PageLayout
      padding={0}
      loading={loading === "pending"}
      isReady={loading === "fulfilled"}
      error={error}
      height="90vh"
    >
      <Row className="layout-content" justify="center">
        <Col md={22} lg={18} xl={16} xxl={14}>
          <Redirect
            path={`/i/dataset/${datasetId}`}
            exact
            to={`/i/dataset/${datasetId}/medias`}
          ></Redirect>
          <Route
            path={`/i/dataset/${datasetId}/:key`}
            render={({ match }) => {
              return (
                <PageHeaderLayout
                  onBack={onBack}
                  title={title}
                  subTitle={subTitle}
                  extra={extra}
                  footer={match.params.key === "medias" ? <ListData /> : <AddData />}
                />
              );
            }}
          />
        </Col>
      </Row>
    </PageLayout>
  );
};
export default DatasetDetail;
