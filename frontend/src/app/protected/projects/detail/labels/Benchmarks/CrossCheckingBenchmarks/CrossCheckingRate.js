import React, { useMemo } from "react";
import PipeChartFigure from "@components/PipeChartFigure";
import useProjectDetailBenchmarks from "../BenchmarksContext";

const CrossCheckingRate = () => {
  const { overview } = useProjectDetailBenchmarks();

  const data = useMemo(() => {
    return [
      {
        color: "blue",
        key: "overlapped",
        name: "Overlapped",
        value: overview.workitem_overlap,
      },
      {
        color: "gray",
        key: "original",
        name: "Original",
        value: overview.workitem_original,
      },
    ];
  }, [overview]);

  return <PipeChartFigure data={data} />;
};

export default CrossCheckingRate;
