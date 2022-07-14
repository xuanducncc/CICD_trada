import React, { useMemo } from 'react';
import PipeChartFigure from '@components/PipeChartFigure';
import useMemberPerformance from '../MemberPerformanceContext';

const AnnotatedStatistic = () => {
  const { memberPerformance, overview } = useMemberPerformance();

  const data = useMemo(() => {
    return [
      {
        color: 'green',
        key: 'accepted',
        name: 'Total accepted',
        value: memberPerformance.workitem_accepted,
      },
      {
        color: 'red',
        key: 'rejected',
        name: 'Total rejected',
        value: overview.total_rejected,
      },
    ]
  }, [memberPerformance, overview])

  return (
    <PipeChartFigure data={data} />
  )
}

export default AnnotatedStatistic;
