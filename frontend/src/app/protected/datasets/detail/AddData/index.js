import React from "react";
import AddData from "./AddData";
import { AddDataProvider } from "./AddDataContext";
import useDatasetDetail from "../DatasetDetailContext";

const AddDataWithContext = () => {
  const { datasetId } = useDatasetDetail();
  return (
    <AddDataProvider datasetId={datasetId}>
      <AddData />
    </AddDataProvider>
  );
};

export default AddDataWithContext;
