import React from "react";
import { useParams } from "react-router";
import DatasetDetail from "./DatasetDetail";
import { DatasetDetailProvider } from "./DatasetDetailContext";

const DatasetDetailWithContext = () => {
  const { did } = useParams();
  return (
    <DatasetDetailProvider did={did}>
      <DatasetDetail />
    </DatasetDetailProvider>
  );
};

export default DatasetDetailWithContext;
