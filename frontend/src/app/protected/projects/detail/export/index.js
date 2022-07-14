import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Switch from "antd/lib/switch";
import React, { useState, useCallback } from "react";
import DropdownMenu from "../overview/DropdownMenu";
import { useSelector, useDispatch } from "react-redux";
import useProjectDetailOverview, {
  withProjectDetailOverviewContext,
} from "../overview/ProjectOverviewContext";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { useRouteMatch } from "react-router-dom";
import { ExportContextProvider, useExportContext } from "./ExportContext";
import { Typography } from "antd";
const { Text } = Typography;

export const ExportPage = () => {
  return (
    <ExportContextProvider>
      <Page />
    </ExportContextProvider>
  );
};

export const Page = () => {
  const { exportLoadingState, handleExport } = useExportContext();
  // const [format]
  const [format, setFormat] = useState("ZIP");
  const { overview } = useProjectDetailOverview();
  const data = [
    { label: "ZIP", value: "ZIP" },
    { label: "Another", value: "Another" },
  ];

  const [defaultChecked, SetChecked] = useState(false);
  const onChange = (checked) => SetChecked(checked);
  const onChangeFormat = (value) => setFormat(value);
  return (
    <ExportContextProvider>
      <Col md={12} sm={12} xl={12} xxl={12}>
        <Row>
          {overview?.workitem_completed === 0 ? (
            <Text type="danger">No data available to export</Text>
          ) : (
            "Export " + overview?.workitem_completed + " labels "
          )}
        </Row>
        <br />
        <Row justify="space-between">
          <Col>
            <Row>Export format</Row>
            <Row className="layout-content-text-title">
              Choose the type of export
            </Row>
          </Col>
          <Col>
            <DropdownMenu
              data={data}
              mapDataFromKey={() => {}}
              onChange={onChangeFormat}
            />
          </Col>
        </Row>
        <br />
        <Row justify="space-between">
          <Col>
            <Row>Email notification</Row>
            <Row className="layout-content-text-title">
              Email me a link for downloading my export when it is ready
            </Row>
          </Col>
          <Col>
            <Switch
              size="small"
              defaultChecked={defaultChecked}
              onChange={onChange}
            ></Switch>
          </Col>
        </Row>
        <br />
        <Button
          onClick={() => {
            handleExport(format);
          }}
          type="primary"
          loading={exportLoadingState === "pending"}
        >
          Generate Export
        </Button>
      </Col>
    </ExportContextProvider>
  );
};

// export ExportPage
export default withProjectDetailOverviewContext(ExportPage);
