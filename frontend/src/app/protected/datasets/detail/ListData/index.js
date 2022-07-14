import { useSearchParams } from "@core/hooks/useSearchParams";
import React from "react";
import useDatasetDetail from "../DatasetDetailContext";
import ListData from "./ListData";
import { ListDataProvider } from "./ListDataContext";

const ListDataWithContext = () => {
  const { datasetId } = useDatasetDetail();
  const { page = 1 } = useSearchParams();

  return (
    <ListDataProvider page={page} datasetId={datasetId}>
      <ListData />
    </ListDataProvider>
  );
};

export default ListDataWithContext;
