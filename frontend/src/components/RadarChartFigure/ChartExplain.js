import FormatNumber from "@components/FormatNumber/FormatNumber";
import { styled } from "@material-ui/styles";
import Descriptions from "antd/lib/descriptions";
import React from "react";

const ChartExplainWrapper = styled("div")({});

const ChartExplainLabelWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
});

const ChartExplainLabelName = styled("div")({});

const ChartExplainLabel = ({ item, index }) => {
  return (
    <ChartExplainLabelWrapper>
      <ChartExplainLabelName>{item.name}</ChartExplainLabelName>
    </ChartExplainLabelWrapper>
  );
};

const ChartExplain = ({ data }) => {
  return (
    <ChartExplainWrapper>
      <Descriptions layout="horizontal" column={1}>
        {data.map((dat, index) => (
          <Descriptions.Item
            label={<ChartExplainLabel item={dat} index={index} />}
            key={dat.key}
          >
            <FormatNumber number={dat.value} />
          </Descriptions.Item>
        ))}
      </Descriptions>
    </ChartExplainWrapper>
  );
};

export default ChartExplain;
