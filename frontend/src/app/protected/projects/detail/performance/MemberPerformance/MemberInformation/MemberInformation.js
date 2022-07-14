import React from "react";
import { Button, Descriptions, Tag } from 'antd';
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import LocalDate from "@components/LocalDate/LocalDate";
import { useHistory } from "react-router";
import useMemberPerformance from "../MemberPerformanceContext";
import FormatNumber from "@components/FormatNumber/FormatNumber";

const MemberInformation = ({ member }) => {
  const history = useHistory()
  const { memberPerformance } = useMemberPerformance();
  // Completion score
  const CS = memberPerformance.workitem_submit
    ? (memberPerformance.workitem_submit * 100) /
    (memberPerformance.workitem_submit +
      memberPerformance.workitem_skip)
    : 0;
  // Review score
  const RS = memberPerformance.vote_like
    ? (memberPerformance.vote_like * 100) /
    (memberPerformance.vote_like + memberPerformance.vote_dislike)
    : 0;
  // Cross check score
  const CSS = memberPerformance?.accuracy;
  // Acceptance score
  const AS = memberPerformance.workitem_accepted
    ? (memberPerformance.workitem_accepted * 100) /
    (memberPerformance.workitem_accepted +
      memberPerformance.workitem_rejected)
    : 0;
  // Project score
  const project_score = (CS + RS + CSS + AS) / 4;
  const ViewProfile = (id) => {
    history.push(`/i/user/${id}/profile`)
  }
  return (
    <>
      <Row
        justify="space-between"
        align="top"
        className="layout-content-overview"
      >
        <Col className="trada-custom-date">General Information</Col>
        <Button type="primary" onClick={() => ViewProfile(member?.user?.id)}>View Profile</Button>
      </Row>
      <Row>
        <Col style={{ padding: "0 40px" }}>
          <Descriptions>
            <Descriptions.Item label="User">{member?.user?.username}</Descriptions.Item>
            <Descriptions.Item label="Joined date"><LocalDate date={member?.join_date} /></Descriptions.Item>
            <Descriptions.Item label="Benchmark date"><LocalDate date={member?.benchmark_date} /></Descriptions.Item>
            <Descriptions.Item label="Role">
              {member?.role.map((r) => (<Tag color="green" key={r.name}>{r.name}</Tag>))}
            </Descriptions.Item>
            <Descriptions.Item label="Project score">{<FormatNumber number={project_score} />}</Descriptions.Item>
            <Descriptions.Item label="General score">{member?.user?.credit_score}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  )
}

export default MemberInformation;
