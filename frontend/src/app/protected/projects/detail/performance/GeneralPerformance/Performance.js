import React, { useEffect, useState } from "react";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import useProjectPerformance from "./ProjectPerformanceContext";
import { withProjectPerformanceContext } from "./ProjectPerformanceContext";
import PerformanceInforComponent from "./PerformanceInfor";
import MembersPerformance from "./MembersPerformance";
import { useRouteMatch } from "react-router";
import PipeChartFigure from "@components/PipeChartFigure";
import RenderAreaChart from "./AreaCharts";
import PageLayout from "@components/PageLayout/PageLayout";
import DropdownMenu from "../../overview/DropdownMenu";
import { PROJECT_MEMBER_ROLES } from "@utils/const";

const PerformancePage = () => {
  const {
    stats,
    labelers,
    memberLoading,
    memberError,
    dataLoading,
    dataError,
    statLoading,
    statError,
    history,
    isAdminOrProjectAdmin,
    project,
  } = useProjectPerformance();

  const COLORS = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];

  const dataChart = labelers?.map((mem, index) => {
    return {
      value: mem.label_count,
      key: String(mem.id),
      name: String(mem?.user?.username),
      color: COLORS[index % COLORS.length],
    };
  });
  const myPer = labelers?.find((l) => l.id === project?.member?.id)
    ? [labelers?.find((l) => l.id === project?.member?.id)]
    : [];
  const isShowPieChart = dataChart.every((data) => data.value === 0);
  const [dataLine, setDataLine] = useState("count");
  const ARR_VIEW_SELECTION = [
    {
      label: `Object Count:  ${stats?.Avg_Count}`,
      value: "count",
    },
    {
      label: `Time Per:  ${stats?.Avg_Time_Per}`,
      value: "Time_Per_Label",
    },
    {
      label: `Total_Time:  ${stats?.Avg_Total_Time}`,
      value: "Total_Time",
    },
  ];
  return (
    <Col>
      <Col>
        <Row
          className="layout-content-overview"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Row className="trada-custom-date">Labels count</Row>
          <Col span={5}>
            <DropdownMenu
              data={ARR_VIEW_SELECTION}
              placeholder="select a view"
              onChange={(e) => setDataLine(e)}
              defaultValue="count"
            />
          </Col>
        </Row>
        <PageLayout
          loading={dataLoading === "pending"}
          isReady={dataLoading === "fulfilled"}
          empty={dataError}
          padding={0}
        >
          <PerformanceInforComponent stats={stats} dataLine={dataLine} />
        </PageLayout>
      </Col>
      <Col>
        <Row className="layout-content-overview">
          <Row className="trada-custom-date">Labels history</Row>
        </Row>
        <PageLayout
          loading={dataLoading === "pending"}
          isReady={dataLoading === "fulfilled"}
          empty={dataError}
          padding={0}
        >
          <RenderAreaChart history={history} />
        </PageLayout>
      </Col>
      <Col>
        <Row className="layout-content-overview">
          <Row className="trada-custom-date">Labels contributors</Row>
        </Row>
        <PageLayout
          loading={memberLoading === "pending"}
          isReady={memberLoading === "fulfilled"}
          empty={memberError || isShowPieChart}
          padding={0}
          style={{ paddingLeft: "40px" }}
        >
          {isShowPieChart ? (
            <></>
          ) : (
            <PipeChartFigure data={dataChart} isShow={true} showMore={true} />
          )}
        </PageLayout>
      </Col>
      {myPer?.length !== 0 || isAdminOrProjectAdmin == true ? (
        <Col>
          <Row className="layout-content-overview">
            <Row className="trada-custom-date">
              {isAdminOrProjectAdmin
                ? "Individual performance"
                : "My performance"}
            </Row>
          </Row>
          <PageLayout
            loading={memberLoading === "pending"}
            isReady={memberLoading === "fulfilled"}
            empty={memberError}
            padding={0}
          >
            <Row
              className="layout-content-overview"
              style={{ paddingLeft: "60px" }}
            >
              <MembersPerformance
                labelers={isAdminOrProjectAdmin ? labelers : myPer}
              />
            </Row>
          </PageLayout>
        </Col>
      ) : (
        <></>
      )}
    </Col>
  );
};

// export default withProjectPerformanceContext(PerformancePage)
export default PerformancePage;
