import { combineReducers } from "redux";

import datasetList, { fetchDataset } from "./datasetList";
import datasetDetail, { requestDatasetId } from "./datasetDetail";
import datasetMedias, {
  fetchDatasetMedias,
  datasetMediasAdapter,
} from "./datasetMedias";
import datasetActionReduce, {
  createDataset,
  datasetSlice,
  deleteDataset,
  uploadDataset,
  uploadDatasetZip,
} from "./datasetAction";
import { createSelector } from "reselect";

export default combineReducers({
  datasetList,
  datasetDetail,
  datasetActionReduce,
  datasetMedias,
});

const selectSelf = (state) => state.datasets;

const selectDatasetList = createSelector(
  selectSelf,
  (state) => state.datasetList
);

const selectDatasetListAll = createSelector(
  selectDatasetList,
  (state) => state.datasets
);

const selectDatasetLoading = createSelector(
  selectDatasetList,
  (state) => state.loading
);

const selectDatasetError = createSelector(
  selectDatasetList,
  (state) => state.error
);

const selectDatasetDetail = createSelector(
  selectSelf,
  (state) => state.datasetDetail
);

const selectDatasetDetailRequestedId = createSelector(
  selectDatasetDetail,
  (state) => state.requestedId
);

const selectDatasetDetailInstance = createSelector(
  selectDatasetDetail,
  (state) => state.dataset
);

const selectDatasetDetailLoading = createSelector(
  selectDatasetDetail,
  (state) => state.loading
);

const selectDatasetDetailError = createSelector(
  selectDatasetDetail,
  (state) => state.error
);

const selectDatasetActionReduce = createSelector(
  selectSelf,
  (state) => state.datasetActionReduce
);

const selectDatasetActionCreatedDatasetId = createSelector(
  selectDatasetActionReduce,
  (state) => state?.createDataset?.response?.id
);

const selectDatasetActionReduceNumFileSuccess = createSelector(
  selectDatasetActionReduce,
  (state) => state.numFileSuccess
);

const selectDatasetActionReduceNumFileError = createSelector(
  selectDatasetActionReduce,
  (state) => state.numFileError
);

const selectDatasetMedias = createSelector(
  selectSelf,
  (state) => state.datasetMedias
);

const datasetMediasSelectors =
datasetMediasAdapter.getSelectors(selectDatasetMedias);

const selectDatasetMediasList = datasetMediasSelectors.selectAll;

const selectDatasetMediasLoading = createSelector(
  selectDatasetMedias,
  (state) => state.loading
);

const selectDatasetMediasError = createSelector(
  selectDatasetMedias,
  (state) => state.error
);

const selectDatasetMediasTotalPages = createSelector(
  selectDatasetMedias,
  (state) => state.totalPages
);

const selectDatasetMediasTotalItems = createSelector(
  selectDatasetMedias,
  (state) => state.totalItems
);

const selectDatasetMediasCurrentPage = createSelector(
  selectDatasetMedias,
  (state) => state.currentPage
);

export const datasetAction = {
  fetchDataset,
  requestDatasetId,
  createDataset,
  deleteDataset,
  uploadDataset,
  uploadDatasetZip,
  resetNumFile: datasetSlice.actions.resetNumfile,
  fetchDatasetMedias,
};

export const datasetSelectors = {
  selectDatasetListAll,
  selectDatasetList,
  selectDatasetLoading,
  selectDatasetError,
  selectDatasetDetailInstance,
  selectDatasetDetailLoading,
  selectDatasetDetailError,
  selectDatasetDetailRequestedId,
  selectDatasetActionCreatedDatasetId,
  selectDatasetActionReduceNumFileSuccess,
  selectDatasetActionReduceNumFileError,
  selectDatasetMediasCurrentPage,
  selectDatasetMediasTotalItems,
  selectDatasetMediasTotalPages,
  selectDatasetMediasError,
  selectDatasetMediasLoading,
  selectDatasetMediasList,
};
