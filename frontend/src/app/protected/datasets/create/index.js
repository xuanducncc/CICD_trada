import React from 'react';
import DatasetCreate from './DatasetCreate';
import { DatasetCreationProvider } from './DatasetCreationContext';

const DatasetCreatePage = () => {
  return (
    <DatasetCreationProvider>
      <DatasetCreate />
    </DatasetCreationProvider>
  )
}
export default DatasetCreatePage;
