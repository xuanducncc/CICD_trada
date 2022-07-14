import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const RenderAreaChart = ({ history = [] }) => {
  function formatXAxis(tickItem) {
    if (tickItem == "0") {
      return moment().format("MMM D");
    }
    if (tickItem === "auto") {
      return moment().add(1, "days").format("MMM D");
    }
    return moment(tickItem).format("MMM D");
  }
  const COLORS = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];

  const [firstData] = history || [];
  const { memberMap } = firstData || {};
  const memberStats = Object.values(memberMap || {});

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer>
        <AreaChart
          data={history}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" name="Date" tickFormatter={formatXAxis} />
          <YAxis name="Member" />
          <Tooltip
            wrapperStyle={{
              pointerEvents: "auto",
              overflowY: "scroll",
              maxHeight: "100%",
            }}
          />
          {memberStats?.map((stats, index) => {
            return (
              <Area
                type="monotone"
                key={stats.member.id}
                label={stats.member.username}
                name={stats.member.username}
                dataKey={(record) => record.memberMap[stats.member.id].count}
                stackId={"1"}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RenderAreaChart;
