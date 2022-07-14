import { projectsActions, projectsSelectors } from "@core/redux/projects";
import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectDetail from "../../../ProjectDetailContext";

const ProjectDetailSettingInstructionContext = createContext({
  instruction_list: null,
  instruction_item: null,
  addInstruction: null,
  loading: null,
  fetchInstructionItem: null
});

export const ProjectDetailSettingInstructionProvider = ({ children }) => {
  const { projectId } = useProjectDetail();
  const dispatch = useDispatch();
  const instruction_list = useSelector(projectsSelectors.selectProjectDetailInstructionList);
  const instruction_item = useSelector(projectsSelectors.selectProjectDetailInstructionItem);
  const loading = useSelector(projectsSelectors.selectProjectDetailLoading);

  const addInstruction = useCallback(async (fileInfor) => {
    const payload = new FormData();
    payload.append("project_id", projectId);
    payload.append("title", fileInfor.title)
    payload.append("attachment", fileInfor.file);
    const result = await dispatch(projectsActions.updateProjectInstruction(payload))
    if (result?.payload?.response) {
      await dispatch(projectsActions.fetchListInstruction(projectId));
    }
  }, [dispatch]);

  const fetchInstructionItem = useCallback((id) => {
    dispatch(projectsActions.fetchItemInstruction(id));
  }, [dispatch])

  const contextValue = useMemo(
    () => ({
      instruction_list,
      instruction_item,
      loading,
      addInstruction,
      fetchInstructionItem
    }),
    [instruction_list, instruction_item, loading, addInstruction, fetchInstructionItem]
  );

  return (
    <ProjectDetailSettingInstructionContext.Provider value={contextValue}>
      {children}
    </ProjectDetailSettingInstructionContext.Provider>
  );
};

export function withProjectDetailSettingInstructionContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailSettingInstructionProvider>
        <Component {...props} />
      </ProjectDetailSettingInstructionProvider>
    );
  };
}

export const useProjectDetailSettingInstruction = () =>
  useContext(ProjectDetailSettingInstructionContext);

export default useProjectDetailSettingInstruction;
