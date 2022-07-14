import { datasetAction, datasetSelectors } from "@core/redux/datasets";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import useProjectCreation from "../../ProjectCreationContext";

const ChooseDataContext = createContext({
  createDataset: null,
  uploadDataset: null,
  availableDatasets: null,
  attachedDatasets: null,
  attachDataset: null,
  detachDataset: null,
  onHandleClose: null,
  uploadDatasetZip: null,
  numFileSuccess: null,
  numFileError: null
});

export const ChooseDataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const datasetLoading = useSelector(datasetSelectors.selectDatasetLoading);
  const datasetList = useSelector(datasetSelectors.selectDatasetListAll);
  const numFileSuccess = useSelector(datasetSelectors.selectDatasetActionReduceNumFileSuccess);
  const numFileError = useSelector(datasetSelectors.selectDatasetActionReduceNumFileError)
  const createdId = useSelector(datasetSelectors.selectDatasetActionCreatedDatasetId);
  const { projectMutation, createdProjectId } = useProjectCreation();
  const datasetCreated = useSelector(
    (state) => state.datasets.datasetActionReduce.createDataset
  );

  const onHandleClose = useCallback(() => {
    attachDataset(createdId);
    dispatch(datasetAction.resetNumFile())
  }, [createdId]);

  const attachedDatasets = useMemo(() => {
    return projectMutation.data.attachedDatasets;
  }, [projectMutation]);

  const availableDatasets = useMemo(() => {
    return (datasetList || []).filter((dat) => {
      return !(attachedDatasets || []).some(aDat => aDat.id === dat.id)
    });
  }, [datasetList, availableDatasets, attachedDatasets]);

  const createDataset = useCallback(async (datasetName) => {
    const result = await dispatch(
      datasetAction.createDataset({
        name: datasetName,
        projects: [createdProjectId],
      })
    );
    if (result.error) { return; }

    const createdData = result.payload;

    return createdData;
  }, [createdProjectId]);

  const uploadDataset = useCallback((dataset) => {
    const payload = new FormData();
    payload.append("image", dataset);
    payload.append("dataset_id", +datasetCreated.response.id);
    return dispatch(datasetAction.uploadDataset(payload));
  }, [dispatch, datasetCreated]);

  const uploadDatasetZip = useCallback(
    (file) => {
      const payload = new FormData();
      payload.append("file", file);
      const response = dispatch(datasetAction.uploadDatasetZip({ payload, id: +datasetCreated.response.id }));
      return response;
    },
    [dispatch, datasetCreated]
  );

  const attachDataset = useCallback((dataset_id) => {
    dispatch(
      projectsActions.attachProject({
        dataset_id,
        project_id: +createdProjectId,
      })
    );
  }, [createdProjectId]);

  const detachDataset = useCallback((dataset_id) => {
    dispatch(
      projectsActions.detachProject({
        dataset_id,
        project_id: +createdProjectId,
      })
    );
  }, [createdProjectId]);

  useEffect(() => {
    if (datasetLoading === "idle") {
      dispatch(datasetAction.fetchDataset());
    }
  }, [datasetLoading]);

  const contextValue = useMemo(
    () => ({
      createDataset,
      uploadDataset,
      availableDatasets,
      attachedDatasets,
      attachDataset,
      detachDataset,
      onHandleClose,
      uploadDatasetZip,
      numFileSuccess,
      numFileError
    }),
    [
      createDataset,
      uploadDataset,
      availableDatasets,
      attachedDatasets,
      attachDataset,
      detachDataset,
      onHandleClose,
      uploadDatasetZip,
      numFileSuccess,
      numFileError
    ]
  );

  return (
    <ChooseDataContext.Provider value={contextValue}>
      {children}
    </ChooseDataContext.Provider>
  );
};

export function withChooseDataContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ChooseDataProvider>
        <Component {...props} />
      </ChooseDataProvider>
    );
  };
}

export const useChooseData = () => useContext(ChooseDataContext);

export default useChooseData;
