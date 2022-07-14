import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const RenderLineChart = (props) => {
  const { data, dataLine, dataX } = props;

  function formatXAxis(tickItem) {
    if (tickItem == "0") {
      return moment().format("MMM D");
    }
    if (tickItem === "auto") {
      return moment().add(1, "days").format("MMM D");
    }
    return moment(tickItem).format("MMM D");
  }

  return (
    <div style={{ width: "100%", height: "250px" }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey={dataLine} stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey={dataX} tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RenderLineChart;
