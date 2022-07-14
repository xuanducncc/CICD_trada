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
import { useRouteMatch } from "react-router-dom";

const DEFAULT_FORM = {
  name: "",
  id: null,
  projects: [],
};

const DatasetCreationContext = createContext({
  formData: DEFAULT_FORM,
  setFormData: null,
  uploadDataset: null,
  createDataset: null,
  fetchDataset: null,
  uploadDatasetZip: null,
  numFileSuccess: null,
  numFileError: null,
  resetNumfile: null,
});
export const DatasetCreationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const numFileError = useSelector(
    datasetSelectors.selectDatasetActionReduceNumFileError
  );
  const numFileSuccess = useSelector(
    datasetSelectors.selectDatasetActionReduceNumFileSuccess
  );

  const createDataset = async (dataset) => {
    const result = await dispatch(datasetAction.createDataset(dataset));

    if (result.error) {
      return;
    }

    const createdData = result.payload;
    setFormData({
      ...formData,
      id: createdData.response.id,
    });
    return createdData;
  };

  const uploadDataset = useCallback(
    (file) => {
      const payload = new FormData();
      payload.append("image", file);
      payload.append("dataset_id", +formData.id);
      return dispatch(datasetAction.uploadDataset(payload));
    },
    [formData]
  );

  const uploadDatasetZip = useCallback(
    (file) => {
      const payload = new FormData();
      payload.append("file", file);
      const response = dispatch(
        datasetAction.uploadDatasetZip({ payload, id: +formData.id })
      );
      return response;
    },
    [formData.id]
  );

  const fetchDataset = useCallback(async () => {
    await dispatch(datasetAction.fetchDataset());
  }, [dispatch]);

  const resetNumfile = useCallback(() => {
    dispatch(datasetAction.resetNumFile());
  });

  const contextValue = useMemo(
    () => ({
      formData,
      setFormData,
      uploadDataset,
      createDataset,
      fetchDataset,
      uploadDatasetZip,
      numFileError,
      numFileSuccess,
      resetNumfile,
    }),
    [
      uploadDataset,
      createDataset,
      formData,
      setFormData,
      fetchDataset,
      uploadDatasetZip,
      numFileSuccess,
      numFileError,
      resetNumfile,
    ]
  );

  return (
    <DatasetCreationContext.Provider value={contextValue}>
      {children}
    </DatasetCreationContext.Provider>
  );
};

export function withDatasetCreationContext(Component) {
  return function WrapperComponent(props) {
    return (
      <DatasetCreationProvider>
        <Component {...props} />
      </DatasetCreationProvider>
    );
  };
}

export const useDatasetCreation = () => useContext(DatasetCreationContext);
export default useDatasetCreation;
