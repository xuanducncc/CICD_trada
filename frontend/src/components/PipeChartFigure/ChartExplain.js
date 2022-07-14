import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { styled } from "@material-ui/styles";
import { Button } from "antd";
import Descriptions from "antd/lib/descriptions";
import React, { useState } from "react";
import { Link } from "react-router-dom"

const ChartExplainWrapper = styled("div")({});

const ChartExplainLabelWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
});

const ChartExplainLabelColor = styled("div")({
  width: "1em",
  height: "1em",
  marginRight: '0.5em',
  backgroundColor: ({ color }) => `${color}`,
});

const ChartExplainLabelName = styled("div")({});

const ChartExplainLabel = ({ item, index }) => {
  const COLORS = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
  return (
    <ChartExplainLabelWrapper>
      <ChartExplainLabelColor color={item.color ? item.color : COLORS[index % COLORS.length]}></ChartExplainLabelColor>
      <ChartExplainLabelName>{item.name}</ChartExplainLabelName>
    </ChartExplainLabelWrapper>
  );
};

const ChartExplain = ({ data, showMore }) => {
  const [size, setSize] = useState(6);
  return (
    <ChartExplainWrapper>
      <Descriptions layout="horizontal" column={1}>
        {data.slice(0, size).map((dat, index) => (
          <Descriptions.Item
            label={<ChartExplainLabel item={dat} index={index} />}
            key={dat.key}
          >
            {dat.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      { (showMore && data?.length > 6) && (
        size === data?.length ? (
          <a
            type="primary"
            onClick={() => setSize(6)}
          >
            Show less
          </a>
        ) : (
          <a
            type="primary"
            onClick={() => setSize(data?.length)}
          >
            Show more
          </a>
        )
      )}
    </ChartExplainWrapper>
  );
};

export default ChartExplain;
