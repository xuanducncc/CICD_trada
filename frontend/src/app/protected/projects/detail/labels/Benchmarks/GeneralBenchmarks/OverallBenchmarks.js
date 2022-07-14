import React, { useMemo } from 'react';
import PipeChartFigure from '@components/PipeChartFigure';
import useProjectDetailBenchmarks from '../BenchmarksContext';

const OverallBenchmarks = () => {
  const { overview } = useProjectDetailBenchmarks();

  const data = useMemo(() => {
    return [
      {
        color: 'gray',
        key: 'unassigned',
        name: 'Unassigned',
        value: overview.workitem_unassigned,
      },
      {
        color: '#4E57D9',
        key: 'annotating',
        name: 'Annotating',
        value: overview.workitem_annotating,
      },
      {
        color: '#03EB70',
        key: 'reviewing',
        name: 'Reviewing',
        value: overview.workitem_reviewing,
      },
      {
        color: '#03EC30',
        key: 'validating',
        name: 'Validating',
        value: overview.workitem_validating,
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
  }, [overview])

  return (
    <PipeChartFigure data={data} />
  )
}

export default OverallBenchmarks;
