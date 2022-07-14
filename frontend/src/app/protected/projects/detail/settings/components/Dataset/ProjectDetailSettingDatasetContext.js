import { datasetSelectors, datasetAction } from "@core/redux/datasets";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectDetail from "../../../ProjectDetailContext";

const ProjectDetailSettingDatasetContext = createContext({
  datasetList: null,
  attachDataset: null,
  detachDataset: null,
});
export const ProjectDetailSettingDatasetProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { projectId } = useProjectDetail();
  const datasetList = useSelector(datasetSelectors.selectDatasetListAll);
  const loading = useSelector(datasetSelectors.selectDatasetLoading);

  const attachDataset = async (dataset_id) => {
    await dispatch(
      projectsActions.attachProject({ dataset_id, project_id: +projectId })
    );
    await dispatch(projectsActions.requestProjectId({ id: projectId }));
  };

  const detachDataset = async (dataset_id) => {
    await dispatch(
      projectsActions.detachProject({ dataset_id, project_id: +projectId })
    );
    await dispatch(projectsActions.requestProjectId({ id: projectId }));
  };

  const contextValue = useMemo(
    () => ({
      datasetList,
      attachDataset,
      detachDataset,
    }),
    [datasetList, attachDataset, detachDataset]
  );

  useEffect(() => {
    if (loading === "idle") {
      dispatch(datasetAction.fetchDataset());
    }
  }, [loading]);

  return (
    <ProjectDetailSettingDatasetContext.Provider value={contextValue}>
      {children}
    </ProjectDetailSettingDatasetContext.Provider>
  );
};

export function withProjectDetailSettingDatasetContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailSettingDatasetProvider>
        <Component {...props} />
      </ProjectDetailSettingDatasetProvider>
    );
  };
}

export const useProjectDetailSettingDataset = () =>
  useContext(ProjectDetailSettingDatasetContext);

export default useProjectDetailSettingDataset;
