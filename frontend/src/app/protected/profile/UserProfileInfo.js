import { styled } from "@material-ui/styles";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Avatar from "antd/lib/avatar/avatar";
import { Descriptions, Tag } from "antd";
import React, { useMemo } from "react";
import { UserOutlined } from "@ant-design/icons";
import ReactStoreIndicator from "react-score-indicator";
import moment from "moment";
import "./style.css";
import RadarChartFigure from "@components/RadarChartFigure";

const Wrapper = styled("div")({});
const SectionWrapper = styled("div")({ width: "100%" });

const Section = ({ header, children }) => {
  return (
    <SectionWrapper>
      <h3>{header}</h3>
      <div>{children}</div>
    </SectionWrapper>
  );
};
const UserProfileInfo = ({ user, performance }) => {
  const data = useMemo(() => {
    return [
      {
        label: "CS",
        name: "Completion score (CS)",
        key: "completion_score",
        value: performance?.workitem_submit
          ? (performance?.workitem_submit * 100) /
          (performance?.workitem_submit +
            performance?.workitem_skip)
          : 0,
        max: 100,
      },
      {
        name: "Review score (RS)",
        label: "RS",
        key: "review_score",
        value: performance?.vote_like
          ? (performance?.vote_like * 100) /
          (performance?.vote_like + performance?.vote_dislike)
          : 0,
        max: 100,
      },
      {
        name: "Cross check score (CCS)",
        label: "CCS",
        key: "cross_check_score",
        value: performance?.accuracy,
        max: 100,
      },
      {
        name: "Acceptance score (AS)",
        label: "AS",
        key: "acceptance_score",
        value: performance?.workitem_accepted
          ? (performance?.workitem_accepted * 100) /
          (performance?.workitem_accepted +
            performance?.workitem_rejected)
          : 0,
        max: 100,
      },
    ]
  })
  return (
    <Row style={{ display: "flex", justifyContent: "space-between" }}>
      <Row>
        <Col xs={24} sm={24} lg={14}>
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <Col span={9} style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size={150} icon={<UserOutlined />} />
            </Col>
            <Col span={15}>
              <Descriptions style={{ paddingLeft: "20px" }} column={1}>
                <Descriptions.Item label="User name">
                  {user?.username}
                </Descriptions.Item>
                <Descriptions.Item label="First name">
                  {user?.first_name}
                </Descriptions.Item>
                <Descriptions.Item label="Last name">
                  {user?.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Joined date">
                  {moment(user?.date_joined).format("DD-MM-Y")}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  {user?.is_superuser === true ? (
                    <Tag color="green">ADMIN</Tag>
                  ) : (
                    <Tag color="green">LABELLER</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} lg={10}>
          <Row style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Col>
                <ReactStoreIndicator style={{ paddingTop: "20px" }} value={Math.ceil(performance?.credit_score)} maxValue={100} lineWidth={20} />
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
      <Row style={{ width: "100%" }}>
        <Section header={"Statistic"}>
          <Row justify="space-around" className="layout-content-overview">
            <Col>
              <Row className="trada-custom-date" justify="center">
                {user?.total_project}
              </Row>
              <Row className="project-info-style">Total Project</Row>
            </Col>
            <Col>
              <Row className="trada-custom-date" justify="center">
                {user?.total_workitem}
              </Row>
              <Row className="project-info-style">Total work Item</Row>
            </Col>
            <Col>
              <Row className="trada-custom-date" justify="center">
                {user?.total_labeleditem}
              </Row>
              <Row className="project-info-style">Total Labels</Row>
            </Col>
            <Col>
              <Row className="trada-custom-date" justify="center">
                {user?.total_liked}
              </Row>
              <Row className="project-info-style">Total Like</Row>
            </Col>
          </Row>
        </Section>
      </Row>

      <Row>
        <Section header={"Benchmarks"}>
          <Row style={{ display: "flex", justifyContent: "space-between" }}>
            <RadarChartFigure data={data} isProfile={true} />
          </Row>
        </Section>
      </Row>
    </Row>
  );
};

export default UserProfileInfo;
