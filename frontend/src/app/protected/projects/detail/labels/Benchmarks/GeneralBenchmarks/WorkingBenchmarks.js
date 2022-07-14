import React, { useMemo } from 'react';
import PipeChartFigure from '@components/PipeChartFigure';
import useProjectDetailBenchmarks from '../BenchmarksContext';

const WorkingBenchmarks = () => {
  const { stats } = useProjectDetailBenchmarks();

  const data = useMemo(() => {
    return [
      {
        color: '#4E57D9',
        key: 'annotating',
        name: 'Annotating',
        value: stats.workingWorkItems,
      },
      {
        color: '#03EB70',
        key: 'submitted',
        name: 'Submitted',
        value: stats.submittedWorkItems,
      },
    ]
  }, [stats])

  return (
    <PipeChartFigure data={data} />
  )
}

export default WorkingBenchmarks;
