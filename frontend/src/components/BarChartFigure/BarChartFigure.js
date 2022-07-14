import React from 'react';
import { styled } from '@material-ui/styles';
import ChartCanvas from './ChartCanvas';
import ChartExplain from './ChartExplain';

const BarChartFigureWrapper = styled('div')({
  display: 'flex',
});

const BarChartFigureCanvasWrapper = styled('div')({
  flex: '1',
});


const BarChartFigure = ({ data }) => {
  return (
    <BarChartFigureWrapper>
      <BarChartFigureCanvasWrapper>
        <ChartCanvas data={data} />
      </BarChartFigureCanvasWrapper>
    </BarChartFigureWrapper>
  )
}

export default BarChartFigure;
