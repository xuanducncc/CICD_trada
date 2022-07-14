import React, { useMemo } from "react";
import PipeChartFigure from "@components/PipeChartFigure";
import useProjectDetailBenchmarks from "../BenchmarksContext";

const CompletionBenchmarks = () => {
  const { overview } = useProjectDetailBenchmarks();

  const data = useMemo(() => {
    const annotated =
      overview.workitem_validating +
      overview.workitem_reviewing +
      overview.workitem_completed +
      overview.workitem_rejected;

    return [
      {
        color: "blue",
        key: "annotated",
        name: "Annotated",
        value: annotated,
      },
      {
        color: "gray",
        key: "skipped",
        name: "Skipped",
        value: overview.workitem_skipped,
      },
    ];
  }, [overview]);

  return <PipeChartFigure data={data} />;
};

export default CompletionBenchmarks;
