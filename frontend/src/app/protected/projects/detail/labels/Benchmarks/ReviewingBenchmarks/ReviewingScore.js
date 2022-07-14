import React from "react";
import Descriptions from "antd/lib/descriptions";
import useProjectDetailBenchmarks from "../BenchmarksContext";
import FormatNumber from "@components/FormatNumber/FormatNumber";

const ReviewingScore = () => {
  const { overview } = useProjectDetailBenchmarks();
  const reviewScore =
    overview.total_like + overview.total_dislike != 0
      ? overview.total_like / (overview.total_like + overview.total_dislike)
      : 0;
  return (
    <Descriptions>
      <Descriptions.Item label="Total like ">
        <FormatNumber number={overview.total_like} />
      </Descriptions.Item>
      <Descriptions.Item label="Total dislike">
        <FormatNumber number={overview.total_dislike} />
      </Descriptions.Item>
      <Descriptions.Item label="Average score ">
        <FormatNumber number={reviewScore} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ReviewingScore;
