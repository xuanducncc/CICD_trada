import React, { createContext, useCallback, useMemo, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import useProjectDetail from "../ProjectDetailContext";
import { useRouteMatch } from "react-router-dom";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
const ExportContext = createContext({
  exportLoadingState: "idle",
  handleExport: null,
});

export const ExportContextProvider = ({ children }) => {
  const exportLoadingState = useSelector(
    projectsSelectors.selectProjectExportLoading
  );
  // const {generateExport}=useProjectDetail()
  const dispatch = useDispatch();
  const { pid } = useRouteMatch().params;
  const handleExport = (exportType) => {
    // exportType for another type in the future
    dispatch(projectsActions.exportProject(pid));
  };

  const contextValue = useMemo(
    () => ({
      exportLoadingState,
      handleExport,
    }),
    [exportLoadingState, handleExport]
  );
  return (
    <ExportContext.Provider value={contextValue}>
      {children}
    </ExportContext.Provider>
  );
};
export const useExportContext = () => useContext(ExportContext);
// export default useExportContext
