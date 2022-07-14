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
import useProjectQueuesRequester from "@core/hooks/useProjectQueuesRequester";
import useProjectDetail from "../../ProjectDetailContext";
import useProtected from "@components/Protected/ProtectedContext";
import { projectsSelectors } from "@core/redux/projects";
import { useSearchParams } from "@core/hooks/useSearchParams";
import { WORK_ITEM_STATUS } from "@utils/const";
import { useHistory, useLocation } from "react-router";

const ProjectDetailQueueContext = createContext({
  queues: null,
  user: null,
  isAdminOrProjectAdmin: null,
  projectId: null,
  member: null,
  status: null,
  page: null,
  currentPage: null,
  currentStatus: null,
  totalPages: null,
  totalItems: null,
  loading: null,
  error: null,
  label: null,
});

export const ProjectDetailQueueProvider = React.memo(({ children, status, page, label }) => {
  const { user } = useProtected();
  const history = useHistory();
  const { pathname } = useLocation();
  const member = useSelector(projectsSelectors.selectProjectDetailMember);
  const { projectId, memberId, isAdminOrProjectAdmin } = useProjectDetail();

  const {
    queues,
    loading,
    currentPage,
    currentStatus,
    totalPages,
    totalItems,
    error,
    updateParams,
  } = useProjectQueuesRequester({
    projectId,
    memberId: isAdminOrProjectAdmin ? null : memberId,
    status,
    label,
    page,
  });

  useEffect(() => {
    updateParams({ status, page, label });
  }, [status, page, label])

  useEffect(() => {
    const [path] = pathname.split("?");
    const statusSlug = currentStatus ? `status=${currentStatus}` : "";
    const pageSlug = currentPage ? `page=${currentPage}` : "";
    const labelSlug = label ? `label=${label}` : "";
    const searchParams = [statusSlug, pageSlug, labelSlug]
      .filter((x) => x)
      .join("&");
    const searchUrl = searchParams ? `?${searchParams}` : "";
    history.replace(`${path}${searchUrl}`);
  }, [history, pathname, page, currentPage, status, currentStatus, label]);

  const contextValue = useMemo(
    () => ({
      queues,
      user,
      isAdminOrProjectAdmin,
      projectId,
      member,
      status,
      page,
      currentPage,
      currentStatus,
      totalPages,
      totalItems,
      updateParams,
      loading,
      error,
      label,
    }),
    [
      queues,
      user,
      isAdminOrProjectAdmin,
      projectId,
      member,
      status,
      page,
      currentPage,
      currentStatus,
      totalPages,
      totalItems,
      updateParams,
      loading,
      error,
      label,
    ]
  );

  return (
    <ProjectDetailQueueContext.Provider value={contextValue}>
      {children}
    </ProjectDetailQueueContext.Provider>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.status !== nextProps.status ||
    prevProps.page !== nextProps.page ||
    prevProps.label !== nextProps. label
  )
});

export function withProjectDetailQueueContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailQueueProvider>
        <Component {...props} />
      </ProjectDetailQueueProvider>
    );
  };
}

export const useProjectDetailQueue = () =>
  useContext(ProjectDetailQueueContext);

export default useProjectDetailQueue;
