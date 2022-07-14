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
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useLocation } from "react-use";

const ListDataContext = createContext({
  medias: null,
  error: null,
  loading: null,
  deleteDataset: null,
  currentPage: null,
  totalItems: null,
  totalPages: null,
  updateParams: null,
});

export const ListDataProvider = ({ children, datasetId, page }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();
  const medias = useSelector(datasetSelectors.selectDatasetMediasList);
  const error = useSelector(datasetSelectors.selectDatasetDetailError);
  const loading = useSelector(datasetSelectors.selectDatasetMediasLoading);
  const currentPage = useSelector(
    datasetSelectors.selectDatasetMediasCurrentPage
  );
  const totalItems = useSelector(
    datasetSelectors.selectDatasetMediasTotalItems
  );
  const totalPages = useSelector(
    datasetSelectors.selectDatasetMediasTotalPages
  );

  const deleteDataset = useCallback(() => {
    dispatch(datasetAction.deleteDataset({ datasetId }));
  }, [datasetId]);

  const updateParams = useCallback(
    ({ page }) => {
      dispatch(datasetAction.fetchDatasetMedias({ datasetId, page }));
    },
    [dispatch, datasetId, page]
  );

  useEffect(() => {
    updateParams({ page });
  }, [dispatch]);

  useEffect(() => {
    const [path] = pathname.split("?");
    const pageSlug = currentPage ? `page=${currentPage}` : "";
    const searchParams = [pageSlug].filter((x) => x).join("&");
    const searchUrl = searchParams ? `?${searchParams}` : "";
    history.replace(`${path}${searchUrl}`);
  }, [history, pathname, currentPage]);

  const contextValue = useMemo(
    () => ({
      medias,
      error,
      loading,
      currentPage,
      totalItems,
      totalPages,
      deleteDataset,
      updateParams,
    }),
    [
      medias,
      error,
      loading,
      currentPage,
      totalItems,
      totalPages,
      deleteDataset,
      updateParams,
    ]
  );

  return (
    <ListDataContext.Provider value={contextValue}>
      {children}
    </ListDataContext.Provider>
  );
};

export const useListData = () => useContext(ListDataContext);
export default useListData;
