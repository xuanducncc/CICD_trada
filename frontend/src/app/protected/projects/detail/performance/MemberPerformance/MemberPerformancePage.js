import React, { useEffect, useState, useMemo } from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Loading from '@components/Loading';
import { useRouteMatch } from "react-router";
import Button from "antd/lib/button";
import useMemberPerformance from "./MemberPerformanceContext";
import PerformanceInforComponent from "../GeneralPerformance/PerformanceInfor";
import Statistic from "./Statistic/Statistic";
import MemberInformation from "./MemberInformation/MemberInformation";
import History from "./History/History";
import Benchmark from "./Benchmark/Benchmark";
import FormatNumber from "@components/FormatNumber/FormatNumber";
import DropdownMenu from "../../overview/DropdownMenu";

const MemberPerformancePage = () => {
  const { path } = useRouteMatch();
  const [isShowHistory, setShowHistory] = useState(false);
  const { member, memberStats, loading } = useMemberPerformance();

  const styleOption = {
    display: "table",
    height: "30px",
    width: "100%",
    marginBottom: "5px",
  };
  const [dataLine, setDataLine] = useState("count");
  const ARR_VIEW_SELECTION = [
    {
      label: `Object Count:  ${memberStats?.Avg_Count}`,
      value: "count"
    },
    {
      label: `Time Per:  ${memberStats?.Avg_Time_Per}`,
      value: "Time_Per_Label"
    },
    {
      label: `Total_Time:  ${memberStats?.Avg_Total_Time}`,
      value: "Total_Time"
    },
  ]
  return (
    <>
      {loading === "pending" && <Loading />}
      {member && (
        <Row justify="start">
          <Col flex={1}>
            <Col>
              <MemberInformation member={member} />
            </Col>
            <Col>
              <Row
                justify="space-between"
                align="top"
                className="layout-content-overview"
              >
                <Col className="trada-custom-date">Working Information</Col>
              </Row>
              <Row justify="space-around" className="layout-content-overview">
                <Col>
                  <Row className="trada-custom-date" justify="center">
                    <FormatNumber number={member?.accuracy} />
                  </Row>
                  <Row className="project-info-style">Accuracy</Row>
                </Col>
                <Col>
                  <Row className="trada-custom-date" justify="center">
                    {member?.skip_count}
                  </Row>
                  <Row className="project-info-style">Skip</Row>
                </Col>
                <Col>
                  <Row className="trada-custom-date" justify="center">
                    {member?.completed_rate}
                  </Row>
                  <Row className="project-info-style">Completed rate</Row>
                </Col>
                <Col>
                  <Row className="trada-custom-date" justify="center">
                    {member?.submit_count}
                  </Row>
                  <Row className="project-info-style">Submit</Row>
                </Col>
              </Row>
            </Col>
          </Col>
          <Col style={{ width: "100%" }}>
            <Row className="layout-content-overview" justify="space-between">
              <Col className="trada-custom-date">Labels created</Col>
              <DropdownMenu
                data={ARR_VIEW_SELECTION}
                placeholder="select a view"
                onChange={(e) => setDataLine(e)}
                defaultValue="count"
              />
            </Row>
            <PerformanceInforComponent
              stats={memberStats}
              dataLine={dataLine}
            />
          </Col>
          <Col>
            <Row
              justify="space-between"
              align="top"
              className="layout-content-overview"
            >
              <Col className="trada-custom-date">Benchmarks</Col>
              <Col style={{ padding: "0 40px" }}>
                <Benchmark />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row
              justify="space-between"
              align="top"
              className="layout-content-overview"
            >
              <Col className="trada-custom-date">Statistic</Col>
              <Col style={{ padding: "0 40px" }}>
                <Statistic />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row
              justify="space-between"
              align="top"
              className="layout-content-overview"
            >
              <Col className="trada-custom-date">History</Col>
            </Row>
            <Row style={{ padding: "0 65px", display: "inherit" }}>
              <Button
                onClick={() => setShowHistory(!isShowHistory)}
                type="primary"
                style={{ marginBottom: "10px" }}
              >
                {isShowHistory ? "Hide History" : "Show History"}
              </Button>
              {isShowHistory ? <History /> : <></>}
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default MemberPerformancePage;
