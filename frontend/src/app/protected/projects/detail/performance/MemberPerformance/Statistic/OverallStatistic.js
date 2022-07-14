import React, { useMemo } from 'react';
import PipeChartFigure from '@components/PipeChartFigure';
import useMemberPerformance from '../MemberPerformanceContext';

const OverallStatistic = () => {

  const { memberPerformance, overview } = useMemberPerformance();

  const data = useMemo(() => {
    return [
      {
        color: '#4E57D9',
        key: 'annotating',
        name: 'Remaining',
        value: overview.workitem_remaining,
      },
      {
        color: '#03EB70',
        key: 'submitted',
        name: 'Submitted',
        value: memberPerformance.workitem_submit,
      },
      {
        color: 'green',
        key: 'completed',
        name: 'Completed',
        value: overview.workitem_completed,
      },
      {
        color: 'red',
        key: 'rejected',
        name: 'Rejected',
        value: overview.workitem_rejected,
      },
    ]
  }, [memberPerformance, overview])

  return (
    <PipeChartFigure data={data} />
  )
}

export default OverallStatistic;
