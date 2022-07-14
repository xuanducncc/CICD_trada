import React, { useMemo } from 'react';
import PipeChartFigure from '@components/PipeChartFigure';
import useProjectDetailBenchmarks from '../BenchmarksContext';

const AnnotatedBenchmarks = () => {
  const { overview } = useProjectDetailBenchmarks();

  const data = useMemo(() => {
    return [
      {
        color: 'green',
        key: 'accepted',
        name: 'Total accepted',
        value: overview.workitem_completed,
      },
      {
        color: 'red',
        key: 'rejected',
        name: 'Total rejected',
        value: overview.total_rejected,
      },
    ]
  }, [overview])

  return (
    <PipeChartFigure data={data} />
  )
}

export default AnnotatedBenchmarks;
