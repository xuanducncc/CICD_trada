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
import useDatasetDetail from "../DatasetDetailContext";

const AddDataContext = createContext({
  uploadDataset: null,
  loading: null,
  datasetId: null,
  error: null,
  numFileError: null,
  numFileSuccess: null,
  uploadDatasetZip: null,
});
export const AddDataProvider = ({ children, datasetId }) => {
  const dispatch = useDispatch();

  const error = useSelector(datasetSelectors.selectDatasetDetailError);
  const loading = useSelector(datasetSelectors.selectDatasetDetailLoading);
  const numFileSuccess = useSelector(datasetSelectors.selectDatasetActionReduceNumFileSuccess);
  const numFileError = useSelector(datasetSelectors.selectDatasetActionReduceNumFileError);

  const uploadDatasetZip = useCallback(
    (file) => {
      const payload = new FormData();
      payload.append("file", file);
      const response = dispatch(
        datasetAction.uploadDatasetZip({ payload, id: datasetId })
      );
      return response;
    },
    [datasetId]
  );

  const uploadDataset = useCallback(
    (file) => {
      const payload = new FormData();
      payload.append("image", file);
      payload.append("dataset_id", datasetId);
      const response = dispatch(datasetAction.uploadDataset(payload));
      return response;
    },
    [datasetId]
  );


  const contextValue = useMemo(
    () => ({
      datasetId,
      error,
      loading,
      numFileError,
      numFileSuccess,
      uploadDataset,
      uploadDatasetZip,
    }),
    [
      datasetId,
      error,
      loading,
      numFileError,
      numFileSuccess,
      uploadDataset,
      uploadDatasetZip,
    ]
  );

  return (
    <AddDataContext.Provider value={contextValue}>
      {children}
    </AddDataContext.Provider>
  );
};

export const useAddData = () => useContext(AddDataContext);
export default useAddData;
