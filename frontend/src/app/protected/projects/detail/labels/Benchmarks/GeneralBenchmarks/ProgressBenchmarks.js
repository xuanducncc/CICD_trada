import { styled } from "@material-ui/styles";
import React, { useMemo } from "react";
import formatDuration from 'date-fns/formatDuration'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useProjectDetailBenchmarks from "../BenchmarksContext";

function formattedTime(seconds) {
  const duration = formatDuration({ seconds });
  return duration;
}

const ProgressChartWrapper = styled("div")({
  width: "900px",
  height: "400px",
});

const ProgressBenchmarks = () => {
  const { overview } = useProjectDetailBenchmarks();

  const data = useMemo(() => {
    const totalTime = overview?.workitem_working_time;
    const submitted =
      overview?.workitem_completed +
      overview?.workitem_reviewing +
      overview?.workitem_rejected +
      overview?.workitem_validating;
    const timePerWorkItem = totalTime / submitted;
    const remainingWorkItem = overview?.workitem_unassigned;
    const acceptanceRate =
      overview?.workitem_rejected /
      (overview?.workitem_completed + overview?.workitem_rejected);
    const completionRate =
    overview?.workitem_skipped / (overview?.workitem_skipped + submitted);
    const estimatedRemainingWorkItem =
      remainingWorkItem + remainingWorkItem * completionRate * acceptanceRate;
    const estimatedRemainingTime = estimatedRemainingWorkItem * timePerWorkItem;

    const estimatedTotalWorkItems = Math.round(
      submitted + estimatedRemainingWorkItem
    );
    const estimatedTotalTime = Math.round(totalTime + estimatedRemainingTime);

    return [
      {
        name: 0,
        submitted: 0,
      },
      {
        name: overview?.workitem_working_time,
        submitted: submitted,
        estimated: submitted,
      },
      {
        name: estimatedTotalTime,
        estimated: estimatedTotalWorkItems,
      },
    ];
  }, [overview]);
  return (
    <ProgressChartWrapper>
      <ResponsiveContainer width="90%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 120,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            type="number"
            tickFormatter={(tick) => formattedTime(tick)}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(tick) => formattedTime(tick)}
          />
          <Area type="monotone" dataKey="submitted" stroke="blue" fill="blue" />
          <Area type="monotone" dataKey="estimated" stroke="gray" fill="gray" />
        </AreaChart>
      </ResponsiveContainer>
    </ProgressChartWrapper>
  );
};

export default ProgressBenchmarks;
