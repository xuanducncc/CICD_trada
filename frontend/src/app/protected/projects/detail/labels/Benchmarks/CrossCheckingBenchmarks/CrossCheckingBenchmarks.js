import { styled } from "@material-ui/styles";
import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Text from "antd/lib/typography/Text";
import React from "react";
import CrossCheckingRate from "./CrossCheckingRate";
import CrossCheckingScore from "./CrossCheckingScore";

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

export default function CrossCheckingBenchmarks() {
  return (
    <Wrapper>
      <Section header={'Cross Checking Rate'}>
        <CrossCheckingRate />
      </Section>

      <Section header={'Cross Checking Score'}>
        <CrossCheckingScore />
      </Section>
    </Wrapper>
  );
}
