import { datasetSelectors, datasetAction } from "@core/redux/datasets";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import useProjectDetail from "../../../ProjectDetailContext";

const ProjectDetailSettingGeneralContext = createContext({
  settings: null,
  updateSettings: null,
  setUpdateProjectSetting: null
});

export const ProjectDetailSettingGeneralProvider = ({ children }) => {
  const { projectId } = useProjectDetail();
  const dispatch = useDispatch();
  const settings = useSelector(projectsSelectors.selectProjectSettings)
  const setUpdateProjectSetting = useCallback((settings) => {
    dispatch(projectsActions.setUpdateProjectSettings(settings))
  }, [dispatch])

  const updateSettings = (settings) => {
    dispatch(projectsActions.createProjectSettings({ ...settings, project_id: parseInt(projectId) }))
  }

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
      setUpdateProjectSetting
    }),
    [settings, updateSettings, setUpdateProjectSetting]
  );

  return (
    <ProjectDetailSettingGeneralContext.Provider value={contextValue}>
      {children}
    </ProjectDetailSettingGeneralContext.Provider>
  );
};

export function withProjectDetailSettingGeneralContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailSettingGeneralProvider>
        <Component {...props} />
      </ProjectDetailSettingGeneralProvider>
    );
  };
}

export const useProjectDetailSettingGeneral = () =>
  useContext(ProjectDetailSettingGeneralContext);

export default useProjectDetailSettingGeneral;
