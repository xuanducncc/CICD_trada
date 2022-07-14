import { styled } from "@material-ui/styles";
import {
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  PolarGrid,
  ResponsiveContainer,
} from "recharts";
import React from "react";

const ChartCanvasWrapper = styled("div")({
  width: "400px",
  height: "400px",
});

const ChartCanvas = ({ data, isShow, isProfile }) => {
  return (
    <ChartCanvasWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="label" />
          <PolarRadiusAxis domain={[0, 100]} />
          <Radar
            name={isProfile ? "Mine" : "Member"}
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          {isProfile ? (
            <></>
          ) : (
            <Radar
              name="Average"
              dataKey="avg"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCanvasWrapper>
  );
};

export default ChartCanvas;
