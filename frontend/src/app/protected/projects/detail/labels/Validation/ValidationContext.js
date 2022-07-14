import { useSearchParams } from "@core/hooks/useSearchParams";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import { WORK_ITEM_STATUS } from "@utils/const";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import useProjectDetail from "../../ProjectDetailContext";

const ValidationContext = createContext({
  queues: null,
  loading: null,
  error: null,
  projectId: null,
  updateParams: null,
  totalItems: null,
  currentPage: null,
  currentStatus: null,
});

// eslint-disable-next-line react/display-name
export const ValidationProvider = React.memo(({ children, page, status }) => {
  const { projectId } = useProjectDetail();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentPage = useSelector(projectsSelectors.selectProjectBatchesPage);
  const currentStatus = useSelector(projectsSelectors.selectProjectBatchStatus);
  const totalPages = useSelector(
    projectsSelectors.selectProjectBatchesTotalPages
  );
  const totalItems = useSelector(
    projectsSelectors.selectProjectBatchesTotalItems
  );
  const queues = useSelector(projectsSelectors.selectProjectBatchesList);
  const loading = useSelector(projectsSelectors.selectProjectBatchesLoading);
  const error = useSelector(projectsSelectors.selectProjectBatchesError);
  const { pathname } = useLocation();

  const updateParams = useCallback(
    ({ page, status }) => {
      dispatch(projectsActions.fetchProjectBatch({ projectId, page, status }));
    },
    [projectId]
  );

  useEffect(() => {
    const [path] = pathname.split("?");
    const statusSlug = currentStatus ? `status=${currentStatus}` : "";
    const pageSlug = currentPage ? `page=${currentPage}` : "";
    const searchParams = [statusSlug, pageSlug].filter((x) => x).join("&");
    const searchUrl = searchParams ? `?${searchParams}` : "";
    history.replace(`${path}${searchUrl}`);
  }, [pathname, currentPage, currentStatus]);

  useEffect(() => {
    updateParams({ page, status });
  }, [projectId]);

  const contextValue = useMemo(
    () => ({
      queues,
      totalItems,
      currentPage,
      loading,
      error,
      projectId,
      currentStatus,
      updateParams,
    }),
    [
      queues,
      loading,
      error,
      projectId,
      totalItems,
      currentPage,
      currentStatus,
      updateParams,
    ]
  );

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  );
});

export function withValidationContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ValidationProvider>
        <Component {...props} />
      </ValidationProvider>
    );
  };
}

export const useValidation = () => useContext(ValidationContext);

export default useValidation;
