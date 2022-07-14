import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback
} from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectMembersRequester from "@core/hooks/useProjectMembersRequester";
import useProjectDetail from "../../ProjectDetailContext";
import useProjectDataRequester from "@core/hooks/useProjectDataRequester";

const ProjectDetailBenchmarksContext = createContext({
  members: null,
  isLoading: null,
  isReady: null,
  error: null,
  overview: null,
});

export const ProjectDetailBenchmarksProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { projectId } = useProjectDetail();
  const {
    members,
    loading: memberLoading,
    error: memberError,
  } = useProjectMembersRequester({ projectId });

  const { overview, loading: statsLoading, error: statsError } = useProjectDataRequester({ projectId });

  const isLoading = useMemo(() => {
    return memberLoading === 'pending' && statsLoading === 'pending';
  }, [memberLoading, statsLoading])

  const isReady = useMemo(() => {
    return memberLoading === 'fulfilled' && statsLoading === 'fulfilled';
  }, [memberLoading, statsLoading])

  const error = useMemo(() => {
    return memberError || statsError;
  }, [memberError, statsError])

  const contextValue = useMemo(
    () => ({
      overview,
      members,
      isLoading,
      isReady,
      error,
    }),
    [
      overview,
      members,
      isLoading,
      isReady,
      error,
    ]
  );

  return (
    <ProjectDetailBenchmarksContext.Provider value={contextValue}>
      {children}
    </ProjectDetailBenchmarksContext.Provider>
  );
};

export function withProjectDetailBenchmarksContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailBenchmarksProvider>
        <Component {...props} />
      </ProjectDetailBenchmarksProvider>
    );
  };
}

export const useProjectDetailBenchmarks = () => useContext(ProjectDetailBenchmarksContext);

export default useProjectDetailBenchmarks;
