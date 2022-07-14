import React, { useMemo } from "react";
import PipeChartFigure from "@components/PipeChartFigure";
import useProjectDetailBenchmarks from "../BenchmarksContext";

const ReviewingRate = () => {
  const { overview } = useProjectDetailBenchmarks();

  const data = useMemo(() => {
    return [
      {
        color: "blue",
        key: "review",
        name: "Review",
        value: overview.workitem_review,
      },
      {
        color: "gray",
        key: "non",
        name: "Non review",
        value: overview.workitem_non_review,
      },
    ];
  }, [overview]);

  return <PipeChartFigure data={data} />;
};

export default ReviewingRate;
