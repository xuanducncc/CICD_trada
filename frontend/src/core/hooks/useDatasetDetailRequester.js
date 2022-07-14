import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { datasetAction, datasetSelectors } from '@core/redux/datasets';
import { useRouteMatch } from "react-router-dom";

export default function useDatasetDetailRequester({ datasetId }) {
  const dispatch = useDispatch();
  const requestedId = useSelector(
    datasetSelectors.selectDatasetDetailRequestedId
  );
  const dataset = useSelector(datasetSelectors.selectDatasetDetailInstance);
  const medias = useSelector(datasetSelectors.selectDatasetDetailMedias);
  const error = useSelector(datasetSelectors.selectDatasetDetailError);
  const loading = useSelector(datasetSelectors.selectDatasetDetailLoading);
  const numFileSuccess = useSelector(datasetSelectors.selectDatasetActionReduceNumFileSuccess);
  const numFileError = useSelector(datasetSelectors.selectDatasetActionReduceNumFileError);

  useEffect(() => {
    if (!datasetId) {
      return;
    }
    if (requestedId === datasetId) {
      return;
    }

    dispatch(
      datasetAction.requestDatasetId({ id: datasetId })
    );
  }, [requestedId, datasetId, dispatch]);

  return {
    dataset,
    medias,
    datasetId,
    requestedId,
    error,
    loading,
    numFileSuccess,
    numFileError
  };
}
