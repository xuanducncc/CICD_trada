import useDatasetDetailRequester from "@core/hooks/useDatasetDetailRequester";
import { datasetAction, datasetSelectors } from "@core/redux/datasets";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouteMatch } from "react-router-dom";

const DatasetDetailContext = createContext({
  datasetId: null,
  dataset: null,
  loading: null,
  error: null,
});

export const DatasetDetailProvider = ({ children, did }) => {
  const dispatch = useDispatch();
  const dataset = useSelector(datasetSelectors.selectDatasetDetailInstance);
  const error = useSelector(datasetSelectors.selectDatasetDetailError);
  const loading = useSelector(datasetSelectors.selectDatasetDetailLoading);

  const datasetId = useMemo(() => {
    return dataset?.id;
  }, [dataset]);

  useEffect(() => {
    dispatch(datasetAction.requestDatasetId({ id: did }));
  }, [dispatch, did]);

  const contextValue = useMemo(
    () => ({
      datasetId,
      dataset,
      loading,
      error,
    }),
    [datasetId, dataset, loading, error]
  );

  return (
    <DatasetDetailContext.Provider value={contextValue}>
      {children}
    </DatasetDetailContext.Provider>
  );
};

export const useDatasetDetail = () => useContext(DatasetDetailContext);
export default useDatasetDetail;
