import React from "react";
import Descriptions from "antd/lib/descriptions";
import useProjectDetailBenchmarks from "../BenchmarksContext";

const CrossCheckingScore = () => {
  const { overview } = useProjectDetailBenchmarks();

  return (
    <Descriptions>
      <Descriptions.Item label="Average score ">
        {overview.avg_accuracy}%
      </Descriptions.Item>
    </Descriptions>
  );
};

export default CrossCheckingScore;
