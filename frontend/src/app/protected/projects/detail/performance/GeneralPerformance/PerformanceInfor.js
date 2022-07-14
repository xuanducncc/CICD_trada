import React, { useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
import RenderLineChart from "../../overview/LineCharts";
import { Radio } from "antd";
import DropdownMenu from "../../overview/DropdownMenu";
const PerformanceInforComponent = (props) => {
  const { stats, styleOption, styleColRadio, styleColLineChart, dataLine } = props;
  return (
    <Row>
      <RenderLineChart
        data={stats?.LabeledItem_Count}
        dataLine={dataLine}
        dataX="date"
      />
    </Row>
  );
}

export default PerformanceInforComponent;
