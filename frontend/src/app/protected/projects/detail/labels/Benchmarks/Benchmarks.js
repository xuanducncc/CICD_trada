import React from "react";
import { styled } from "@material-ui/styles";
import GeneralBenchmarks from "./GeneralBenchmarks/GeneralBenchmarks";
import CrossCheckingBenchmarks from "./CrossCheckingBenchmarks/CrossCheckingBenchmarks";
import ReviewingBenchmarks from "./ReviewingBenchmarks/ReviewingBenchmarks";
import PageLayout from "@components/PageLayout/PageLayout";
import useProjectDetailBenchmarks from "./BenchmarksContext";

const PageWrapper = styled("div")({});

const PageSectionWrapper = styled("section")({});

const PageSection = ({ header, children }) => {
  return (
    <PageSectionWrapper>
      <h2>{header}</h2>
      <div>{children}</div>
    </PageSectionWrapper>
  );
};

export default function BenchmarksPage() {
  const { isLoading, isReady, error } = useProjectDetailBenchmarks();
  return (
    <PageLayout loading={isLoading} isReady={isReady} error={error}>
      <PageWrapper>
        <PageSection header="General Benchmarks">
          <GeneralBenchmarks />
        </PageSection>
        <PageSection header="Cross checking Benchmarks">
          <CrossCheckingBenchmarks />
        </PageSection>
        <PageSection header="Reviewing Benchmarks">
          <ReviewingBenchmarks />
        </PageSection>
      </PageWrapper>
    </PageLayout>
  );
}
