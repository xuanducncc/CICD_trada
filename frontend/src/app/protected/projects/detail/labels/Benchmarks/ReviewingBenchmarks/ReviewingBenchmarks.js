import { styled } from "@material-ui/styles";
import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Text from "antd/lib/typography/Text";
import React from "react";
import ReviewingRate from "./ReviewingRate";
import ReviewingScore from "./ReviewingScore";

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

export default function ReviewingBenchmarks() {
  return (
    <Wrapper>
      <Section header={'Reviewing Rate'}>
        <ReviewingRate />
      </Section>

      <Section header={'Reviewing Score'}>
        <ReviewingScore />
      </Section>
    </Wrapper>
  );
}
