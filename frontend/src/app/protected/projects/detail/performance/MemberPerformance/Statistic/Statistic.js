import { styled } from "@material-ui/styles";
import React, { useMemo } from "react";
import PipeChartFigure from '@components/PipeChartFigure';
import Descriptions from 'antd/lib/descriptions';
import OverallStatistic from "./OverallStatistic";
import AnnotatedStatistic from "./AnnotatedStatistic";
import CompletionStatistic from "./CompletionStatistic";

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

export default function Statistic() {
  return (
    <Wrapper>
      <Section header={"Overall"}>
        <OverallStatistic />
      </Section>
      <Section header={"Acceptance"}>
        <AnnotatedStatistic />
      </Section>
      <Section header={"Completion"}>
        <CompletionStatistic />
      </Section>
    </Wrapper>
  );
}
