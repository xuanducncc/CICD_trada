import React from 'react';
import { styled } from '@material-ui/styles';
import ChartCanvas from './ChartCanvas';
import ChartExplain from './ChartExplain';

const RadarChartFigureWrapper = styled('div')({
  display: 'flex',
});

const RadarChartFigureCanvasWrapper = styled('div')({
  flex: '1',
});

const RadarChartFigureExplainWrapper = styled('div')({
  flex: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});


const RadarChartFigure = ({ data, isShow, isProfile }) => {
  return (
    <RadarChartFigureWrapper>
      <RadarChartFigureCanvasWrapper>
        <ChartCanvas data={data} isShow={isShow} isProfile={isProfile} />
      </RadarChartFigureCanvasWrapper>
      <RadarChartFigureExplainWrapper>
        <ChartExplain data={data} />
      </RadarChartFigureExplainWrapper>
    </RadarChartFigureWrapper>
  )
}

export default RadarChartFigure;
