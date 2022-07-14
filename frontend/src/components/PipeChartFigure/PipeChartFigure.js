import React from 'react';
import { styled } from '@material-ui/styles';
import ChartCanvas from './ChartCanvas';
import ChartExplain from './ChartExplain';

const PipeChartFigureWrapper = styled('div')({
  display: 'flex',
});

const PipeChartFigureCanvasWrapper = styled('div')({
  flex: '1',
});

const PipeChartFigureExplainWrapper = styled('div')({
  flex: '1',
});


const PipeChartFigure = ({ data, isShow, showMore }) => {
  return (
    <PipeChartFigureWrapper>
      <PipeChartFigureCanvasWrapper>
        <ChartCanvas data={data} isShow={isShow} />
      </PipeChartFigureCanvasWrapper>
      <PipeChartFigureExplainWrapper>
        <ChartExplain data={data} showMore={showMore} />
      </PipeChartFigureExplainWrapper>
    </PipeChartFigureWrapper>
  )
}

export default PipeChartFigure;
