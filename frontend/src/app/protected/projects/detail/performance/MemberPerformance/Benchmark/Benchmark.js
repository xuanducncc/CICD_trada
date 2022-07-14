import { styled } from "@material-ui/styles";
import React, { useMemo } from "react";
import PipeChartFigure from "@components/PipeChartFigure";
import Descriptions from "antd/lib/descriptions";
import RadarChartFigure from "@components/RadarChartFigure";
import useMemberPerformance from "../MemberPerformanceContext";

const Wrapper = styled("div")({});
const SectionWrapper = styled("div")({});

const Section = ({ header, children }) => {
  return (
    <SectionWrapper>
      <h3>{header}</h3>
      <div>{children}</div>
    </SectionWrapper>
  );
};

export default function Benchmark() {
  const { memberPerformance, projectPerformance } = useMemberPerformance();

  const data = useMemo(() => {
    return [
      {
        label: "CS",
        name: "Completion score (CS)",
        key: "completion_score",
        value: memberPerformance.workitem_submit
          ? (memberPerformance.workitem_submit * 100) /
          (memberPerformance.workitem_submit +
            memberPerformance.workitem_skip)
          : 0,
        avg: projectPerformance.workitem_submit
          ? (projectPerformance.workitem_submit * 100) /
          (projectPerformance.workitem_submit +
            projectPerformance.workitem_skip)
          : 0,
        max: 100,
      },
      {
        name: "Review score (RS)",
        label: "RS",
        key: "review_score",
        value: memberPerformance.vote_like
          ? (memberPerformance.vote_like * 100) /
          (memberPerformance.vote_like + memberPerformance.vote_dislike)
          : 0,
        avg: projectPerformance.vote_like
          ? (projectPerformance.vote_like * 100) /
          (projectPerformance.vote_like + projectPerformance.vote_dislike)
          : 0,
        max: 100,
      },
      {
        name: "Cross check score (CCS)",
        label: "CCS",
        key: "cross_check_score",
        value: memberPerformance.accuracy,
        avg: projectPerformance.accuracy,
        max: 100,
      },
      {
        name: "Acceptance score (AS)",
        label: "AS",
        key: "acceptance_score",
        value: memberPerformance.workitem_accepted
          ? (memberPerformance.workitem_accepted * 100) /
          (memberPerformance.workitem_accepted +
            memberPerformance.workitem_rejected)
          : 0,
        avg: projectPerformance.workitem_accepted
          ? (projectPerformance.workitem_accepted * 100) /
          (projectPerformance.workitem_accepted +
            projectPerformance.workitem_rejected)
          : 0,
        max: 100,
      },
      // {
      //   label: "TPS",
      //   name: "Time per label score (TPS)",
      //   key: "time_per_label_score",
      //   value: memberPerformance.time_per_min
      //     ? 100 -
      //       (Math.abs(
      //         memberPerformance.time_per - memberPerformance.time_per_min
      //       ) *
      //         100) /
      //         memberPerformance.time_per_min
      //     : 0,
      //   avg: projectPerformance.time_per_min
      //     ? 100 -
      //       (Math.abs(
      //         projectPerformance.time_per - projectPerformance.time_per_min
      //       ) *
      //         100) /
      //         projectPerformance.time_per_min
      //     : 0,
      //   max: 100,
      // },
    ];
  }, [memberPerformance, projectPerformance]);
  return (
    <Wrapper>
      <Section>
        <RadarChartFigure data={data} />
      </Section>
    </Wrapper>
  );
}
