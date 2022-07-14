import { styled } from "@material-ui/styles";
import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Text from "antd/lib/typography/Text";
import React from "react";
import AnnotatedBenchmarks from "./AnnotatedBenchmarks";
import CompletionBenchmarks from "./CompletionBenchmarks";
import LabelsShareBenchmarks from "./LabelsShareBenchmarks";
import OverallBenchmarks from "./OverallBenchmarks";
import ProgressBenchmarks from "./ProgressBenchmarks";
import WorkingBenchmarks from "./WorkingBenchmarks";

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

export default function GeneralBenchmarks() {
  return (
    <Wrapper>
      <Section header={"Progress"}>
        <ProgressBenchmarks />
      </Section>
      {/* <Section header={"Label Share"}>
        <LabelsShareBenchmarks />
      </Section> */}
      <Section header={"Overall"}>
        <OverallBenchmarks />
      </Section>
      <Section header={"Acceptance"}>
        <AnnotatedBenchmarks />
      </Section>
      <Section header={"Completion"}>
        <CompletionBenchmarks />
      </Section>
    </Wrapper>
  );
}
