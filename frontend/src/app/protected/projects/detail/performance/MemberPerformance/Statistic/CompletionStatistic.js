import React, { useMemo } from 'react';
import PipeChartFigure from '@components/PipeChartFigure';
import useMemberPerformance from '../MemberPerformanceContext';

const CompletionStatistic = () => {
  const { memberPerformance } = useMemberPerformance();

  const data = useMemo(() => {
    return [
      {
        color: 'blue',
        key: 'annotated',
        name: 'Submitted',
        value: memberPerformance?.workitem_submit,
      },
      {
        color: 'gray',
        key: 'skipped',
        name: 'Skipped',
        value: memberPerformance?.workitem_skip,
      },
    ]
  }, [memberPerformance]);

  return (
    <PipeChartFigure data={data} />
  )
}

export default CompletionStatistic;
