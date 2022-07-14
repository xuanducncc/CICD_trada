import { datasetAction, datasetSelectors } from "@core/redux/datasets";
import FuzzySearch from 'fuzzy-search';
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


const DatasetPageContext = createContext({
  deleteDataset: null,
  error: null,
  datasetLoading: null,
  searchTerm: null,
  setSearchTerm: null,
  datasets: null,
});

export const DatasetPageProvider = ({ children }) => {
  const dispatch = useDispatch();
  const datasetLoading = useSelector(datasetSelectors.selectDatasetLoading);
  const error = useSelector(datasetSelectors.selectDatasetError);

  const allDatasets = useSelector((state) => state.datasets.datasetList.datasets);

  const [searchTerm, setSearchTerm] = useState("");

  const datasets = useMemo(() => {
    const searcher = new FuzzySearch(allDatasets, ["name"], {
      caseSensitive: false,
    });
    const result = searcher.search(searchTerm);
    return result;
  }, [allDatasets, searchTerm]);

  const deleteDataset = async (id) => {
    await dispatch(datasetAction.deleteDataset(parseInt(id)));
    await dispatch(datasetAction.fetchDataset());
  };

  const contextValue = useMemo(
    () => ({
      datasets,
      deleteDataset,
      datasetLoading,
      error,
      searchTerm,
      setSearchTerm,
    }),
    [
      datasets,
      deleteDataset,
      datasetLoading,
      error,
      searchTerm,
      setSearchTerm,
    ]
  );

  useEffect(() => {
    if (datasetLoading === "idle") {
      dispatch(datasetAction.fetchDataset());
    }
  }, [datasetLoading]);

  return (
    <DatasetPageContext.Provider value={contextValue}>
      {children}
    </DatasetPageContext.Provider>
  );
};

export function withDatasetPageContext(Component) {
  return function WrapperComponent(props) {
    return (
      <DatasetPageProvider>
        <Component {...props} />
      </DatasetPageProvider>
    );
  };
}

export const useDatasetPage = () => useContext(DatasetPageContext);
export default useDatasetPage;
