import { projectsActions } from "@core/redux/projects";
import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect
} from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectCreation from "../../ProjectCreationContext";

const AddInstructionContext = createContext({
  addInstruction: null,
  instruction: null,
  loading: null
})

export const AddInstructionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { projectMutation, createdProjectId } = useProjectCreation();

  const instruction = projectMutation.instruction;
  const loading = projectMutation.loading;

  const addInstruction = useCallback((fileInfor) => {
    const payload = new FormData();
    payload.append("project_id", createdProjectId);
    payload.append("title", fileInfor.title)
    payload.append("attachment", fileInfor.file);
    dispatch(projectsActions.createNewProjectInstruction(payload))
  }, [])

  const contextValue = useMemo(
    () => ({
      addInstruction,
      instruction,
      loading
    }),
    [
      addInstruction,
      instruction,
      loading
    ]
  );
  return (
    <AddInstructionContext.Provider value={contextValue}>
      {children}
    </AddInstructionContext.Provider>
  )
};

export function withAddInstructionContext(Component) {
  return function WrapperComponent(props) {
    return (
      <AddInstructionProvider>
        <Component {...props} />
      </AddInstructionProvider>
    )
  }
}

export const useAddInstruction = () => useContext(AddInstructionContext);

export default useAddInstruction;