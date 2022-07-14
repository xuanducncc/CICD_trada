import React, { useMemo, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import RenderLineChart from "./LineCharts";
import DropdownMenu from "./DropdownMenu";
import useProjectDetailOverview from "./ProjectOverviewContext";
import { IMAGE_ANNOTATION_TYPE, WORK_ITEM_STATUS } from "@utils/const";
import PageLayout from "@components/PageLayout/PageLayout";
import useProjectDetail from "../ProjectDetailContext";
import FormatNumber from "@components/FormatNumber/FormatNumber";
import { Link } from "react-router-dom";

const LABEL_COUNT_TYPES = [
  {
    label: "Object Count",
    value: IMAGE_ANNOTATION_TYPE.DETECTION,
  },
  {
    label: "Classification Count",
    value: IMAGE_ANNOTATION_TYPE.CLASSIFICATION,
  },
];

const TIME_RANGE_TYPES = [
  {
    label: "Daily",
    value: "",
  },
  {
    label: "Weekly",
    value: "",
  },
  {
    label: "Monthly",
    value: "",
  },
];

export default function ProjectDetailOverview() {
  const { projectId, isAdminOrProjectAdmin, isProjectLabelerOrReviewer } =
    useProjectDetail();
  const { overview, loading, stats, error } = useProjectDetailOverview();

  const defaultToolType = useMemo(() => {
    return overview?.objects.some(
      (ob) => ob.tool_type === IMAGE_ANNOTATION_TYPE.DETECTION
    ) === true
      ? IMAGE_ANNOTATION_TYPE.DETECTION
      : IMAGE_ANNOTATION_TYPE.CLASSIFICATION;
  }, [overview]);

  const [toolType, setToolType] = useState(defaultToolType);

  const objects = useMemo(() => {
    return overview?.objects
      ? overview.objects.filter((ob) => ob.tool_type === toolType)
      : [];
  }, [overview, toolType, defaultToolType]);

  const columns = useMemo(() => {
    const total = objects.reduce((acc, cur) => {
      return acc + cur.count;
    }, 0);
    return [
      {
        title: "Label",
        key: "label",
        dataIndex: "object",
        // eslint-disable-next-line react/display-name
        render: (data) => {
          if (isAdminOrProjectAdmin) {
            return (
              <Link
                to={`/i/projects/${projectId}/labels/works?label=${data}&status=${WORK_ITEM_STATUS.COMPLETED}`}
              >
                {data}
              </Link>
            );
          }
          return <Text>{data}</Text>;
        },
      },
      {
        title: "Count",
        key: "count",
        dataIndex: "count",
        align: "center",
      },
      {
        title: "Shares",
        key: "count",
        dataIndex: "count",
        // eslint-disable-next-line react/display-name
        render: (d) => {
          return (
            <FormatNumber
              number={(total ? d / total : 0) * 100}
              postfix={"%"}
            />
          );
        },
        align: "right",
      },
    ];
  }, [objects]);

  return (
    <>
      <PageLayout
        loading={loading === "pending"}
        isReady={loading === "fulfilled"}
        error={error}
        height="50vh"
      >
        {overview && (
          <Row justify="start">
            <Col span={24}>
              <Col>
                <Row
                  justify="space-between"
                  align="top"
                  className="layout-content-overview"
                >
                  <Col className="trada-custom-date">Process</Col>
                </Row>
                {isAdminOrProjectAdmin && (
                  <Row
                    justify="space-around"
                    className="layout-content-overview"
                  >
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_unassigned}
                      </Row>
                      <Row className="project-info-style">Unassigned</Row>
                    </Col>
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_assigned}
                      </Row>
                      <Row className="project-info-style">Assigned</Row>
                    </Col>
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_validating}
                      </Row>
                      <Row className="project-info-style">Validating</Row>
                    </Col>
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_completed}
                      </Row>
                      <Row className="project-info-style">Completed</Row>
                    </Col>
                  </Row>
                )}
                {isProjectLabelerOrReviewer && (
                  <Row
                    justify="space-around"
                    className="layout-content-overview"
                  >
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_remaining}
                      </Row>
                      <Row className="project-info-style">Remaining</Row>
                    </Col>
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_validation}
                      </Row>
                      <Row className="project-info-style">Validating</Row>
                    </Col>
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_rejected}
                      </Row>
                      <Row className="project-info-style">Rejected</Row>
                    </Col>
                    <Col>
                      <Row className="trada-custom-date" justify="center">
                        {overview.workitem_completed}
                      </Row>
                      <Row className="project-info-style">Completed</Row>
                    </Col>
                  </Row>
                )}
              </Col>
              <Col>
                <Row
                  className="layout-content-overview"
                  justify="space-between"
                >
                  <Row className="trada-custom-date">Labels created</Row>
                  {/* <DropdownMenu data={TIME_RANGE_TYPES} /> */}
                </Row>
                <Row>
                  <RenderLineChart
                    data={stats?.LabeledItem_Count}
                    dataLine="total"
                    dataX="date"
                  />
                </Row>
              </Col>
            </Col>
            <Col className="layout-content-overview" span={24}>
              <>
                <DropdownMenu
                  defaultValue={defaultToolType}
                  onChange={setToolType}
                  data={LABEL_COUNT_TYPES}
                  mapDataFromKey={() => {}}
                />
              </>
              <Table
                style={{ marginTop: "10px" }}
                dataSource={objects}
                columns={columns}
                size="small"
                pagination={false}
              ></Table>
            </Col>
          </Row>
        )}
      </PageLayout>
    </>
  );
}
